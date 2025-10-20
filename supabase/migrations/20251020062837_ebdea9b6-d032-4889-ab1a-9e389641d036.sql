-- Create table for storing user itineraries
CREATE TABLE public.itineraries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  interests TEXT[] NOT NULL,
  budget TEXT NOT NULL,
  itinerary_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read itineraries (public view)
CREATE POLICY "Itineraries are publicly viewable" 
ON public.itineraries 
FOR SELECT 
USING (true);

-- Allow anyone to insert itineraries (no auth required)
CREATE POLICY "Anyone can create itineraries" 
ON public.itineraries 
FOR INSERT 
WITH CHECK (true);

-- Create table for suggested trips
CREATE TABLE public.suggested_trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  destination TEXT NOT NULL,
  description TEXT NOT NULL,
  highlights TEXT[] NOT NULL,
  best_time TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.suggested_trips ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Suggested trips are publicly viewable" 
ON public.suggested_trips 
FOR SELECT 
USING (true);

-- Insert some initial suggested trips
INSERT INTO public.suggested_trips (destination, description, highlights, best_time, image_url) VALUES
('Bali, Indonesia', 'A tropical paradise with stunning beaches, ancient temples, and vibrant culture', ARRAY['Uluwatu Temple', 'Rice Terraces', 'Beach Clubs', 'Traditional Dance'], 'April to October', NULL),
('Kyoto, Japan', 'Ancient temples, beautiful gardens, and traditional Japanese culture', ARRAY['Fushimi Inari Shrine', 'Arashiyama Bamboo Grove', 'Golden Pavilion', 'Geisha District'], 'March to May, September to November', NULL),
('Santorini, Greece', 'Iconic white-washed buildings with stunning sunset views over the Aegean Sea', ARRAY['Oia Sunset', 'Red Beach', 'Ancient Akrotiri', 'Wine Tasting'], 'April to November', NULL),
('Patagonia, Argentina', 'Breathtaking landscapes with glaciers, mountains, and wildlife', ARRAY['Perito Moreno Glacier', 'Torres del Paine', 'Wildlife Watching', 'Hiking'], 'November to March', NULL),
('Iceland', 'Land of fire and ice with geysers, waterfalls, and Northern Lights', ARRAY['Blue Lagoon', 'Golden Circle', 'Northern Lights', 'Black Sand Beaches'], 'June to August, December to February', NULL);