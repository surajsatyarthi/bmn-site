declare module 'react-spring' {
  export function useSpring(cb: () => any): [{ r: any }, { start: (props: any) => void }];
}
