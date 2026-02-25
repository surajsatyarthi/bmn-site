import Link from "next/link";
import Image from "next/image";
import { Header } from '@/components/layout/Header';
import { FAQAccordion } from '@/components/landing/FAQAccordion';
import { RotatingText } from '@/components/landing/RotatingText';
import { StakeholderNetwork } from '@/components/landing/StakeholderNetwork';
import { NewsSection } from '@/components/landing/NewsSection';
import {
  Package,
  Search,
  Handshake,
  Ship,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe2,
  Factory,
  Briefcase,
  Check,
  Wheat,
  Shirt,
  FlaskConical,
  Pill,
  Cpu,
  Cog,
  Car,
  Hammer,
  Gem,
} from 'lucide-react';
import { BrandArrow } from '@/components/icons/BrandArrow';
import { FeatureIcon } from '@/components/ui/FeatureIcon';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BMN — Search 4.4M Global Trade Companies',
  description:
    'Search 4.4 million global trade companies. Find verified importers, exporters, and manufacturers worldwide. Reveal contact details with credits.',
};



const IMPACT_NUMBERS = [
  { value: '4.4M+', label: 'Companies in Database' },
  { value: '60+', label: 'Countries Covered' },
  { value: '5', label: 'Free Reveals / Month' },
];



const PERFECT_FOR = [
  {
    icon: Ship,
    title: 'Exporters',
    description:
      'Find verified importers in your target markets. Search by country, HS code, and product type — then reveal contact details when ready.',
  },
  {
    icon: Factory,
    title: 'Importers',
    description:
      'Discover global manufacturers and suppliers. Browse trade history, see what they export, and connect directly.',
  },
  {
    icon: Briefcase,
    title: 'Trade Agents',
    description:
      'High-volume intelligence for multiple clients. 500 reveals/month on the Hunter plan — enough to build outreach lists at scale.',
  },
];

const PROFILE_BENEFITS = [
  {
    icon: Search,
    title: 'Get Found by Verified Buyers',
    description: 'Your profile appears in our AI matching engine. Buyers searching for your products find YOU.',
  },
  {
    icon: Globe2,
    title: 'SEO-Optimized Business Page',
    description: 'Your BMN profile ranks on Google. Get discovered by buyers searching for your products and trade corridor.',
  },
  {
    icon: Zap,
    title: 'AI Engine Optimization',
    description: 'Our AI matching algorithm weighs your profile data (products, certifications, trade terms) to find your highest-quality matches.',
  },
  {
    icon: ShieldCheck,
    title: 'Credibility & Trust Signals',
    description: 'Verified badge, certifications, company details — everything a buyer needs to trust you before first contact.',
  },
  {
    icon: Handshake,
    title: 'Qualified Leads Only',
    description: 'No spam. No tire-kickers. Every match is pre-qualified based on product fit, country corridor, and trade capacity.',
  },
  {
    icon: Package,
    title: 'Free Forever Tier',
    description: 'Create your profile for free. Get 5 contact reveals per month. Upgrade for more credits.',
  },
];

const FREE_FEATURES = [
  'Unlimited database search & browse',
  '5 Contact Reveals / month',
  'Search by country, HS code, company name',
  'Email support',
];

const PRO_FEATURES = [
  '500 Contact Reveals / month',
  'Unlimited database search',
  'Filter by country + HS code',
  'Full Network access (after 100 members)',
];



const PARTNER_FEATURES = [
  'Unlimited Contact Reveals',
  'Unlimited database search',
  'BMN manages your email outreach',
  'upto 5,000 outreach emails/month',
];

const TESTIMONIALS = [
  {
    quote:
      "BMN found us 3 qualified buyers in the UAE within the first week. We've already shipped our first container.",
    name: "Rajesh Patel",
    title: "Director",
    company: "Patel Exports, Gujarat",
  },
  {
    quote:
      "We spent years at trade shows with no results. BMN matched us with a German buyer in 48 hours.",
    name: "Priya Sharma",
    title: "CEO",
    company: "Sharma Textiles, Mumbai",
  },
  {
    quote:
      "The done-for-you approach is exactly what exporters need. No more chasing fake leads.",
    name: "Anil Mehta",
    title: "Founder",
    company: "Mehta Spices, Kochi",
  },
];

