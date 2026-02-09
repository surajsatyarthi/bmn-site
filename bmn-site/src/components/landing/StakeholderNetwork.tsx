'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { 
  Building2, 
  Truck, 
  Factory, 
  Briefcase, 
  Ship, 
  FileCheck, 
  Shield,
  Banknote, 
} from 'lucide-react';
import { FeatureIcon } from '@/components/ui/FeatureIcon';
import { useNodeConnections } from '@/hooks/useNodeConnections';

// ... (existing imports)

const STAKEHOLDERS = [
  { id: 'exporters', name: 'Exporters', icon: Building2 }, // 0: Top Left
  { id: 'importers', name: 'Importers', icon: Truck },     // 1: Top Mid
  { id: 'manufacturers', name: 'Manufacturers', icon: Factory }, // 2: Top Right
  
  { id: 'trade-brokers', name: 'Trade Brokers', icon: Briefcase }, // 3: Mid Left
  { id: 'freight-forwarders', name: 'Freight Forwarders', icon: Ship }, // 4: Mid Right
  
  { id: 'customs', name: 'Customs Brokers', icon: Shield, delay: '3s' },
  { id: 'finance', name: 'Trade Financiers', icon: Banknote, delay: '3.5s' }, 
  { id: 'insurance', name: 'Insurance Providers', icon: FileCheck, delay: '4s' },
];

export function StakeholderNetwork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const stakeholderRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize refs array
  stakeholderRefs.current = STAKEHOLDERS.map((_, i) => stakeholderRefs.current[i] ?? null);

  // Helper to get ref objects from the array
  const targetRefObjects = STAKEHOLDERS.map((_, i) => ({
    get current() { return stakeholderRefs.current[i]; }
  }));

  const connections = useNodeConnections(hubRef, targetRefObjects);

  return (
    <div className="w-full relative network-container" ref={containerRef}>
      
      {/* SVG Connection Layer - Absolute & Responsive */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg className="w-full h-full">
          
          {connections.map((coords, i) => (
             <ConnectionLine 
                key={`conn-${i}`}
                x1={coords.x1} 
                y1={coords.y1} 
                x2={coords.x2} 
                y2={coords.y2} 
                delay={`${i * 0.1}s`} 
             />
          ))}
        </svg>
      </div>

      {/* Responsive Layout Container */}
      {/* Mobile: Flex Column (Hub Top -> Nodes Below) */}
      {/* Desktop: CSS Grid (Hub Center -> Nodes Around) */}
      
      <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-3 items-center justify-items-center gap-8 lg:gap-y-20 lg:gap-x-12 max-w-5xl mx-auto min-h-[600px] py-12">
        
        {/* Mobile: Hub is First. Desktop: Hub is in Center (Row 2, Col 2) */}
        <div 
            ref={hubRef}
            className="order-first lg:order-none lg:col-start-2 lg:col-end-3 lg:row-start-2 lg:row-end-3"
        >
             <div className="relative w-32 h-32 lg:w-48 lg:h-48 flex items-center justify-center">
                 {/* High Contrast Pulse - Deep Brand Blue + Blurred Edges */}
                 <div className="absolute inset-0 rounded-full bg-blue-600/20 animate-pulse-slow delay-700 blur-xl"></div>
                 <div className="absolute inset-4 rounded-full bg-blue-600/40 animate-pulse delay-300 blur-xl"></div>
                 <div className="absolute inset-8 rounded-full bg-blue-600/60 animate-pulse blur-xl"></div>
                 
                 <div className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-white backdrop-blur-md border-2 border-blue-600 shadow-2xl flex flex-col items-center justify-center z-20 overflow-hidden p-4">
                    <Image 
                      src="/branding/bmn-avatar.png" 
                      alt="BMN Logo" 
                      className="object-contain animate-pulse"
                      fill
                      priority
                    />
                 </div>
            </div>
        </div>

        {/* Stakeholders Loop */}
        {/* We need to assign specific grid positions for Desktop to maintain the "Network" shape */}
        {/* Mobile: Just list them. Desktop: Use grid-area or specific col/row placement */}
        
        {STAKEHOLDERS.map((s, i) => {
            // Determine Grid Position for Desktop (3x3 Grid)
            // Indices:
            // 0 1 2  (Row 1)
            // 3 X 4  (Row 2, X is Hub)
            // 5 6 7  (Row 3)
            
            let gridClass = "";
            if (i === 0) gridClass = "lg:col-start-1 lg:row-start-1"; // Top Left
            if (i === 1) gridClass = "lg:col-start-2 lg:row-start-1"; // Top Mid
            if (i === 2) gridClass = "lg:col-start-3 lg:row-start-1"; // Top Right
            
            if (i === 3) gridClass = "lg:col-start-1 lg:row-start-2"; // Mid Left
            if (i === 4) gridClass = "lg:col-start-3 lg:row-start-2"; // Mid Right
            
            if (i === 5) gridClass = "lg:col-start-1 lg:row-start-3"; // Bot Left
            if (i === 6) gridClass = "lg:col-start-2 lg:row-start-3"; // Bot Mid (NEW)
            if (i === 7) gridClass = "lg:col-start-3 lg:row-start-3"; // Bot Right

            return (
                <div 
                    key={s.id}
                    ref={el => { stakeholderRefs.current[i] = el; }}
                    className={`order-last lg:order-none ${gridClass} w-full flex justify-center`}
                >
                    <StakeholderNode stakeholder={s} />
                </div>
            );
        })}

      </div>
    </div>
  );
}

function ConnectionLine({ x1, y1, x2, y2, delay }: { x1: number, y1: number, x2: number, y2: number, delay: string }) {
    if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) return null;

    return (
        <g>
            {/* Animated Data Flow Only - No Base Line */}
            <line 
                x1={x1} y1={y1} x2={x2} y2={y2} 
                stroke="#2563eb" 
                strokeOpacity="0.4"
                strokeWidth="2"
                strokeDasharray="4 8"
                className="animate-[dash_1s_linear_infinite]"
                style={{ animationDelay: delay }}
            />
        </g>
    );
}

function StakeholderNode({ 
  stakeholder, 
}: { 
  stakeholder: typeof STAKEHOLDERS[0];
}) {
  return (
    <div
      className="relative flex flex-col items-center text-center w-32 md:w-40 z-10"
    >
      <div className="mb-3 transform transition-transform duration-300 hover:scale-110">
          <FeatureIcon icon={stakeholder.icon} size="xl" />
      </div>
      <h4 className="font-bold text-text-primary text-sm md:text-base leading-tight">
          {stakeholder.name}
      </h4>
    </div>
  );
}
