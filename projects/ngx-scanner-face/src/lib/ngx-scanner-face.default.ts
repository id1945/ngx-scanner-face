import {
  Env,
  Config,
  DrawOptions,
} from './ngx-scanner-face.options';

/**
 * Frame speed ms/fps.
 */
export const FPS = 30;

/**
 * setTimeout 1000ms.
 */
export const TIMEOUT_DETECT = 1000;

/**
 * user configuration for human, used to fine-tune behavior
 */
export const CONFIG: Partial<Config> = {
  async: false,
  modelBasePath: './models',
  filter: {
    flip: false,
    enabled: true,
    equalization: false,
  },
  face: {
    enabled: true,
    detector: {
      rotation: false,
    },
    mesh: {
      enabled: true,
    },
    attention: {
      enabled: false,
    },
    iris: {
      enabled: true,
    },
    description: {
      enabled: true,
    },
    emotion: {
      enabled: true,
    },
  },
  body: { enabled: true },
  hand: { enabled: true },
  object: { enabled: false },
  gesture: { enabled: true },
};

/**
 * Env class that holds detected capabilities
 */
export const ENV: Partial<Env> = {
  perfadd: false, // is performance data showing instant or total values
};

/**
 * Draw Options
 */
export const DRAW_OPTIONS: Partial<DrawOptions> = {
  font: 'monospace', // set font used to draw labels when using draw methods
  lineHeight: 20,
};

/**
 * MediaStream
s * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 */
export const MEDIASTREAM: MediaStreamConstraints = {
  audio: false,
  video: true
};