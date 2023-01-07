/**
 * @default ngx-scanner-face
 * @author <DaiDH>
 * @package https://www.npmjs.com/package/ngx-scanner-face
 * @license MIT https://github.com/id1945/ngx-scanner-face/blob/master/LICENSE
 * @copyright <https://github.com/id1945>
*/
import { ElementRef, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { AsyncSubject, BehaviorSubject } from 'rxjs';
import { ScannerFaceConfig, Config, DrawOptions, Env, Result, Device } from './ngx-scanner-face.options';
import * as i0 from "@angular/core";
export declare class NgxScannerFaceComponent implements OnInit, OnDestroy {
    /**
     * Element
     * playsinline required to tell iOS safari we don't want fullscreen
     */
    video: ElementRef<HTMLVideoElement>;
    canvas: ElementRef<HTMLCanvasElement>;
    /**
     * EventEmitter
     */
    event: EventEmitter<Partial<Result>>;
    error: EventEmitter<any>;
    /**
     * Input
     */
    src: string;
    isAuto: boolean;
    fps: number;
    timeoutDetect: number;
    medias: MediaStreamConstraints;
    env: Partial<Env>;
    draw: Partial<DrawOptions>;
    human: Partial<Config>;
    config: ScannerFaceConfig;
    style: any;
    videoStyle: any;
    canvasStyle: any;
    /**
     * Export
     */
    isStart: boolean;
    isLoading: boolean;
    data: BehaviorSubject<Partial<Result>>;
    devices: BehaviorSubject<Device[]>;
    private rAF_ID;
    private detectionLoop;
    private H_OBJ;
    private interpolated;
    ngOnInit(): void;
    /**
     * start
     * @return AsyncSubject
     */
    start(): AsyncSubject<any>;
    /**
     * playDevice
     * @param deviceId
     * @param as
     * @returns
     */
    playDevice(deviceId: string, as?: AsyncSubject<any>): AsyncSubject<any>;
    /**
     * stop
     * @return AsyncSubject
     */
    stop(): AsyncSubject<any>;
    /**
     * play
     * @return AsyncSubject
     */
    play(): AsyncSubject<any>;
    /**
     * pause
     * @return AsyncSubject
     */
    pause(): AsyncSubject<any>;
    /**
     * loadImage
     * @param src
     */
    loadImage(src: string): AsyncSubject<any>;
    /**
     * download
     * @param fileName
     * @return AsyncSubject
     */
    download(fileName: string): AsyncSubject<{
        url: string;
        el: HTMLCanvasElement;
    }>;
    /**
     * getDevices
     */
    private getDevices;
    /**
     * Override Config
     */
    private overrideConfig;
    /**
     * Override Env
     * @return void
     */
    private overrideEnv;
    /**
     * Override drawOptions
     * @return void
     */
    private overrideDraw;
    /**
     * status
     * @param isStart
     * @param isLoading
     */
    private status;
    /**
     * eventEmit
     * @param response
     * @param error
     */
    private eventEmit;
    /**
     * Status of camera
     * @return boolean
     */
    get isPause(): boolean;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxScannerFaceComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgxScannerFaceComponent, "ngx-scanner-face", ["scanner"], { "src": "src"; "isAuto": "isAuto"; "fps": "fps"; "timeoutDetect": "timeoutDetect"; "medias": "medias"; "env": "env"; "draw": "draw"; "human": "human"; "config": "config"; "style": "style"; "videoStyle": "videoStyle"; "canvasStyle": "canvasStyle"; }, { "event": "event"; "error": "error"; }, never, ["*"]>;
}
