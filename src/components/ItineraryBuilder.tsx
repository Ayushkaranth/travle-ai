import { useState, useEffect, useCallback } from "react"; // Import useEffect and useCallback
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  MapPin,
  Calendar,
  Heart,
  DollarSign,
  Sparkles,
  Utensils,
  Camera,
  Backpack,
  ShoppingCart,
  Music,
  Landmark,
  Sun,
  TreePine,
  PiggyBank,
  Wallet,
  Gem,
  ArrowLeft,
  ArrowRight,
  Plus,
  User,
  Users,
  HeartHandshake,
  Coffee,
  BackpackIcon,
  Zap,
  Loader2,      // New
  CloudRain,   // New
  CloudSun,    // New
  Cloud,       // New
  Snowflake,   // New
  CloudFog,    // New
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SuggestedTrip } from "./SuggestedTrips"; 

// --- (Interfaces, Data Constants, defaultForm... remain exactly the same) ---
export interface ItineraryFormData {
  destination: string;
  startDate: string;
  endDate: string;
  travelParty: string; 
  interests: string[];
  budget: string;
  pace: string; 
}

interface ItineraryBuilderProps {
  onGenerate: (data: ItineraryFormData) => void;
  initialData: SuggestedTrip | null; 
}

const interestOptions = [
  { name: "Culture & History", icon: <Landmark className="w-6 h-6" /> },
  { name: "Food & Dining", icon: <Utensils className="w-6 h-6" /> },
  { name: "Adventure & Outdoors", icon: <Backpack className="w-6 h-6" /> },
  { name: "Beaches & Relaxation", icon: <Sun className="w-6 h-6" /> },
  { name: "Shopping", icon: <ShoppingCart className="w-6 h-6" /> },
  { name: "Nightlife", icon: <Music className="w-6 h-6" /> },
  { name: "Photography", icon: <Camera className="w-6 h-6" /> },
  { name: "Nature & Wildlife", icon: <TreePine className="w-6 h-6" /> },
];
const presetInterestNames = interestOptions.map(i => i.name);

const partyOptions = [
  { name: "Solo", icon: <User className="w-8 h-8" />, description: "Just me, myself, and I." },
  { name: "Couple", icon: <HeartHandshake className="w-8 h-8" />, description: "A romantic getaway." },
  { name: "Family", icon: <Users className="w-8 h-8" />, description: "Fun for the whole crew." },
  { name: "Friends", icon: <Users className="w-8 h-8" />, description: "A group adventure." },
];

const budgetOptions = [
  { name: "Budget-Friendly", icon: <PiggyBank className="w-8 h-8" />, description: "Smart, affordable travel." },
  { name: "Moderate", icon: <Wallet className="w-8 h-8" />, description: "Comfort and value." },
  { name: "Luxury", icon: <Gem className="w-8 h-8" />, description: "Premium, all-out experience." },
];

const paceOptions = [
  { name: "Relaxed", icon: <Coffee className="w-8 h-8" />, description: "One or two things a day." },
  { name: "Balanced", icon: <BackpackIcon className="w-8 h-8" />, description: "A good mix of action & rest." },
  { name: "Fast-Paced", icon: <Zap className="w-8 h-8" />, description: "See as much as possible." },
];

const TOTAL_STEPS = 4;

const defaultForm: ItineraryFormData = {
  destination: "",
  startDate: "",
  endDate: "",
  travelParty: "",
  interests: [],
  budget: "Moderate",
  pace: "Balanced",
};

