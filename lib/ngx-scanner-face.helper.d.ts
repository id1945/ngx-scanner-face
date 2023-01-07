import { AsyncSubject } from "rxjs";
/**
 * Override Config
 */
export declare const OVERRIDES: (defaultConfig: any, switchConfig: any) => any;
/**
 * Rxjs complete
 * @param as
 * @param data
 * @param error
 */
export declare const AS_COMPLETE: (as: AsyncSubject<any>, data: any, error?: null) => void;
