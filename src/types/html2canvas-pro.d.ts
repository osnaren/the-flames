declare module 'html2canvas-pro/dist/html2canvas-pro.esm.js' {
  import type { Options } from 'html2canvas-pro';
  const html2canvas: (element: HTMLElement, options?: Partial<Options>) => Promise<HTMLCanvasElement>;
  export default html2canvas;
}
