declare module 'qrcode' {
  export interface QRCodeOptions {
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H' | 'low' | 'medium' | 'quartile' | 'high';
    margin?: number;
    scale?: number;
    width?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }

  export interface QRCodeSegment {
    data: string;
    mode: string;
  }

  export interface QRCodeModule {
    size: number;
    data: Uint8Array;
    reservedBit: Uint8Array;
    get(row: number, col: number): boolean;
  }

  export function create(text: string, options?: QRCodeOptions): { modules: QRCodeModule };
  export function toCanvas(canvas: HTMLCanvasElement, text: string | QRCodeSegment[], options?: QRCodeOptions): Promise<void>;
  export function toDataURL(text: string | QRCodeSegment[], options?: QRCodeOptions): Promise<string>;
}