// --- MAIN BUILDER COMPONENT ---
export const ItineraryBuilder = ({
  onGenerate,
  initialData,
}: ItineraryBuilderProps) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // --- NEW STATE for Weather ---
  const [forecast, setForecast] = useState<any>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  const [formData, setFormData] = useState<ItineraryFormData>(() => {
    if (!initialData) {
      return defaultForm;
    }
    return {
      ...defaultForm,
      destination: initialData.destination,
      interests: initialData.highlights || [],
      budget: initialData.budget || "Moderate",
    };
  });

  const handleNext = () => {
    setDirection(1);
    if (step < TOTAL_STEPS) setStep(step + 1);
  };

  const handlePrev = () => {
    setDirection(-1);
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    // Final validation
    if (formData.interests.length === 0) {
      setStep(3); 
      toast.error("Please select at least one interest.");
      return;
    }
     if (!formData.travelParty) { 
      setStep(2);
      toast.error("Please select your travel party.");
      return;
    }
    if (!formData.destination || !formData.startDate || !formData.endDate) {
      setStep(1);
      toast.error("Please fill in your destination and dates.");
      return;
    }
    // Clear the forecast when generating, so it doesn't clash with the one on the display page
    setForecast(null); 
    onGenerate(formData);
  };

  // Animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* ... (Header & Progress Bar remain the same) ... */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Create Your Perfect Trip
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {initialData ? "Let's finish planning your trip to " : "Let's personalize your itinerary, step by step."}
          {initialData && <span className="font-bold text-primary">{initialData.destination}</span>}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-center text-muted-foreground">
          Step {step} of {TOTAL_STEPS}
        </p>
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className="bg-primary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>


      {/* Animated Step Container - NO FIXED HEIGHT */}
      <div className="relative overflow-hidden p-1">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
            className="w-full"
          >
            {/* Render the current step component */}
            {step === 1 && (
              <Step1
                formData={formData}
                setFormData={setFormData}
                onNext={handleNext}
                // --- Pass new props down ---
                forecast={forecast}
                setForecast={setForecast}
                isWeatherLoading={isWeatherLoading}
                setIsWeatherLoading={setIsWeatherLoading}
              />
            )}
            {step === 2 && (
              <Step2
                formData={formData}
                setFormData={setFormData}
                onNext={handleNext}
                onBack={handlePrev}
              />
            )}
            {step === 3 && (
              <Step3
                formData={formData}
                setFormData={setFormData}
                onNext={handleNext}
                onBack={handlePrev}
              />
            )}
            {step === 4 && (
              <Step4
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                onBack={handlePrev}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- (WizardNavigation component remains the same) ---
interface WizardNavProps {
  onBack?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  submitDisabled?: boolean;
}

const WizardNavigation: React.FC<WizardNavProps> = ({
  onBack,
  onNext,
  onSubmit,
  nextLabel = "Next",
  nextDisabled = false,
  submitDisabled = false,
}) => {
  return (
    <div className="flex items-center justify-between pt-8">
      <Button
        variant="outline"
        onClick={onBack}
        className={cn("transition-all", !onBack ? "opacity-0 invisible" : "opacity-100 visible")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {onNext && (
        <Button onClick={onNext} disabled={nextDisabled}>
          {nextLabel}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}

      {onSubmit && (
        <Button
          size="lg"
          onClick={onSubmit}
          disabled={submitDisabled}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Generate My Itinerary
        </Button>
      )}
    </div>
  );
};


// --- STEP 1 COMPONENT (HEAVILY UPDATED) ---
interface Step1Props {
  formData: ItineraryFormData;
  setFormData: React.Dispatch<React.SetStateAction<ItineraryFormData>>;
  onNext: () => void;
  onBack?: () => void;
  // --- New props ---
  forecast: any;
  setForecast: (forecast: any) => void;
  isWeatherLoading: boolean;
  setIsWeatherLoading: (loading: boolean) => void;
}

// --- New Weather Icon Helper ---
const getWeatherIcon = (code: number) => {
  if ([0].includes(code)) return <Sun className="w-5 h-5 text-yellow-500" />;
  if ([1, 2].includes(code)) return <CloudSun className="w-5 h-5 text-gray-400" />;
  if ([3].includes(code)) return <Cloud className="w-5 h-5 text-gray-500" />;
  if ([45, 48].includes(code)) return <CloudFog className="w-5 h-5 text-gray-500" />;
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain className="w-5 h-5 text-blue-500" />;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return <Snowflake className="w-5 h-5 text-blue-200" />;
  return <Sun className="w-5 h-5 text-gray-400" />; // Default
};

const Step1: React.FC<Step1Props> = ({
  formData,
  setFormData,
  onNext,
  forecast,
  setForecast,
  isWeatherLoading,
  setIsWeatherLoading
}) => {
  const canProceed = formData.destination && formData.startDate && formData.endDate;
  
  // --- NEW: Weather Fetching Logic ---
  const fetchForecast = useCallback(async (destination: string, startDate: string, endDate: string) => {
    if (!destination || !startDate || !endDate) return;
    
    setIsWeatherLoading(true);
    setForecast(null); // Clear old forecast
    
    try {
      // 1. Get Lat/Lon
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          destination
        )}&count=1`
      );
      const geoData = await geoResponse.json();
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("Could not find location");
      }
      const { latitude, longitude } = geoData.results[0];

      // 2. Get Forecast
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_mean&timezone=auto`
      );
      const weatherData = await weatherResponse.json();
      
      if (weatherData.daily) {
        setForecast(weatherData.daily);
      } else {
        throw new Error("Failed to fetch weather data");
      }
    } catch (error) {
      console.error("Weather fetch error:", error);
      setForecast(null); // Clear on error
    } finally {
      setIsWeatherLoading(false);
    }
  }, [setForecast, setIsWeatherLoading]); // Add dependencies

  // --- NEW: useEffect to trigger the fetch ---
  useEffect(() => {
    // Check if we have all data needed
    if (formData.destination && formData.startDate && formData.endDate) {
       // Debounce the fetch on destination change
       const handler = setTimeout(() => {
        fetchForecast(formData.destination, formData.startDate, formData.endDate);
      }, 500); // 500ms delay after typing stops

      return () => {
        clearTimeout(handler); // Clear the timeout if user types again
      };
    }
  }, [formData.destination, formData.startDate, formData.endDate, fetchForecast]); // Re-run when these change

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="destination" className="flex items-center gap-2 text-lg font-medium">
          <MapPin className="w-5 h-5 text-primary" />
          Where are you going?
        </Label>
        <Input
          id="destination"
          placeholder="e.g., Tokyo, Japan"
          value={formData.destination}
          onChange={(e) =>
            setFormData({ ...formData, destination: e.target.value })
          }
          className="py-6 text-lg"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="flex items-center gap-2 text-lg font-medium">
            <Calendar className="w-5 h-5 text-primary" />
            Start Date
          </Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            className="py-6 text-lg"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate" className="flex items-center gap-2 text-lg font-medium">
            <Calendar className="w-5 h-5 text-primary" />
            End Date
          </Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            className="py-6 text-lg"
          />
        </div>
      </div>
      
      {/* --- NEW: Weather Forecast Display --- */}
      {isWeatherLoading && (
        <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Fetching live forecast...</span>
        </div>
      )}

      {forecast && (
        <div className="space-y-3">
          <Label className="text-lg font-medium">Weather Forecast</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {forecast.time.map((date: string, index: number) => (
              <Card key={date} className="p-3">
                <div className="flex flex-col items-center gap-2">
                  <p className="font-semibold text-sm">
                    {new Date(date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}
                  </p>
                  {getWeatherIcon(forecast.weathercode[index])}
                  <p className="font-bold text-lg">
                    {Math.round(forecast.temperature_2m_max[index])}°
                    <span className="text-muted-foreground font-normal">/{Math.round(forecast.temperature_2m_min[index])}°</span>
                  </p>
                  <div className="flex items-center gap-1 text-xs text-blue-600">
                    <CloudRain className="w-3 h-3" />
                    <span>{forecast.precipitation_probability_mean[index]}%</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <WizardNavigation onNext={onNext} nextDisabled={!canProceed} nextLabel="Next: The Crew" />
    </div>
  );
};


// --- (Step 2 component remains the same) ---
const Step2: React.FC<StepProps> = ({ formData, setFormData, onNext, onBack }) => {
  const canProceed = !!formData.travelParty;
  return (
    <div className="space-y-6">
      <Label className="flex items-center justify-center gap-2 text-2xl font-medium">
        <Users className="w-6 h-6 text-primary" />
        Who are you traveling with?
      </Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {partyOptions.map((party) => (
          <motion.div
            key={party.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              onClick={() => setFormData({ ...formData, travelParty: party.name })}
              className={cn(
                "flex flex-col items-center justify-center gap-3 p-4 h-36 cursor-pointer transition-all border-2",
                formData.travelParty === party.name
                  ? "border-primary bg-primary/10"
                  : "bg-muted/50 hover:bg-muted"
              )}
            >
              {party.icon}
              <span className="text-lg font-semibold text-center">{party.name}</span>
              <p className="text-xs text-muted-foreground text-center">{party.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
      <WizardNavigation onBack={onBack} onNext={onNext} nextDisabled={!canProceed} nextLabel="Next: The Vibe" />
    </div>
  );
};

// --- (Step 3 component remains the same) ---
const Step3: React.FC<StepProps> = ({ formData, setFormData, onNext, onBack }) => {
  const [customInterest, setCustomInterest] = useState("");
  const canProceed = formData.interests.length > 0;

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleAddCustomInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInterest.trim() && !formData.interests.includes(customInterest.trim())) {
      toggleInterest(customInterest.trim());
      setCustomInterest("");
    }
  };

  const customInterests = formData.interests.filter(i => !presetInterestNames.includes(i));

  return (
    <div className="space-y-6">
      <Label className="flex items-center justify-center gap-2 text-2xl font-medium">
        <Heart className="w-6 h-6 text-primary" />
        What's your vibe?
      </Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {interestOptions.map((interest) => (
          <motion.div
            key={interest.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              onClick={() => toggleInterest(interest.name)}
              className={cn(
                "flex flex-col items-center justify-center gap-3 p-4 h-32 cursor-pointer transition-all border-2",
                formData.interests.includes(interest.name)
                  ? "border-primary bg-primary/10"
                  : "bg-muted/50 hover:bg-muted"
              )}
            >
              {interest.icon}
              <span className="text-sm font-medium text-center">{interest.name}</span>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="space-y-4">
        <Label htmlFor="customInterest" className="text-base font-medium">
          Have other interests? (e.g., Architecture, Vinyl Records)
        </Label>
        <form onSubmit={handleAddCustomInterest} className="flex gap-2">
          <Input
            id="customInterest"
            placeholder="Type an interest and press 'Add'"
            value={customInterest}
            onChange={(e) => setCustomInterest(e.g.target.value)}
            className="py-6 text-base"
          />
          <Button type="submit" variant="outline" size="icon" className="h-12 w-12 flex-shrink-0">
            <Plus className="w-5 h-5" />
          </Button>
        </form>
        {customInterests.length > 0 && (
          <div className="flex flex-wrap gap-2 p-4 bg-muted rounded-lg">
            {customInterests.map((interest) => (
              <Badge key={interest} variant="default" className="text-sm py-1 px-3">
                {interest}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <WizardNavigation onBack={onBack} onNext={onNext} nextDisabled={!canProceed} nextLabel="Next: The Pace" />
    </div>
  );
};

// --- (Step 4 component remains the same) ---
interface Step4Props {
  formData: ItineraryFormData;
  setFormData: React.Dispatch<React.SetStateAction<ItineraryFormData>>;
  onSubmit: () => void;
  onBack: () => void;
}

const Step4: React.FC<Step4Props> = ({ formData, setFormData, onSubmit, onBack }) => {
  const canProceed = !!formData.budget && !!formData.pace;
  return (
    <div className="space-y-8">
      {/* Budget Section */}
      <div className="space-y-6">
        <Label className="flex items-center justify-center gap-2 text-2xl font-medium">
          <DollarSign className="w-6 h-6 text-primary" />
          What's your budget?
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {budgetOptions.map((budget) => (
            <motion.div
              key={budget.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                onClick={() => setFormData({ ...formData, budget: budget.name })}
                className={cn(
                  "flex flex-col items-center justify-center gap-3 p-6 h-48 cursor-pointer transition-all border-2",
                  formData.budget === budget.name
                    ? "border-primary bg-primary/10"
                    : "bg-muted/50 hover:bg-muted"
                )}
              >
                {budget.icon}
                <span className="text-lg font-semibold text-center">{budget.name}</span>
                <p className="text-sm text-muted-foreground text-center">{budget.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Pace Section */}
      <div className="space-y-6">
        <Label className="flex items-center justify-center gap-2 text-2xl font-medium">
          <Zap className="w-6 h-6 text-primary" />
          What's your travel pace?
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paceOptions.map((pace) => (
            <motion.div
              key={pace.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                onClick={() => setFormData({ ...formData, pace: pace.name })}
                className={cn(
                  "flex flex-col items-center justify-center gap-3 p-6 h-48 cursor-pointer transition-all border-2",
                  formData.pace === pace.name
                    ? "border-primary bg-primary/10"
                    : "bg-muted/50 hover:bg-muted"
                )}
              >
                {pace.icon}
                <span className="text-lg font-semibold text-center">{pace.name}</span>
                <p className="text-sm text-muted-foreground text-center">{pace.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      <WizardNavigation onBack={onBack} onSubmit={onSubmit} submitDisabled={!canProceed} />
    </div>
  );
};