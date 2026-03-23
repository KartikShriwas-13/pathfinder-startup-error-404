-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  mobile TEXT,
  location TEXT,
  date_of_birth DATE,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create startup_ideas table
CREATE TABLE public.startup_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  idea_text TEXT NOT NULL,
  location TEXT NOT NULL,
  budget NUMERIC NOT NULL,
  validation_result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.startup_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own ideas"
  ON public.startup_ideas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ideas"
  ON public.startup_ideas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  duration TEXT,
  chapters JSONB,
  thumbnail_url TEXT,
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view courses"
  ON public.courses FOR SELECT
  USING (true);

-- Create user_course_progress table
CREATE TABLE public.user_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses ON DELETE CASCADE NOT NULL,
  completed_chapters JSONB DEFAULT '[]'::jsonb,
  is_completed BOOLEAN DEFAULT false,
  certificate_issued BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
  ON public.user_course_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress"
  ON public.user_course_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_course_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Insert demo courses
INSERT INTO public.courses (title, description, category, duration, chapters, thumbnail_url) VALUES
('Business Communication Basics', 'Learn essential communication skills for business success', 'General', '4 weeks', '["Introduction to Business Communication", "Written Communication", "Verbal Communication", "Digital Communication", "Presentation Skills"]'::jsonb, 'https://images.unsplash.com/photo-1557804506-669a67965ba0'),
('Finance Fundamentals', 'Understanding basic finance and accounting for startups', 'General', '6 weeks', '["Financial Basics", "Budgeting", "Cash Flow Management", "Financial Statements", "Investment Basics", "Tax Planning"]'::jsonb, 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c'),
('Marketing Essentials', 'Master the fundamentals of marketing for your business', 'General', '5 weeks', '["Marketing Fundamentals", "Market Research", "Digital Marketing", "Social Media Marketing", "Content Marketing"]'::jsonb, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f'),
('Legal & Licenses', 'Navigate business laws, licenses and compliance', 'General', '3 weeks', '["Business Registration", "Licenses & Permits", "Tax Compliance", "Contracts & Agreements"]'::jsonb, 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f'),
('Advanced Business Planning', 'Create comprehensive business plans and strategies', 'General', '8 weeks', '["Business Model Canvas", "Market Analysis", "Financial Projections", "Growth Strategies", "Risk Management", "Scaling Your Business", "Exit Strategies", "Investor Pitch"]'::jsonb, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40'),
('Mushroom Farming', 'Complete guide to starting a mushroom farming business', 'Agriculture', '6 weeks', '["Introduction to Mushroom Farming", "Types of Mushrooms", "Setting Up Farm", "Cultivation Process", "Harvesting & Packaging", "Marketing & Sales"]'::jsonb, 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2'),
('Poultry Farming', 'Learn sustainable poultry farming practices', 'Agriculture', '7 weeks', '["Poultry Farm Setup", "Breed Selection", "Feed Management", "Health & Disease Control", "Egg Production", "Meat Production", "Marketing"]'::jsonb, 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7'),
('Organic Farming', 'Start your organic farming business from scratch', 'Agriculture', '8 weeks', '["Organic Farming Basics", "Soil Health", "Crop Selection", "Pest Management", "Composting", "Certification", "Marketing Organic Produce", "Building Customer Base"]'::jsonb, 'https://images.unsplash.com/photo-1560493676-04071c5f467b'),
('Handicrafts Business', 'Turn your craft skills into a profitable business', 'Creative', '5 weeks', '["Craft Selection", "Product Development", "Sourcing Materials", "Pricing Strategies", "Online Selling"]'::jsonb, 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b'),
('How to Sell Online', 'Master e-commerce and online selling platforms', 'E-commerce', '4 weeks', '["E-commerce Basics", "Platform Selection", "Product Listing", "Customer Service", "Shipping & Logistics"]'::jsonb, 'https://images.unsplash.com/photo-1472851294608-062f824d29cc');

-- Trigger for profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, mobile, location, date_of_birth)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'mobile', ''),
    COALESCE(NEW.raw_user_meta_data->>'location', ''),
    CASE 
      WHEN NEW.raw_user_meta_data->>'date_of_birth' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'date_of_birth')::date
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_course_progress_updated_at BEFORE UPDATE ON public.user_course_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();