declare module 'react-spring' {
  interface SpringValue {
    get(): number;
  }
  export function useSpring(cb: () => unknown): [{ r: SpringValue }, { start: (props: unknown) => void }];
}
