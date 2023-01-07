import { Env, Config, DrawOptions } from './ngx-scanner-face.options';
/**
 * Frame speed ms/fps.
 */
export declare const FPS = 30;
/**
 * setTimeout 1000ms.
 */
export declare const TIMEOUT_DETECT = 1000;
/**
 * user configuration for human, used to fine-tune behavior
 */
export declare const CONFIG: Partial<Config>;
/**
 * Env class that holds detected capabilities
 */
export declare const ENV: Partial<Env>;
/**
 * Draw Options
 */
export declare const DRAW_OPTIONS: Partial<DrawOptions>;
/**
 * MediaStream
s * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 */
export declare const MEDIASTREAM: MediaStreamConstraints;
