import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Lightbulb, Calendar, Check, Sun, Cloud, CloudRain, Snowflake, Zap, CloudFog } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// --- (Interfaces remain the same) ---
interface Activity {
  time: string;
  activity: string;
  location: string;
  tip?: string;
}

interface Day {
  day: number;
  title: string;
  activities: Activity[];
}

interface ItineraryData {
  summary: string;
  days: Day[];
  tips: string[];
}

// --- UPDATED PROPS ---
interface ItineraryDisplayProps {
  itinerary: ItineraryData;
  isStreaming?: boolean;
  weather: any; // Add weather prop
}

// --- NEW WEATHER HELPER FUNCTION ---
const getWeatherIcon = (code: number): React.ReactNode => {
  if ([0].includes(code)) return <Sun className="w-5 h-5 text-yellow-500" />;
  if ([1, 2, 3].includes(code)) return <Cloud className="w-5 h-5 text-gray-400" />;
  if ([45, 48].includes(code)) return <CloudFog className="w-5 h-5 text-gray-500" />;
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain className="w-5 h-5 text-blue-500" />;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return <Snowflake className="w-5 h-5 text-blue-200" />;
  if ([95, 96, 99].includes(code)) return <Zap className="w-5 h-5 text-yellow-600" />;
  return <Sun className="w-5 h-5 text-gray-400" />; // Default
};

// --- NEW WEATHER DISPLAY COMPONENT ---
const WeatherDisplay = ({ dayWeather }: { dayWeather: any }) => {
  if (!dayWeather) return null; // Don't render if data isn't ready

  return (
    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
      {getWeatherIcon(dayWeather.weathercode)}
      <div className="text-sm">
        <span className="font-semibold">{Math.round(dayWeather.temp_max)}°</span>
        <span className="text-muted-foreground"> / {Math.round(dayWeather.temp_min)}°</span>
      </div>
    </div>
  );
};


/**
 * DayTimeline Component
 */
const DayTimeline = ({ day, dayIndex, weather }: { day: Day, dayIndex: number, weather: any }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // --- NEW: Get weather for this specific day ---
  const dayWeather = weather 
    ? {
        weathercode: weather.weathercode[dayIndex],
        temp_max: weather.temperature_2m_max[dayIndex],
        temp_min: weather.temperature_2m_min[dayIndex],
      } 
    : null;

  // ... (animation variants remain the same)
  const timelineVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const activityVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div ref={ref} className="relative pl-16 py-8">
      {/* ... (Timeline Vertical Line & Day Number Badge remain the same) */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

      <motion.div
        className="absolute left-0 top-8 flex items-center justify-center w-12 h-12 bg-primary rounded-full"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
      >
        <span className="text-xl font-bold text-primary-foreground">{day.day}</span>
      </motion.div>
      
      {/* --- UPDATED Day Header --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
        <motion.h2
          className="text-3xl font-bold"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          {day.title}
        </motion.h2>
        
        {/* --- ADDED Weather Display --- */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <WeatherDisplay dayWeather={dayWeather} />
        </motion.div>
      </div>
      
      {/* ... (Activities List mapping remains the same) ... */}
      <motion.div
        className="space-y-6"
        variants={timelineVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {day.activities &&
          day.activities.map((activity, actIndex) => (
            <motion.div
              key={actIndex}
              className="relative"
              variants={activityVariants}
            >
              <div className="absolute -left-[34px] top-3 w-4 h-4 bg-primary rounded-full border-4 border-background" />
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg pr-4">{activity.activity}</h3>
                    <Badge variant="outline" className="flex-shrink-0">{activity.time}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {activity.location}
                  </p>
                  {activity.tip && (
                    <div className="flex gap-2 items-start bg-accent/10 p-3 rounded-md mt-3">
                      <Lightbulb className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground">{activity.tip}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
      </motion.div>
    </div>
  );
};

// --- MAIN DISPLAY COMPONENT ---
export const ItineraryDisplay = ({
  itinerary,
  isStreaming,
  weather, // Destructure the new prop
}: ItineraryDisplayProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* ... (Summary Card remains the same) ... */}
       {itinerary.summary && (
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Calendar className="w-6 h-6 text-primary" />
              Your Trip Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground">{itinerary.summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Days Timeline */}
      <div className="space-y-4">
        {itinerary.days &&
          itinerary.days.map((day, index) => (
            <DayTimeline 
              key={index} 
              day={day} 
              dayIndex={index} 
              weather={weather} // --- Pass weather down
            />
          ))}
      </div>
      
      {/* ... (General Tips Card remains the same) ... */}
      {itinerary.tips && itinerary.tips.length > 0 && (
        <Card className="bg-gradient-to-br from-secondary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Lightbulb className="w-6 h-6 text-secondary" />
              Traveler's Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {itinerary.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};