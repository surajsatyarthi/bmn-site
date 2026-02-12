"use client";

import { ArrowRight, Globe2, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { Globe } from "@/components/ui/Globe";

const NEWS_ITEMS = [
  {
    category: "Market Expansion",
    title: "India-UAE trade corridor sees 40% surge in textile exports",
    time: "2 hours ago",
    icon: TrendingUp,
  },
  {
    category: "Market Insights",
    title: "Global demand for organic spices hits record high in European markets",
    time: "4 hours ago",
    icon: Globe2,
  },
  {
    category: "Community",
    title: "Over 500+ new verified buyers joined from Germany this week",
    time: "2 days ago",
    icon: Users,
  },
];

export function NewsSection() {
  return (
    <section className="py-24 bg-white border-t border-bmn-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Content */}
          <div className="flex-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              Live Updates
            </div>
            
            <h2 className="text-4xl font-display font-bold text-text-primary mb-6">
              Real-Time <br />
              <span className="text-gradient-primary">Export Import Updates</span>
            </h2>
            
            <p className="text-lg text-text-secondary mb-8">
              Stay ahead of the curve with real-time global export-import news, actionable market insights, and exclusive community updates from our growing network.
            </p>

            <div className="space-y-6 mb-8">
              {NEWS_ITEMS.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-transparent hover:border-bmn-border hover:bg-white hover:shadow-sm transition-all duration-300 group cursor-default">
                  <div className="shrink-0 w-12 h-12 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-bmn-blue group-hover:scale-110 transition-transform">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-bmn-blue uppercase tracking-wide">{item.category}</span>
                      <span className="text-xs text-text-secondary px-1.5 py-0.5 rounded-md bg-gray-100">{item.time}</span>
                    </div>
                    <h3 className="text-text-primary font-semibold leading-tight group-hover:text-bmn-blue transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            <Link 
              href="/signup" 
              className="inline-flex items-center text-bmn-blue font-semibold hover:gap-2 transition-all group"
            >
              View All Market Insights <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right Globe */}
          <div className="flex-1 w-full relative flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl opacity-50 transform scale-75"></div>
            <Globe className="relative z-10" />
          </div>

        </div>
      </div>
    </section>
  );
}
