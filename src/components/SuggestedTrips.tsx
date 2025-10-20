import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";
import baliImage from "@/assets/bali.jpg";
import kyotoImage from "@/assets/kyoto.jpg";
import santoriniImage from "@/assets/santorini.jpg";
import patagoniaImage from "@/assets/patagonia.jpg";
import icelandImage from "@/assets/iceland.jpg";
import { motion } from "framer-motion";

// --- NEW TYPE EXPORT ---
// Define and export the type for a trip
export interface SuggestedTrip {
  id: string; // or number
  created_at: string;
  destination: string;
  description: string;
  highlights: string[];
  best_time: string;
  budget: "Budget-Friendly" | "Moderate" | "Luxury";
}

// --- NEW PROPS ---
interface SuggestedTripsProps {
  onTripSelect: (trip: SuggestedTrip) => void;
}

const destinationImages: Record<string, string> = {
  "Bali, Indonesia": baliImage,
  "Kyoto, Japan": kyotoImage,
  "Santorini, Greece": santoriniImage,
  "Patagonia, Argentina": patagoniaImage,
  Iceland: icelandImage,
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
    },
  }),
};

// --- UPDATE Component Signature ---
export const SuggestedTrips = ({ onTripSelect }: SuggestedTripsProps) => {
  const { data: trips, isLoading } = useQuery({
    queryKey: ["suggested-trips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suggested_trips")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    // ... (skeleton loader remains the same)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden animate-pulse">
            <div className="h-64 bg-muted" />
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded mb-2" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-12">
        <h2 className="text-3xl font-bold">Suggested Destinations</h2>
        <p className="text-muted-foreground text-lg">
          Discover amazing places curated by travel experts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips?.map((trip, i) => (
          <motion.div
            key={trip.id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card
              // --- NEW onClick HANDLER ---
              onClick={() => onTripSelect(trip)}
              className="overflow-hidden relative h-96 group cursor-pointer shadow-lg hover:shadow-2xl transition-all"
            >
              <img
                src={destinationImages[trip.destination] || baliImage}
                alt={trip.destination}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              <div className="relative h-full flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  {trip.destination}
                </h3>
                <p className="mt-2 text-white/90 line-clamp-2">
                  {trip.description}
                </p>
                
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {trip.highlights.slice(0, 3).map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="bg-white/20 text-white border-none text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Calendar className="w-4 h-4" />
                    <span>Best time: {trip.best_time}</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};