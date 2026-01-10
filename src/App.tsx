import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Inbox from "./pages/Inbox";
import Campaigns from "./pages/Campaigns";
import Templates from "./pages/Templates";
import Contacts from "./pages/Contacts";
import Automation from "./pages/Automation";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/automation" element={<Automation />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
