import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Plane,
  MapPin,
  Sparkles,
  Palette,
  ShieldCheck,
  TrendingUp,
  Backpack, // Corrected icon
} from "lucide-react";
import heroImage from "@/assets/hero-travel.jpg"; // Re-using your image
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SuggestedTrips } from "./SuggestedTrips"; // We'll show a preview

interface LandingPageProps {
  onGetStarted: () => void;
  onExplore: () => void;
}

export const LandingPage = ({ onGetStarted, onExplore }: LandingPageProps) => {
  return (
    <div className="w-full">
      {/* Section 1: Hero */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center animate-zoom"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6 animate-fade-in">
              <Plane className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-medium">
                Your AI-Powered Travel Companion
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
              Never just travel.
              <span className="block bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                Travel smarter.
              </span>
            </h1>
            <p
              className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Stop scrolling through endless blogs. Describe your perfect trip,
              and let our AI build a custom, day-by-day itinerary just for you.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Button
                size="lg"
                onClick={onGetStarted}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-full shadow-lg transition-all hover:scale-105"
              >
                Start Planning for Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: How It Works */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Your perfect trip in 3 steps</h2>
            <p className="text-lg text-muted-foreground mt-2">
              From idea to itinerary in just a few minutes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4">
                <Palette className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Describe Your Trip</h3>
              <p className="text-muted-foreground">
                Tell us where you're going, when, and what you love to do. Be as
                specific as you like!
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Let AI Work Its Magic</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your preferences to craft a unique, logical, and
                unforgettable daily plan.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Explore with Confidence</h3>
              <p className="text-muted-foreground">
                Receive a complete itinerary with locations, tips, and a
                beautiful timeline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">All-in-one travel planning</h2>
            <p className="text-lg text-muted-foreground mt-2">
              Everything you need to plan and enjoy your trip.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <TrendingUp className="w-8 h-8 text-primary" />
                <CardTitle>Hyper-Personalized</CardTitle>
              </CardHeader>
              <CardContent>
                Plans are built from scratch based on your unique interests,
                budget, and travel style. No two trips are the same.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <ShieldCheck className="w-8 h-8 text-primary" />
                <CardTitle>Smart & Efficient</CardTitle>
              </CardHeader>
              <CardContent>
                Our AI logically groups activities by location and opening hours,
                saving you time and stress on the ground.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Backpack className="w-8 h-8 text-primary" /> {/* Corrected */}
                <CardTitle>Discover Hidden Gems</CardTitle>
              </CardHeader>
              <CardContent>
                Go beyond the tourist traps. We'll suggest local spots and unique
                experiences you won't find in a standard guidebook.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Section 4: Inspiration (Uses your SuggestedTrips) */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Need some inspiration?</h2>
            <p className="text-lg text-muted-foreground mt-2">
              Check out these curated trips to get your ideas flowing.
            </p>
          </div>
          {/* This re-uses your component! */}
          <SuggestedTrips />
          <div className="text-center mt-12">
             <Button
                size="lg"
                variant="outline"
                onClick={onExplore}
                className="px-8 py-6 text-lg font-semibold rounded-full"
              >
                Explore All Destinations
              </Button>
          </div>
        </div>
      </section>

      {/* Section 5: Final CTA */}
      <section className="py-20 text-center">
         <div className="max-w-3xl mx-auto px-6">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold tracking-tight mb-6">Ready to start your next adventure?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Build your first itinerary in under a minute.
            </p>
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-7 text-xl font-semibold rounded-full shadow-lg transition-all hover:scale-105"
            >
              Start Planning Now
            </Button>
         </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 border-t bg-background">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground">
          <p>&copy; 2025 TravelAI. Built for an internship portfolio.</p>
        </div>
      </footer>
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        .animate-zoom {
          animation: zoom 20s ease-out infinite alternate;
        }
      `}</style>
    </div>
  );
};