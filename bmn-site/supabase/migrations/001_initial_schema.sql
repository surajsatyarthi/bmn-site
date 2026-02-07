-- Create Enums
CREATE TYPE public.trade_role AS ENUM ('exporter', 'importer', 'both');
CREATE TYPE public.trade_type AS ENUM ('export', 'import', 'both');
CREATE TYPE public.interest_type AS ENUM ('export_to', 'import_from');

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    whatsapp TEXT,
    trade_role public.trade_role NOT NULL,
    monthly_volume TEXT,
    onboarding_step INTEGER NOT NULL DEFAULT 1,
    onboarding_completed BOOLEAN NOT NULL DEFAULT false,
    plan TEXT NOT NULL DEFAULT 'free',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- COMPANIES TABLE
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    founding_year INTEGER,
    size TEXT,
    street TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    pin_code TEXT,
    website TEXT,
    iec_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_companies_profile_id ON public.companies(profile_id);
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own companies" ON public.companies
    FOR ALL USING (auth.uid() = profile_id);

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    hs_code TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    trade_type public.trade_type NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_profile_id ON public.products(profile_id);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own products" ON public.products
    FOR ALL USING (auth.uid() = profile_id);

-- TRADE INTERESTS TABLE
CREATE TABLE IF NOT EXISTS public.trade_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    country_code TEXT NOT NULL,
    country_name TEXT NOT NULL,
    interest_type public.interest_type NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_trade_interests_profile_id ON public.trade_interests(profile_id);
ALTER TABLE public.trade_interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own trade interests" ON public.trade_interests
    FOR ALL USING (auth.uid() = profile_id);

-- CERTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    certificate_number TEXT,
    valid_until DATE,
    document_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_certifications_profile_id ON public.certifications(profile_id);
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own certifications" ON public.certifications
    FOR ALL USING (auth.uid() = profile_id);

-- UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profiles_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER on_companies_updated
    BEFORE UPDATE ON public.companies
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