const TRUSTED_BY_LOGOS = [
  { name: "Adani", src: "/images/clients/adani.png" },
  { name: "Hapag-Lloyd", src: "/images/clients/hapag-lloyd.png" },
  { name: "Maersk", src: "/images/clients/maersk.png" },
  { name: "Samsung", src: "/images/clients/samsung.png" },
  { name: "Toyota", src: "/images/clients/toyota.png" },
  { name: "Client", src: "/images/clients/2.png" },
];

const COUNTRIES = [
  { name: "China", flag: "🇨🇳" },
  { name: "USA", flag: "🇺🇸" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "Netherlands", flag: "🇳🇱" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "France", flag: "🇫🇷" },
  { name: "South Korea", flag: "🇰🇷" },
  { name: "Italy", flag: "🇮🇹" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "Singapore", flag: "🇸🇬" },
  { name: "India", flag: "🇮🇳" },
  { name: "UAE", flag: "🇦🇪" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Brazil", flag: "🇧🇷" },
  { name: "Saudi Arabia", flag: "🇸🇦" },
  { name: "Turkey", flag: "🇹🇷" },
  { name: "Malaysia", flag: "🇲🇾" },
  { name: "Thailand", flag: "🇹🇭" },
  { name: "Mexico", flag: "🇲🇽" },
  { name: "Indonesia", flag: "🇮🇩" },
  { name: "Vietnam", flag: "🇻🇳" },
  { name: "South Africa", flag: "🇿🇦" },
  { name: "Egypt", flag: "🇪🇬" },
];

const INDUSTRIES = [
  { name: "Agriculture & Food", icon: Wheat },
  { name: "Textiles & Apparel", icon: Shirt },
  { name: "Chemicals & Plastics", icon: FlaskConical },
  { name: "Pharmaceuticals", icon: Pill },
  { name: "Electronics", icon: Cpu },
  { name: "Machinery", icon: Cog },
  { name: "Automotive", icon: Car },
  { name: "Construction Materials", icon: Hammer },
  { name: "Gems & Jewelry", icon: Gem },
  { name: "Energy & Resources", icon: Zap },
];

const FAQ_ITEMS = [
  {
    question: "What is BMN?",
    answer:
      "BMN is a global B2B trade intelligence platform. Search 4.4 million companies by country and HS code, browse their import/export history, and reveal contact details using credits.",
  },
  {
    question: "How does BMN find trade partners?",
    answer:
      "We use Santander trade intelligence data — 4.4 million companies across 60+ countries with their actual import/export history. Filter by country, HS chapter, or company name to find the counterparties you need.",
  },
  {
    question: "Is BMN free to use?",
    answer:
      "Yes. Database search and browsing are completely free and unlimited. You get 5 Free Contact Reveals per month to unlock email and phone details.",
  },
  {
    question: "What are Credits?",
    answer:
      "Credits unlock contact details (email + phone) for any company in the database. 1 Credit = 1 contact reveal. Free users get 5/month. Hunter users get 500/month. Partner users get unlimited.",
  },
  {
    question: "What is a 'reveal'?",
    answer:
      "When you find a company you want to contact, click 'Reveal Contact' to unlock their verified email and phone number. This uses 1 credit. Free users get 5 reveals per month.",
  },
  {
    question: "What does the Hunter plan include?",
    answer:
      "Hunter ($199/month) gives you 500 contact reveals per month, unlimited database search, and full Network access. You use your own email tool to reach out — Hunter is about the data, not email management.",
  },
  {
    question: "What does the Partner plan include?",
    answer:
      "Partner ($1,500/month) gives you unlimited contact reveals plus BMN manages your outreach campaigns — 5,000 emails per month sent on your behalf. You get the data and the outreach done for you.",
  },
  {
    question: "Do credits roll over?",
    answer:
      "No. Credits reset on the 1st of each month. Unused credits expire. This applies to all plans.",
  },
  {
    question: "How are matches scored?",
    answer:
      "We rank matches as 'Best', 'Great', or 'Good' based on product alignment, trade history, volume compatibility, and geographic fit.",
  },
  {
    question: "Do I need an IEC number?",
    answer:
      "An IEC (Import Export Code) is recommended but not required to sign up. It helps us verify your export readiness and improves match quality.",
  },
  {
    question: "Which countries do you cover?",
    answer:
      "We cover 60+ countries with active trade flows globally, including UAE, USA, Germany, UK, Japan, Singapore, India, Australia, and more.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes. We use enterprise-grade encryption and never share your data with third parties without your explicit consent.",
  },
  {
    question: "Can importers use BMN?",
    answer:
      "Absolutely. BMN works for both importers and exporters. Search for verified global suppliers, browse their export history, and reveal contact details.",
  },
  {
    question: "How do I upgrade?",
    answer:
      "Click 'Get Started' on the Hunter plan or 'Contact Sales' on the Partner plan. At beta launch, upgrades are handled manually — we'll be in touch within 24 hours.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-bmn-light-bg text-text-primary">
      <Header />

      {/* Section 1: Hero */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gradient-primary font-bold tracking-widest text-sm uppercase mb-4">
             CONNECT • GROW • SUCCEED
          </p>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8 text-text-primary text-center">
            <div className="text-center">AI Finds You <RotatingText /></div>
            <div className="text-center">You <span className="text-gradient-primary">Ship</span></div>
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/signup"
              className="btn-primary text-lg px-10 py-4 shadow-lg shadow-bmn-blue/20"
            >
              Get Started Free
            </Link>
            <a
              href="#how-it-works"
              className="px-10 py-4 text-text-primary rounded-lg font-semibold border border-bmn-border hover:bg-bmn-light-bg transition-colors flex items-center gap-2"
            >
              See How It Works <ArrowRight className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-4 text-sm text-text-secondary font-medium">Includes 5 Free Reveals/month • No Credit Card Required</p>
        </div>
      </section>


      {/* Section 2: Trusted By (Moved) */}
      <section className="py-12 bg-white border-b border-bmn-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-text-secondary mb-8 uppercase tracking-wide">
            Trusted By Leading Enterprises
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {TRUSTED_BY_LOGOS.map((logo) => (
              <div key={logo.name} className="relative h-12 w-32">
                 <Image 
                   src={logo.src} 
                   alt={logo.name} 
                   fill 
                   className="object-contain"
                 />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Stakeholder Network (Moved) */}
      <section id="stakeholder-network" className="py-24 bg-white border-y border-bmn-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-text-primary mb-4">Your Trade Network, Connected</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              BMN connects every stakeholder in your export journey
            </p>
          </div>
          <StakeholderNetwork />
        </div>
      </section>

      {/* Section 4: News & Globe (Moved) */}
      <NewsSection />

      {/* Section 5: Global Reach */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-white border-b border-bmn-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-text-primary mb-4">Global Reach</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Connecting global businesses with buyers in 60+ countries
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {COUNTRIES.map((country) => (
              <div key={country.name} className="flex items-center gap-2.5 px-3 py-2 bg-white rounded-lg border border-bmn-border hover:shadow-md transition-shadow">
                <span className="text-lg flex-shrink-0" role="img" aria-label={country.name}>{country.flag}</span>
                <span className="text-xs font-medium text-text-primary">{country.name}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-text-secondary mt-6">...and 40+ more</p>
        </div>
      </section>

      {/* Section 5: Industries We Support */}
      <section className="py-24 bg-white border-b border-bmn-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-text-primary mb-4">Industries We Support</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Connecting businesses across key sectors
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {INDUSTRIES.map((industry) => (
              <div key={industry.name} className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border border-bmn-border hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                <div className="mb-3 transform group-hover:scale-110 transition-transform duration-300">
                  <FeatureIcon icon={industry.icon} variant="primary" size="lg" />
                </div>
                <span className="text-sm font-semibold text-text-primary text-center leading-tight">{industry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Section 6: How It Works */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-text-primary mb-4">How It Works</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Our streamlined process takes the friction out of international trade.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <StepCard
              number="1"
              icon={<FeatureIcon icon={Package} variant="primary" size="lg" />}
              title="Create Your Free Account"
              description="Sign up in 60 seconds. Complete your trade profile with your products and target markets."
            />
            <StepCard
              number="2"
              icon={<FeatureIcon icon={Search} variant="primary" size="lg" />}
              title="Search 4.4M Companies"
              description="Filter global trade companies by country, HS code, or name. Unlimited searches — completely free."
            />
            <StepCard
              number="3"
              icon={<FeatureIcon icon={Handshake} variant="primary" size="lg" />}
              title="Reveal Contact Details"
              description="Spend a credit to unlock verified email and phone for any company. Free users get 5 reveals/month."
            />
            <StepCard
              number="4"
              icon={<FeatureIcon icon={Ship} variant="primary" size="lg" />}
              title="Connect & Ship"
              description="Reach out directly. Close deals. Scale your international trade business."
            />
          </div>
        </div>
      </section>



      {/* Section 6: Impact Numbers */}
      <section className="py-16 bg-bmn-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {IMPACT_NUMBERS.map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-sm text-blue-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: Why BMN */}
      <section className="py-24 bg-white border-y border-bmn-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-text-primary mb-4">Why BMN?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard
              icon={<FeatureIcon icon={ShieldCheck} variant="primary" size="xl" />}
              title="4.4 Million Companies"
              description="Santander trade intelligence data covering 4.4 million companies in 60+ countries. Real trade flows, real companies — not a scraped directory."
            />
            <ValueCard
              icon={<FeatureIcon icon={Zap} variant="primary" size="xl" />}
              title="Search by HS Code"
              description="Filter by HS chapter, country, and company name. Find exactly the counterparties you need — by product category, not guesswork."
            />
            <ValueCard
              icon={<FeatureIcon icon={Globe2} variant="primary" size="xl" />}
              title="Works for Both Sides"
              description="Whether you export or import, BMN has data on your counterparty. Find buyers for your products or suppliers for your sourcing needs."
            />
          </div>
        </div>
      </section>
      


      {/* Section 8: Perfect For */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ... Header ... */}
          <div className="text-center mb-16">
             <h2 className="text-4xl font-display font-bold text-text-primary mb-4">Perfect For</h2>
             <p className="text-text-secondary text-lg max-w-2xl mx-auto">
               Built for businesses ready to scale internationally
             </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {PERFECT_FOR.map((item) => (
              <ValueCard
                key={item.title}
                icon={<FeatureIcon icon={item.icon} variant="primary" size="xl" />}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 9: Profile Benefits */}
      <section id="profile-benefits" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-text-primary mb-4">Get Organic Leads and Exposure</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Your profile is your 24/7 salesperson — working while you sleep
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROFILE_BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white rounded-xl border border-bmn-border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-center mb-6">
                  <FeatureIcon icon={benefit.icon} variant="primary" size="xl" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4 font-display text-center">
                  {benefit.title}
                </h3>
                <p className="text-text-secondary leading-relaxed text-center">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 10: Pricing */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-text-primary mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Start free. Upgrade when you&apos;re ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
            {/* Free Plan */}
            <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
              <h3 className="text-xl font-bold text-text-primary mb-2">Free</h3>
              <p className="text-3xl font-bold text-text-primary mb-4">
                $0<span className="text-base font-normal text-text-secondary">/month</span>
              </p>
              <ul className="space-y-3 mb-8 flex-grow">
                {FREE_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center py-2.5 px-4 rounded-lg font-semibold border border-bmn-border text-text-primary hover:bg-gray-50 transition-colors text-sm"
              >
                Sign Up Free
              </Link>
            </div>

            {/* Hunter Plan */}
            <div className="bg-white rounded-xl border-2 border-bmn-blue p-6 shadow-xl relative transform lg:scale-110 z-10 h-full flex flex-col">
              <div className="absolute top-0 right-0 bg-bmn-blue text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Hunter</h3>
              <p className="text-3xl font-bold text-text-primary mb-4">
                $199<span className="text-base font-normal text-text-secondary">/month</span>
              </p>
              <p className="text-xs text-text-secondary mb-4 font-medium uppercase tracking-wide">For Sales Teams</p>
              <ul className="space-y-3 mb-8 flex-grow">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-bmn-blue flex-shrink-0 mt-0.5" />
                    <span className="text-text-primary font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup?plan=hunter"
                className="block w-full text-center py-2.5 px-4 rounded-lg font-semibold bg-gradient-primary text-white hover:shadow-lg transition-all text-sm"
              >
                Get Started
              </Link>
            </div>

            {/* Partner Plan */}
            <div className="bg-bmn-navy rounded-xl border border-bmn-border p-6 shadow-sm hover:shadow-md transition-shadow text-white h-full flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2">Partner</h3>
              <p className="text-3xl font-bold text-white mb-4">
                $1,500<span className="text-base font-normal text-blue-200">/mo</span>
              </p>
              <p className="text-xs text-blue-200 mb-4 font-medium uppercase tracking-wide">Done-For-You</p>
              <ul className="space-y-3 mb-8 flex-grow">
                {PARTNER_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-blue-50">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="block w-full text-center py-2.5 px-4 rounded-lg font-semibold bg-white text-bmn-navy hover:bg-blue-50 transition-colors text-sm"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 11: Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-text-primary mb-4">
              What Our Clients Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-gradient-to-b from-blue-50 to-white rounded-xl border border-bmn-border border-l-4 border-l-bmn-blue p-8 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="text-blue-100 font-serif text-6xl leading-none -mb-4 opacity-50">&ldquo;</div>
                <p className="italic text-text-secondary mb-6 relative z-10 text-lg leading-relaxed">{testimonial.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-bmn-blue font-bold text-lg">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-text-primary">{testimonial.name}</p>
                    <p className="text-sm text-text-secondary font-medium">
                      {testimonial.title}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Section 12: CTA Banner */}
      <section className="py-20 bg-bmn-navy text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-1/2 opacity-20 transform translate-x-1/2">
          <BrandArrow className="w-96 h-96" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
            Ready to search 4.4 million global trade companies?
          </h2>
          <Link
            href="/signup"
            className="inline-block bg-white text-gray-900 hover:bg-gray-100 px-10 py-4 rounded-lg font-bold text-xl transition-all shadow-xl"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>

      {/* Section 13: FAQ */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-text-primary mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <FAQAccordion items={FAQ_ITEMS} />
        </div>
      </section>



      {/* Footer */}
      <footer className="relative bg-gradient-primary text-white pt-20 pb-8 overflow-hidden">
        {/* Shimmer Effect Overlay */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:200%_200%] animate-shimmer" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
            
            {/* Left: Brand */}
            <div className="text-center md:text-left shrink-0">
              <span className="text-3xl font-display font-bold text-white block mb-1">BMN</span>
              <p className="text-blue-100 text-sm tracking-wide">Global Trade Intelligence</p>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-16 bg-white/20"></div>

            {/* Right Panel: Content (Links + Copyright) */}
            <div className="grow w-full flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-12">
              {/* Legal Links (Left aligned in this panel) */}
               <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-2 text-blue-100 font-medium text-sm">
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms and Conditions
                </Link>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/refund" className="hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </div>

              {/* Copyright/Invictus (Right aligned in this panel) */}
              <div className="text-center md:text-right text-blue-200 text-xs leading-relaxed shrink-0">
                <p className="mb-0.5">© 2026 Business Market Network. All rights reserved.</p>
                <p className="opacity-80">A product of Invictus International Consulting Services</p>
              </div>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
}



function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-bmn-border p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative group">
      <div className="absolute top-4 right-6 text-6xl font-display font-bold text-gray-100 group-hover:text-blue-50 transition-colors select-none">
        {number}
      </div>
      <div className="mb-6 relative z-10 flex justify-center scale-100 group-hover:scale-110 transition-transform origin-left">
        {icon} 
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-3 relative z-10 font-display group-hover:text-bmn-blue transition-colors text-center">
        {title}
      </h3>
      <p className="text-text-secondary text-sm leading-relaxed relative z-10 text-center">{description}</p>
    </div>
  );
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center p-6 group hover:bg-gray-50 rounded-xl transition-colors">
      <div className="flex justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-bold text-text-primary mb-4 font-display group-hover:text-bmn-blue transition-colors text-center">{title}</h3>
      <p className="text-text-secondary leading-relaxed text-center">{description}</p>
    </div>
  );
}
