declare module 'cobe' {
  export default function createGlobe(
    canvas: HTMLCanvasElement,
    options: {
      devicePixelRatio: number;
      width: number;
      height: number;
      phi: number;
      theta: number;
      dark: number;
      diffuse: number;
      mapSamples: number;
      mapBrightness: number;
      baseColor: [number, number, number];
      markerColor: [number, number, number];
      glowColor: [number, number, number];
      opacity?: number;
      markers: { location: [number, number]; size: number }[];
      onRender: (state: Record<string, unknown>) => void;
    }
  ): { destroy: () => void };
}
