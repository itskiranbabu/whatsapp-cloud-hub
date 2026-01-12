import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Clock,
  BookOpen,
  ChevronRight,
  Video,
  Filter,
  Search,
  ExternalLink,
  CheckCircle2,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: "getting-started" | "templates" | "automation" | "campaigns" | "analytics" | "advanced";
  difficulty: "beginner" | "intermediate" | "advanced";
  thumbnail: string;
  videoUrl: string;
  featured?: boolean;
  completed?: boolean;
}

// Placeholder tutorials - will be populated with actual video content
const tutorials: Tutorial[] = [
  {
    id: "1",
    title: "Getting Started with KeyRun Flow",
    description: "Learn the basics of setting up your WhatsApp Business API and sending your first message.",
    duration: "8:45",
    category: "getting-started",
    difficulty: "beginner",
    thumbnail: "/placeholder.svg",
    videoUrl: "#",
    featured: true,
  },
  {
    id: "2",
    title: "Creating Your First Template",
    description: "Step-by-step guide to creating WhatsApp message templates that get approved quickly.",
    duration: "6:30",
    category: "templates",
    difficulty: "beginner",
    thumbnail: "/placeholder.svg",
    videoUrl: "#",
    featured: true,
  },
  {
    id: "3",
    title: "Building Automation Flows",
    description: "Create powerful automation workflows with our drag-and-drop Flow Builder.",
    duration: "12:15",
    category: "automation",
    difficulty: "intermediate",
    thumbnail: "/placeholder.svg",
    videoUrl: "#",
  },
  {
    id: "4",
    title: "Running Broadcast Campaigns",
    description: "Send personalized bulk messages to thousands of contacts with CSV upload.",
    duration: "7:20",
    category: "campaigns",
    difficulty: "beginner",
    thumbnail: "/placeholder.svg",
    videoUrl: "#",
  },
  {
    id: "5",
    title: "Understanding Analytics Dashboard",
    description: "Track message delivery, read rates, and campaign performance in real-time.",
    duration: "5:45",
    category: "analytics",
    difficulty: "beginner",
    thumbnail: "/placeholder.svg",
    videoUrl: "#",
  },
  {
    id: "6",
    title: "Advanced Template Variables",
    description: "Master dynamic variables for personalized messaging at scale.",
    duration: "9:00",
    category: "templates",
    difficulty: "advanced",
    thumbnail: "/placeholder.svg",
    videoUrl: "#",
  },
  {
    id: "7",
    title: "Webhook & API Integration",
    description: "Connect external systems using webhooks and API calls in your flows.",
    duration: "15:30",
    category: "advanced",
    difficulty: "advanced",
    thumbnail: "/placeholder.svg",
    videoUrl: "#",
  },
  {
    id: "8",
    title: "Contact Segmentation Strategies",
    description: "Organize contacts with tags and segments for targeted messaging.",
    duration: "8:00",
    category: "campaigns",
    difficulty: "intermediate",
    thumbnail: "/placeholder.svg",
    videoUrl: "#",
  },
];

const categoryLabels: Record<string, string> = {
  "getting-started": "Getting Started",
  templates: "Templates",
  automation: "Automation",
  campaigns: "Campaigns",
  analytics: "Analytics",
  advanced: "Advanced",
};

const difficultyConfig: Record<string, { label: string; color: string }> = {
  beginner: { label: "Beginner", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  intermediate: { label: "Intermediate", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  advanced: { label: "Advanced", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

interface TutorialCardProps {
  tutorial: Tutorial;
  onWatch: (tutorial: Tutorial) => void;
}

const TutorialCard = ({ tutorial, onWatch }: TutorialCardProps) => {
  const difficulty = difficultyConfig[tutorial.difficulty];

  return (
    <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden">
      <div className="relative aspect-video bg-muted">
        <img
          src={tutorial.thumbnail}
          alt={tutorial.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={() => onWatch(tutorial)}
          >
            <Play className="h-6 w-6" />
          </Button>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {tutorial.duration}
        </div>
        {tutorial.featured && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-primary">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}
        {tutorial.completed && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-success/90 text-white">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Watched
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {tutorial.title}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {tutorial.description}
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {categoryLabels[tutorial.category]}
          </Badge>
          <Badge className={`text-xs ${difficulty.color}`}>
            {difficulty.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export const VideoTutorials = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesSearch =
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || tutorial.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredTutorials = tutorials.filter((t) => t.featured);

  const handleWatchTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    // In production, this would open the actual video player
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Video className="h-6 w-6 text-primary" />
            Video Tutorials
          </h2>
          <p className="text-muted-foreground">
            Learn how to use KeyRun Flow with step-by-step video guides
          </p>
        </div>
        <Badge variant="outline" className="hidden sm:flex">
          {tutorials.length} tutorials available
        </Badge>
      </div>

      {/* Featured Section */}
      {featuredTutorials.length > 0 && (
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Featured Tutorials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredTutorials.map((tutorial) => (
                <TutorialCard
                  key={tutorial.id}
                  tutorial={tutorial}
                  onWatch={handleWatchTutorial}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tutorials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {filteredTutorials.length === 0 ? (
            <div className="text-center py-12">
              <Video className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No tutorials found</p>
              <Button
                variant="link"
                className="mt-2"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTutorials.map((tutorial) => (
                <TutorialCard
                  key={tutorial.id}
                  tutorial={tutorial}
                  onWatch={handleWatchTutorial}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Video Player Dialog - Placeholder */}
      <Dialog open={!!selectedTutorial} onOpenChange={() => setSelectedTutorial(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedTutorial?.title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Video className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">
                Video content coming soon
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Duration: {selectedTutorial?.duration}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {selectedTutorial?.description}
          </p>
        </DialogContent>
      </Dialog>

      {/* Request Tutorial */}
      <Card>
        <CardContent className="p-6 text-center">
          <BookOpen className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Can't find what you're looking for?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Request a tutorial on any topic and we'll create it for you
          </p>
          <Button variant="outline" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Request Tutorial
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
