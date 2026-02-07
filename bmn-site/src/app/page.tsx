import Link from "next/link";
import Image from "next/image";
import { Header } from '@/components/layout/Header';
import { FAQAccordion } from '@/components/landing/FAQAccordion';
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
} from 'lucide-react';
import { BrandArrow } from '@/components/icons/BrandArrow';
import { FeatureIcon } from '@/components/ui/FeatureIcon';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BMN - We Find Your Buyers. You Ship.',
  description:
    'BMN connects Indian exporters with verified international buyers. No cold calls. No trade shows. Just matches.',
};



const IMPACT_NUMBERS = [
  { value: '200+', label: 'Companies Onboarded' },
  { value: '200+', label: 'Countries Covered' },
  { value: '1M+', label: 'Trade Records in Database' },
];

const STATS_BAR = [
  { value: '$2.5M+', label: 'Deals Facilitated' },
  { value: '70%', label: 'Faster Buyer Discovery' },
  { value: '50%', label: 'Faster Approval Process' },
];

const PERFECT_FOR = [
  {
    icon: Ship,
    title: 'Exporters',
    description:
      'Indian manufacturers and traders looking to find verified international buyers for their products.',
  },
  {
    icon: Factory,
    title: 'Manufacturers',
    description:
      'Production houses with export-ready goods seeking direct buyer relationships without middlemen.',
  },
  {
    icon: Briefcase,
    title: 'Trade Brokers',
    description:
      'Trade intermediaries looking to expand their portfolio with data-backed buyer-seller connections.',
  },
];

const FREE_FEATURES = [
  'Unlimited match browsing',
  '3 business detail reveals per month',
  'Basic campaign tracking',
  'Email support',
];

