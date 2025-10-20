import { useState } from "react";
import { LandingPage } from "@/components/Hero";
import { Navigation } from "@/components/Navigation";
import {
  ItineraryBuilder,
  ItineraryFormData,
} from "@/components/ItineraryBuilder";
import { ItineraryDisplay } from "@/components/ItineraryDisplay";
import { SuggestedTrips, SuggestedTrip } from "@/components/SuggestedTrips";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"hero" | "builder" | "suggested">(
    "hero"
  );
  const [itinerary, setItinerary] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // --- NEW STATE for Weather ---
  const [weather, setWeather] = useState<any>(null); 
  
  const [prefilledData, setPrefilledData] = useState<SuggestedTrip | null>(
    null
  );
  const [builderKey, setBuilderKey] = useState(0);

  // ... (animation variants remain the same)
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  // --- NEW FUNCTION to fetch weather ---
  const fetchWeather = async (formData: ItineraryFormData) => {
    try {
      // 1. Get Lat/Lon from destination name
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          formData.destination
        )}&count=1`
      );
      const geoData = await geoResponse.json();
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("Could not find location");
      }
      const { latitude, longitude } = geoData.results[0];

      // 2. Get daily forecast
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&start_date=${formData.startDate}&end_date=${formData.endDate}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      const weatherData = await weatherResponse.json();
      if (weatherData.daily) {
        setWeather(weatherData.daily); // Save the daily forecast
      } else {
        throw new Error("Failed to fetch weather data");
      }
    } catch (error) {
      console.error("Weather fetch error:", error);
      toast.error("Failed to fetch weather forecast.");
      setWeather(null); // Ensure weather is null on failure
    }
  };

  // ... (handleGetStarted, handleExplore, handleLogoClick, handleTabChange, handleTripSelect remain the same)
  const handleGetStarted = () => {
    setPrefilledData(null); 
    setBuilderKey((prev) => prev + 1); 
    setActiveTab("builder");
    setItinerary(null);
    setWeather(null); // Clear weather
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleExplore = () => {
    setActiveTab("suggested");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleLogoClick = () => {
    setPrefilledData(null); 
    setActiveTab("hero");
    setItinerary(null);
    setWeather(null); // Clear weather
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabChange = (tab: "builder" | "suggested") => {
    if (tab === "builder") {
      setItinerary(null);
      setWeather(null); // Clear weather
      if (prefilledData === null) {
        setBuilderKey((prev) => prev + 1);
      }
    }
    if (activeTab === "builder") {
      setPrefilledData(null);
    }
    setActiveTab(tab);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleTripSelect = (trip: SuggestedTrip) => {
    setPrefilledData(trip); 
    setBuilderKey((prev) => prev + 1); 
    setActiveTab("builder"); 
    setWeather(null); // Clear weather
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" }); 
    }, 100);
  };


  const handleGenerate = async (formData: ItineraryFormData) => {
    setIsGenerating(true);
    setItinerary(null);
    setWeather(null); // Clear previous weather on new generation

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-itinerary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
            }`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("Failed to generate itinerary");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let fullText = "";

      while (true) {
        // ... (streaming logic remains the same)
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              try {
                const cleanJson = fullText
                  .trim()
                  .replace(/```json\n?/g, "")
                  .replace(/```\n?/g, "");
                const parsedItinerary = JSON.parse(cleanJson);
                setItinerary(parsedItinerary); 
              } catch {
                // Not complete JSON yet
              }
            }
          } catch {
            // Incomplete JSON
          }
        }
      }

      // Final parse
      try {
        const cleanJson = fullText
          .trim()
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "");
        const parsedItinerary = JSON.parse(cleanJson);
        setItinerary(parsedItinerary);
        toast.success("Itinerary generated successfully!");
        
        // --- FETCH WEATHER ON SUCCESS ---
        fetchWeather(formData); 
        
      } catch (error) {
        console.error("Failed to parse final itinerary:", error);
        toast.error("Failed to parse itinerary. Please try again.");
      }
    } catch (error) {
      console.error("Error generating itinerary:", error);
      toast.error("Failed to generate itinerary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      {activeTab !== "hero" && (
        <Navigation
          activeTab={activeTab === "builder" ? "builder" : "suggested"}
          onTabChange={handleTabChange}
          onLogoClick={handleLogoClick}
        />
      )}

      <AnimatePresence mode="wait">
        {activeTab === "hero" && (
          // ... (hero motion.div remains the same)
          <motion.div
            key="hero"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <LandingPage
              onGetStarted={handleGetStarted}
              onExplore={handleExplore}
            />
          </motion.div>
        )}

        {activeTab === "builder" && (
          // ... (builder motion.div remains the same)
          <motion.div
            key="builder"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="pt-28 pb-12"
          >
            <div className="max-w-7xl mx-auto px-6 space-y-12">
              <ItineraryBuilder
                key={builderKey} 
                initialData={prefilledData} 
                onGenerate={handleGenerate}
              />

              {isGenerating && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                  <Loader2 className="w-16 h-16 animate-spin text-primary" />
                  <p className="text-2xl font-semibold">
                    Crafting your adventure...
                  </p>
                  <p className="text-muted-foreground">
                    This can take up to 30 seconds.
                  </p>
                </div>
              )}

              {itinerary && !isGenerating && (
                <ItineraryDisplay 
                  itinerary={itinerary} 
                  isStreaming={false} 
                  weather={weather} // --- PASS WEATHER PROP ---
                />
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "suggested" && (
          // ... (suggested motion.div remains the same)
          <motion.div
            key="suggested"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="pt-28 pb-12"
          >
            <div className="max-w-7xl mx-auto px-6">
              <SuggestedTrips onTripSelect={handleTripSelect} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
