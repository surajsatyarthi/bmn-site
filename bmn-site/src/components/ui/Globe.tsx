"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { useSpring } from 'react-spring';

export function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [{ r }, api] = useSpring(() => ({
    r: 0,
    config: {
      mass: 1,
      tension: 280,
      friction: 40,
      precision: 0.001,
    },
  }));

  useEffect(() => {
    let phi = 0;
    let width = 0;
    const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth)
    window.addEventListener('resize', onResize)
    onResize()
    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [1, 1, 1],
      markerColor: [37 / 255, 99 / 255, 235 / 255], // BMN Blue
      glowColor: [1, 1, 1],
      markers: [
        { location: [37.7595, -122.4367], size: 0.03 }, // San Francisco
        { location: [40.7128, -74.006], size: 0.03 }, // New York
        { location: [51.5074, -0.1278], size: 0.03 }, // London
        { location: [28.6139, 77.2090], size: 0.03 }, // New Delhi
        { location: [35.6762, 139.6503], size: 0.03 }, // Tokyo
        { location: [-33.8688, 151.2093], size: 0.03 }, // Sydney
        { location: [25.2048, 55.2708], size: 0.03 }, // Dubai
        { location: [1.3521, 103.8198], size: 0.03 }, // Singapore
        { location: [22.3193, 114.1694], size: 0.03 }, // Hong Kong
        { location: [31.2304, 121.4737], size: 0.03 }, // Shanghai
        { location: [19.0760, 72.8777], size: 0.03 }, // Mumbai
        { location: [53.5511, 9.9937], size: 0.03 }, // Hamburg
        { location: [41.9028, 12.4964], size: 0.03 }, // Rome
        { location: [-23.5505, -46.6333], size: 0.03 }, // Sao Paulo
        { location: [6.5244, 3.3792], size: 0.03 }, // Lagos
        { location: [30.0444, 31.2357], size: 0.03 }, // Cairo
        { location: [48.8566, 2.3522], size: 0.03 }, // Paris
        { location: [55.7558, 37.6173], size: 0.03 }, // Moscow
        { location: [39.9042, 116.4074], size: 0.03 }, // Beijing
        { location: [34.0522, -118.2437], size: 0.03 }, // Los Angeles
        { location: [41.8781, -87.6298], size: 0.03 }, // Chicago
        { location: [25.7617, -80.1918], size: 0.03 }, // Miami
        { location: [-34.6037, -58.3816], size: 0.03 }, // Buenos Aires
        { location: [-33.9249, 18.4241], size: 0.03 }, // Cape Town
        { location: [52.5200, 13.4050], size: 0.03 }, // Berlin
        { location: [40.4168, -3.7038], size: 0.03 }, // Madrid
        { location: [59.3293, 18.0686], size: 0.03 }, // Stockholm
        { location: [52.3676, 4.9041], size: 0.03 }, // Amsterdam
        { location: [48.2082, 16.3738], size: 0.03 }, // Vienna
        { location: [50.1109, 8.6821], size: 0.03 }, // Frankfurt
        { location: [41.0082, 28.9784], size: 0.03 }, // Istanbul
        { location: [24.7136, 46.6753], size: 0.03 }, // Riyadh
        { location: [29.3759, 47.9774], size: 0.03 }, // Kuwait City
        { location: [21.4858, 39.1925], size: 0.03 }, // Jeddah
        { location: [-1.2921, 36.8219], size: 0.03 }, // Nairobi
        { location: [5.6037, -0.1870], size: 0.03 }, // Accra
        { location: [-26.2041, 28.0473], size: 0.03 }, // Johannesburg
        { location: [3.1390, 101.6869], size: 0.03 }, // Kuala Lumpur
        { location: [13.7563, 100.5018], size: 0.03 }, // Bangkok
        { location: [-6.2088, 106.8456], size: 0.03 }, // Jakarta
        { location: [14.5995, 120.9842], size: 0.03 }, // Manila
        { location: [10.8231, 106.6297], size: 0.03 }, // Ho Chi Minh City
        { location: [37.5665, 126.9780], size: 0.03 }, // Seoul
        { location: [23.1291, 113.2644], size: 0.03 }, // Guangzhou
        { location: [22.5431, 114.0579], size: 0.03 }, // Shenzhen
        { location: [39.0842, 117.2009], size: 0.03 }, // Tianjin
        { location: [30.5728, 104.0668], size: 0.03 }, // Chengdu
        { location: [-37.8136, 144.9631], size: 0.03 }, // Melbourne
        { location: [-31.9505, 115.8605], size: 0.03 }, // Perth
        { location: [-36.8485, 174.7633], size: 0.03 }, // Auckland
        { location: [43.6532, -79.3832], size: 0.03 }, // Toronto
        { location: [45.5017, -73.5673], size: 0.03 }, // Montreal
        { location: [49.2827, -123.1207], size: 0.03 }, // Vancouver
        { location: [19.4326, -99.1332], size: 0.03 }, // Mexico City
        { location: [4.7110, -74.0721], size: 0.03 }, // Bogota
        { location: [-12.0464, -77.0428], size: 0.03 }, // Lima
        { location: [-33.4489, -70.6693], size: 0.03 }, // Santiago
        { location: [29.7604, -95.3698], size: 0.03 }, // Houston
        { location: [32.7767, -96.7970], size: 0.03 }, // Dallas
        { location: [33.4484, -112.0740], size: 0.03 }, // Phoenix
        { location: [39.7392, -104.9903], size: 0.03 }, // Denver
        { location: [47.6062, -122.3321], size: 0.03 }, // Seattle
        { location: [42.3601, -71.0589], size: 0.03 }, // Boston
        { location: [38.9072, -77.0369], size: 0.03 }, // Washington DC
        { location: [36.1627, -86.7816], size: 0.03 }, // Nashville
        { location: [29.9511, -90.0715], size: 0.03 }, // New Orleans
        { location: [44.9778, -93.2650], size: 0.03 }, // Minneapolis
        { location: [53.3498, -6.2603], size: 0.03 }, // Dublin
        { location: [60.1699, 24.9384], size: 0.03 }, // Helsinki
        { location: [55.6761, 12.5683], size: 0.03 }, // Copenhagen
        { location: [59.9139, 10.7522], size: 0.03 }, // Oslo
        { location: [52.2297, 21.0122], size: 0.03 }, // Warsaw
        { location: [50.0755, 14.4378], size: 0.03 }, // Prague
        { location: [47.4979, 19.0402], size: 0.03 }, // Budapest
        { location: [44.4268, 26.1025], size: 0.03 }, // Bucharest
        { location: [37.9838, 23.7275], size: 0.03 }, // Athens
        { location: [31.7683, 35.2137], size: 0.03 }, // Jerusalem
        { location: [32.0853, 34.7818], size: 0.03 }, // Tel Aviv
        { location: [35.6892, 51.3890], size: 0.03 }, // Tehran
        { location: [33.3152, 44.3661], size: 0.03 }, // Baghdad
        { location: [24.8607, 67.0011], size: 0.03 }, // Karachi
        { location: [31.5204, 74.3587], size: 0.03 }, // Lahore
        { location: [23.8103, 90.4125], size: 0.03 }, // Dhaka
        { location: [6.9271, 79.8612], size: 0.03 }, // Colombo
        { location: [16.8409, 96.1735], size: 0.03 }, // Yangon
        { location: [11.5564, 104.9282], size: 0.03 }, // Phnom Penh
        { location: [34.0209, -6.8416], size: 0.03 }, // Rabat
        { location: [36.8065, 10.1815], size: 0.03 }, // Tunis
        { location: [3.8480, 11.5021], size: 0.03 }, // Yaounde
        { location: [-4.4419, 15.2663], size: 0.03 }, // Kinshasa
        { location: [9.0820, 8.6753], size: 0.03 }, // Abuja
        { location: [14.6928, -17.4467], size: 0.03 }, // Dakar
        { location: [-18.9137, 47.5079], size: 0.03 }, // Antananarivo
        { location: [-25.9692, 32.5732], size: 0.03 }, // Maputo
        { location: [-15.4166, 28.2833], size: 0.03 }, // Lusaka
        { location: [-17.8216, 31.0492], size: 0.03 }, // Harare
        { location: [-1.9441, 30.0619], size: 0.03 }, // Kigali
        { location: [0.3476, 32.5825], size: 0.03 }, // Kampala
        { location: [8.9806, 38.7578], size: 0.03 }, // Addis Ababa
      ],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        if (!pointerInteracting.current) {
          phi += 0.005
        }
        state.phi = phi + r.get()
        state.width = width * 2
        state.height = width * 2
      }
    })
    setTimeout(() => {
        if (canvasRef.current) {
            canvasRef.current.style.opacity = '1'
        }
    })
    return () => { 
      globe.destroy();
      window.removeEventListener('resize', onResize);
    }
  }, [r])

  return (
    <div className={className} style={{
      width: '100%',
      maxWidth: 600,
      aspectRatio: 1,
      margin: 'auto',
      position: 'relative',
    }}>
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current =
            e.clientX - pointerInteractionMovement.current;
          canvasRef.current!.style.cursor = 'grabbing';
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          canvasRef.current!.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          canvasRef.current!.style.cursor = 'grab';
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            api.start({
              r: delta / 200,
            });
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            api.start({
              r: delta / 100,
            });
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          contain: 'layout paint size',
          opacity: 0,
          transition: 'opacity 1s ease',
        }}
      />
    </div>
  )
}
