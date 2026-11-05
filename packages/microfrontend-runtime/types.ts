export interface MountOptions {
  onReady?: () => void;
  onError?: (error: unknown) => void;
}

export type Unmount = () => void;
export type Mount = (host: HTMLElement, options?: MountOptions) => Unmount;
export interface MicrofrontendModule {
  mount: Mount;
}