const PRO_FEATURES = [
  'Unlimited match reveals',
  'Priority outreach campaigns',
  'Dedicated account manager',
  'Advanced analytics',
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
      "The done-for-you approach is exactly what Indian exporters need. No more chasing fake leads.",
    name: "Anil Mehta",
    title: "Founder",
    company: "Mehta Spices, Kerala",
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

const FAQ_ITEMS = [
  {
    question: "What is BMN?",
    answer:
      "BMN is an export done-for-you service that connects Indian exporters with verified international buyers using AI-powered matching and outreach.",
  },
  {
    question: "How does BMN find buyers?",
    answer:
      "We use AI to analyze global trade data, customs records, and buyer databases to find companies actively importing products similar to yours.",
  },
  {
    question: "Is BMN free to use?",
    answer:
      "Yes. You can sign up for free and browse all your matches. Business detail reveals are limited to 3 per month on the free plan.",
  },
  {
    question: "What is a \"reveal\"?",
    answer:
      "When you find a match you're interested in, you can \"reveal\" their full business details — contact info, trade history, and address. Free users get 3 reveals per month.",
  },
  {
    question: "How are matches scored?",
    answer:
      "We rank matches as \"Best\", \"Great\", or \"Good\" based on product alignment, trade history, volume compatibility, and geographic fit.",
  },
  {
    question: "What happens after I express interest?",
    answer:
      "Our team creates a targeted email outreach campaign to introduce your company to the buyer. You can track the campaign status from your dashboard.",
  },
  {
    question: "Do I need an IEC number?",
    answer:
      "An IEC (Import Export Code) is recommended but not required to sign up. It helps us verify your export readiness and improves match quality.",
  },
  {
    question: "Which countries do you cover?",
    answer:
      "We currently cover 60+ countries with active trade flows to and from India, including UAE, USA, Germany, UK, Japan, Singapore, and more.",
  },
  {
    question: "How long does it take to get matches?",
    answer:
      "Most users see their first matches within 24-48 hours of completing their trade profile.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Absolutely. We use enterprise-grade encryption and never share your data with third parties without your explicit consent.",
  },
  {
    question: "Can importers use BMN?",
    answer:
      "Yes. While our primary focus is helping Indian exporters find buyers, importers can also sign up to find verified suppliers.",
  },
  {
    question: "How do I upgrade to Pro?",
    answer:
      "The Pro plan is coming soon. Contact us to join the waitlist for unlimited reveals, priority campaigns, and dedicated support.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-bmn-light-bg text-text-primary">
      <Header />

      {/* Section 1: Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gradient-primary font-bold tracking-widest text-sm uppercase mb-4">
            CONNECT • GROW • SUCCEED
          </p>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 text-text-primary">
            AI Finds Your Buyers. <span className="text-gradient-primary">You Ship.</span>
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-10 leading-relaxed">
            Identify verified buyers. Automate your outreach. Accelerate global growth.
          </p>
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
        </div>
      </section>


      {/* Section 2: Global Reach */}
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

      {/* Section 3: Trusted By */}
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

      {/* Section 3: How It Works */}
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
              title="Tell Us What You Trade"
              description="Complete your trade profile with products, certifications, and target markets."
            />
            <StepCard
              number="2"
              icon={<FeatureIcon icon={Search} variant="primary" size="lg" />}
              title="AI Identifies Matches"
              description="Our intelligent algorithms scan global customs data to pinpoint high-intent buyers for your specific products."
            />
            <StepCard
              number="3"
              icon={<FeatureIcon icon={Handshake} variant="primary" size="lg" />}
              title="Review & Connect"
              description="Review matched buyers, see their requirements, and express interest."
            />
            <StepCard
              number="4"
              icon={<FeatureIcon icon={Ship} variant="primary" size="lg" />}
              title="Ship & Grow"
              description="Close deals, ship your products, and scale your export business."
            />
          </div>
        </div>
      </section>

      {/* Section 4: Impact Numbers */}
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

      {/* Section 5: Why BMN */}
      <section className="py-24 bg-white border-y border-bmn-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-text-primary mb-4">Why BMN?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard
              icon={<FeatureIcon icon={ShieldCheck} variant="primary" size="xl" />}
              title="Verified Buyers Only"
              description="Every buyer on our platform is verified. No spam, no time-wasters. We focus on quality matches that convert."
            />
            <ValueCard
              icon={<FeatureIcon icon={Zap} variant="primary" size="xl" />}
              title="AI-Powered Precision"
              description="Stop guessing. Our matching engine verifies intent and compatibility, ensuring every lead is a potential deal."
            />
            <ValueCard
              icon={<FeatureIcon icon={Globe2} variant="primary" size="xl" />}
              title="Built for Indian Exporters"
              description="We understand Indian trade compliance, documentation, and logistics. Tailored for the modern Indian merchant."
            />
          </div>
        </div>
      </section>
      
      {/* ... Stats Bar ... */}

      {/* Section 7: Perfect For */}
      <section className="py-24 bg-white">
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

      {/* Section 8: Pricing */}
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

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-xl border border-bmn-border p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-text-primary mb-2">Free</h3>
              <p className="text-4xl font-bold text-text-primary mb-6">
                $0<span className="text-lg font-normal text-text-secondary">/month</span>
              </p>
              <ul className="space-y-3 mb-8">
                {FREE_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center py-3 px-6 rounded-lg font-semibold border border-bmn-border text-text-primary hover:bg-gray-50 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white rounded-xl border-2 border-bmn-blue p-8 shadow-sm relative">
              <h3 className="text-2xl font-bold text-text-primary mb-2">Pro</h3>
              <p className="text-4xl font-bold text-text-primary mb-6">Coming Soon</p>
              <ul className="space-y-3 mb-8">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="block w-full text-center py-3 px-6 rounded-lg font-semibold bg-gradient-primary text-white hover:shadow-lg transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 9: Testimonials */}
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
                className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm"
              >
                <p className="italic text-text-secondary mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold text-text-primary">{testimonial.name}</p>
                  <p className="text-sm text-text-secondary">
                    {testimonial.title}, {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Section 11: CTA Banner */}
      <section className="py-20 bg-bmn-navy text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-1/2 opacity-20 transform translate-x-1/2">
          <BrandArrow className="w-96 h-96" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
            Ready to find your first buyer?
          </h2>
          <Link
            href="/signup"
            className="inline-block bg-white text-gray-900 hover:bg-gray-100 px-10 py-4 rounded-lg font-bold text-xl transition-all shadow-xl"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>

      {/* Section 12: FAQ */}
      <section id="faq" className="py-24 bg-gradient-to-b from-blue-50 to-white">
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
              <p className="text-blue-100 text-sm tracking-wide">Export Done-For-You</p>
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
  icon: React.ReactNode; // LucideIcon element
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-bmn-border p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative group">
      <div className="absolute top-4 right-6 text-6xl font-display font-bold text-gray-100 group-hover:text-blue-50 transition-colors select-none">
        {number}
      </div>
      <div className="mb-6 relative z-10 scale-100 group-hover:scale-110 transition-transform origin-left">
        {/* We expect icon to be passed as Element in original code, but we want to standardize. 
            However, the original code passed <Icon />, not Icon component.
            Let's adjust the caller site or wrapper. 
            For now, let's wrap the passed icon in a consistent div if needed, OR better:
            The caller passes <Package ... />. We should instead just pass the Icon Component to FeatureIcon if we refactor totally.
            But to be safe with minimal changes, let's keep the passed styling if it matches, 
            OR update the caller sites.
        */}
        {icon} 
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-3 relative z-10 font-display group-hover:text-bmn-blue transition-colors">
        {title}
      </h3>
      <p className="text-text-secondary text-sm leading-relaxed relative z-10">{description}</p>
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
      <h3 className="text-xl font-bold text-text-primary mb-4 font-display group-hover:text-bmn-blue transition-colors">{title}</h3>
      <p className="text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}
