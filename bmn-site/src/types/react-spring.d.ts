declare module 'react-spring' {
  export function useSpring(cb: () => unknown): [{ r: unknown }, { start: (props: unknown) => void }];
}
