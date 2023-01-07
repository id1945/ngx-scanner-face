import { Env as H_Env, Human as H_Human, Config as H_Config, Result as H_Result, DrawOptions as H_DrawOptions, FilterConfig as H_FilterConfig, GestureConfig as H_GestureConfig, FaceConfig as H_FaceConfig, BodyConfig as H_BodyConfig, HandConfig as H_HandConfig, ObjectConfig as H_ObjectConfig, SegmentationConfig as H_SegmentationConfig, FaceResult as H_FaceResult, BodyResult as H_BodyResult, HandResult as H_HandResult, GestureResult as H_GestureResult, ObjectResult as H_ObjectResult, PersonResult as H_PersonResult, FaceDetectorConfig as H_FaceDetectorConfig, FaceMeshConfig as H_FaceMeshConfig, FaceDescriptionConfig as H_FaceDescriptionConfig, FaceEmotionConfig as H_FaceEmotionConfig, FaceGearConfig as H_FaceGearConfig } from 'ngx-scanner-face-human';
export declare class Env extends H_Env {
}
export declare class Human extends H_Human {
}
export interface Config extends H_Config {
}
export interface DrawOptions extends H_DrawOptions {
}
export interface Result extends H_Result {
}
export interface ScannerFaceConfig {
    src?: string;
    isAuto?: boolean;
    isLoading?: boolean;
    fps?: number;
    timeoutDetect?: number;
    env?: Partial<H_Env>;
    draw?: Partial<H_DrawOptions>;
    human?: Partial<H_Config>;
    medias?: MediaStreamConstraints;
}
export interface ScannerFaceResult {
    file?: File;
    name?: string;
    url?: string;
    blob?: any;
    base64?: string;
    result?: Result;
}
export interface Device {
    deviceId: string;
    kind: string;
    label: string;
    groupId: string;
}
export interface FilterConfig extends H_FilterConfig {
}
export interface GestureConfig extends H_GestureConfig {
}
export interface FaceConfig extends H_FaceConfig {
}
export interface BodyConfig extends H_BodyConfig {
}
export interface HandConfig extends H_HandConfig {
}
export interface ObjectConfig extends H_ObjectConfig {
}
export interface SegmentationConfig extends H_SegmentationConfig {
}
export interface FaceResult extends H_FaceResult {
}
export interface BodyResult extends H_BodyResult {
}
export interface HandResult extends H_HandResult {
}
export declare type GestureResult = H_GestureResult;
export interface ObjectResult extends H_ObjectResult {
}
export interface PersonResult extends H_PersonResult {
}
export interface FaceDetectorConfig extends H_FaceDetectorConfig {
}
export interface FaceMeshConfig extends H_FaceMeshConfig {
}
export interface FaceDescriptionConfig extends H_FaceDescriptionConfig {
}
export interface FaceEmotionConfig extends H_FaceEmotionConfig {
}
export interface FaceGearConfig extends H_FaceGearConfig {
}
