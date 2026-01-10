import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerMessage, conversationHistory, contactName } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context from conversation history
    const historyContext = conversationHistory?.slice(-5).map((msg: any) => 
      `${msg.direction === 'inbound' ? 'Customer' : 'Agent'}: ${msg.content}`
    ).join('\n') || '';

    const systemPrompt = `You are an AI assistant helping customer service agents respond to WhatsApp messages. 
Your task is to generate 3 different smart reply suggestions that are:
1. Professional yet friendly
2. Concise (under 100 words each)
3. Contextually relevant to the conversation
4. Varied in tone: one formal, one casual-friendly, one empathetic

Customer Name: ${contactName || 'Customer'}
Recent Conversation:
${historyContext}

Latest Customer Message: "${customerMessage}"

Respond with ONLY a JSON array of exactly 3 reply suggestions. Each object should have:
- "text": The reply message
- "tone": "formal" | "friendly" | "empathetic"
- "label": A short 2-3 word label for the suggestion

Example format:
[
  {"text": "Thank you for reaching out...", "tone": "formal", "label": "Professional"},
  {"text": "Hey! Thanks for your message...", "tone": "friendly", "label": "Casual"},
  {"text": "I understand how you feel...", "tone": "empathetic", "label": "Understanding"}
]`;

    console.log("Generating smart replies for:", customerMessage?.substring(0, 50));

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate 3 smart reply suggestions for the customer message: "${customerMessage}"` },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add more credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate smart replies");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    // Parse the JSON response
    let suggestions = [];
    try {
      // Extract JSON array from response (handle markdown code blocks)
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback suggestions
      suggestions = [
        { text: "Thank you for your message. How can I assist you today?", tone: "formal", label: "Professional" },
        { text: "Hi there! Thanks for reaching out. What can I help you with?", tone: "friendly", label: "Casual" },
        { text: "I appreciate you contacting us. Let me help you with that.", tone: "empathetic", label: "Helpful" },
      ];
    }

    console.log("Generated suggestions:", suggestions.length);

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Smart reply error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
