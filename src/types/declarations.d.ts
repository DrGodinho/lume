declare module 'html-to-image' {
  export function toSvg(node: HTMLElement, options?: Record<string, unknown>): Promise<string>
  export function toPng(node: HTMLElement, options?: Record<string, unknown>): Promise<string>
  export function toJpeg(node: HTMLElement, options?: Record<string, unknown>): Promise<string>
  export function toBlob(node: HTMLElement, options?: Record<string, unknown>): Promise<Blob>
  export function toPixelData(node: HTMLElement, options?: Record<string, unknown>): Promise<Uint8ClampedArray>
  export function toCanvas(node: HTMLElement, options?: Record<string, unknown>): Promise<HTMLCanvasElement>
}

declare module '@capacitor/filesystem' {
  export enum Directory {
    Documents = 'DOCUMENTS',
    Data = 'DATA',
    Library = 'LIBRARY',
    Cache = 'CACHE',
    External = 'EXTERNAL',
    ExternalStorage = 'EXTERNAL_STORAGE',
  }

  export interface WriteFileOptions {
    path: string
    data: string
    directory?: Directory
    encoding?: string
    recursive?: boolean
  }

  export interface ReadFileOptions {
    path: string
    directory?: Directory
    encoding?: string
  }

  export interface Filesystem {
    writeFile(options: WriteFileOptions): Promise<{ uri: string }>
    readFile(options: ReadFileOptions): Promise<{ data: string }>
  }

  const Filesystem: Filesystem
  export { Filesystem }
}

declare module '@capacitor/share' {
  export interface ShareOptions {
    title?: string
    text?: string
    url?: string
    files?: string[]
  }

  export interface ShareResult {
    activityType?: string
  }

  export const Share: {
    canShare(): Promise<{ value: boolean }>
    share(options: ShareOptions): Promise<ShareResult>
  }
}

declare module '@capacitor/core' {
  export const Capacitor: {
    isNativePlatform(): boolean
    isNative: boolean
    platform: string
  }
}
