/**
 * @default ngx-scanner-face
 * @author <DaiDH>
 * @package https://www.npmjs.com/package/ngx-scanner-face
 * @license MIT https://github.com/id1945/ngx-scanner-face/blob/master/LICENSE
 * @copyright <https://github.com/id1945>
*/

import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AsyncSubject, BehaviorSubject } from 'rxjs';
import { Human } from 'ngx-scanner-face-human';
import { FPS, CONFIG, DRAW_OPTIONS, ENV, MEDIASTREAM, TIMEOUT_DETECT } from './ngx-scanner-face.default';
import { ScannerFaceConfig, Config, DrawOptions, Env, Result, Device } from './ngx-scanner-face.options';
import { AS_COMPLETE, OVERRIDES } from './ngx-scanner-face.helper';

@Component({
  selector: 'ngx-scanner-face',
  template: `<canvas #canvas [style]="canvasStyle || style" style="position: absolute"></canvas><video #video playsinline [style]="videoStyle || style" style="background-color: #262626;"></video><ng-content></ng-content>`,
  inputs: ['src', 'isAuto', 'fps', 'timeoutDetect', 'medias', 'env', 'draw', 'human', 'config', 'style', 'videoStyle', 'canvasStyle'],
  outputs: ['event', 'error'],
  exportAs: 'scanner',
  queries: {
    video: new ViewChild('video', { static: true }),
    canvas: new ViewChild('canvas', { static: true })
  }
})
export class NgxScannerFaceComponent implements OnInit, OnDestroy {

  /**
   * Element
   * playsinline required to tell iOS safari we don't want fullscreen
   */
  public video!: ElementRef<HTMLVideoElement>;
  public canvas!: ElementRef<HTMLCanvasElement>;

  /**
   * EventEmitter
   */
  public event = new EventEmitter<Partial<Result>>();
  public error = new EventEmitter<any>();

  /**
   * Input
   */
  public src: string = '';
  public isAuto: boolean = false; // Auto start camera.
  public fps: number = FPS; // Frame speed ms/fps.
  public timeoutDetect: number = TIMEOUT_DETECT; // setTimeout 1000ms.
  public medias: MediaStreamConstraints = {};
  public env: Partial<Env> = {};
  public draw: Partial<DrawOptions> = {};
  public human: Partial<Config> = {};
  public config: ScannerFaceConfig = {};
  public style: any = null;
  public videoStyle: any = null;
  public canvasStyle: any = null;

  /**
   * Export
   */
  public isStart: boolean = false;
  public isLoading: boolean = false;
  public data = new BehaviorSubject<Partial<Result>>({});
  public devices = new BehaviorSubject<Device[]>([]);

  private rAF_ID: any;
  private detectionLoop: any;
  private H_OBJ!: Human;
  private interpolated!: Result;

  ngOnInit(): void {
    this.overrideConfig();
    if (this.src) {
      this.loadImage(this.src);
    } else if (this.isAuto) {
      this.start();
    }
  }

  /**
   * start
   * @return AsyncSubject
   */
  public start(): AsyncSubject<any> {
    const as = new AsyncSubject<any>();
    if (this.isStart) {
      // Reject
      AS_COMPLETE(as, false);
    } else {
      // mediaDevices
      this.getDevices(as);
    }
    return as;
  }

  /**
   * playDevice
   * @param deviceId 
   * @param as 
   * @returns 
   */
  public playDevice(deviceId: string, as: AsyncSubject<any> = new AsyncSubject<any>()): AsyncSubject<any> {
    stop();
    if (deviceId && deviceId != 'null') {
      const constraints = {
        audio: false,
        video: typeof (this.medias && this.medias.video) === 'boolean' ? { deviceId: deviceId } : Object.assign({ deviceId: deviceId }, this.medias && this.medias.video)
      }
      // MediaStream
      const run = async () => {
        try {
          // Loading on
          this.status(false, true);

          // new Human
          this.H_OBJ = new Human(this.human); // create instance of human with overrides from user configuration
          this.overrideEnv(this.H_OBJ);
          this.overrideDraw(this.H_OBJ);

          // grab instances of dom objects so we dont have to look them up later
          const dom = {
            video: this.video.nativeElement as HTMLVideoElement,
            canvas: this.canvas.nativeElement as HTMLCanvasElement
          };

          const timestamp = { detect: 0, draw: 0, tensors: 0, start: 0 }; // holds information used to calculate performance and possible memory leaks
          const fps = { detectFPS: 0, drawFPS: 0, frames: 0, averageMs: 0 }; // holds calculated fps information for both detect and screen refresh
          const webCam = async () => { // initialize webcam
            const stream: MediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            const ready = new Promise((resolve) => { dom.video.onloadeddata = () => resolve(true); });
            dom.video.srcObject = stream;
            void dom.video.play();
            await ready;
            dom.canvas.width = dom.video.videoWidth;
            dom.canvas.height = dom.video.videoHeight;
            dom.canvas.onclick = () => dom.video.paused ? this.play() : this.pause(); // pause when clicked on screen and resume on next click
          }

          this.detectionLoop = async () => { // main detection loop
            cancelAnimationFrame(this.rAF_ID);
            if (!dom.video.paused) {
              if (timestamp.start === 0) timestamp.start = this.H_OBJ.now();
              await this.H_OBJ.detect(dom.video); // actual detection; were not capturing output in a local variable as it can also be reached via human.result
              const tensors = this.H_OBJ.tf.memory().numTensors; // check current tensor usage for memory leaks
              timestamp.tensors = tensors;
              fps.detectFPS = Math.round(1000 * 1000 / (this.H_OBJ.now() - timestamp.detect)) / 1000;
              fps.frames++;
              fps.averageMs = Math.round(1000 * (this.H_OBJ.now() - timestamp.start) / fps.frames) / 1000;
              timestamp.detect = this.H_OBJ.now();
            }
            if (this.isStart) {
              this.rAF_ID = requestAnimationFrame(this.detectionLoop); // start new frame immediately
            }
          }

          const drawLoop = async () => { // main screen refresh loop
            if (!dom.video.paused) {
              this.interpolated = this.H_OBJ.next(this.H_OBJ.result); // smoothen result using last-known results
              // reset canvas
              const context = dom.canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
              context.clearRect(0, 0, dom.canvas.width, dom.canvas.height);
              await this.H_OBJ.draw.all(dom.canvas, this.interpolated); // draw labels, boxes, lines, etc.
              this.eventEmit(this.interpolated);
            }
            const now = this.H_OBJ.now();
            fps.drawFPS = Math.round(1000 * 1000 / (now - timestamp.draw)) / 1000;
            timestamp.draw = now;
            this.isStart && setTimeout(drawLoop, this.fps); // use to slow down refresh from max refresh rate to target of 30 fps
          }

          await this.H_OBJ.warmup(); // warmup function to initialize backend for future faster detection
          await webCam(); // start webcam
          this.status(true, false);
          await this.detectionLoop(); // start detection loop
          await drawLoop(); // start draw loop
          AS_COMPLETE(as, true);
        } catch (error: any) {
          this.status(false, false);
          this.eventEmit(null, error);
          AS_COMPLETE(as, false, error);
        }
      }
      run();
    } else {
      this.stop();
      AS_COMPLETE(as, false);
    }
    return as;
  }

  /**
   * stop
   * @return AsyncSubject
   */
  public stop(): AsyncSubject<any> {
    this.eventEmit(null)
    this.status(false, false);
    const as = new AsyncSubject<any>();
    try {
      cancelAnimationFrame(this.rAF_ID);
      (this.video?.nativeElement?.srcObject as any)?.getTracks()?.forEach((track: any) => {
        track?.stop();
        AS_COMPLETE(as, true);
      });
    } catch (error: any) {
      this.eventEmit(false, error);
      AS_COMPLETE(as, false, error);
    }
    return as;
  }

  /**
   * play
   * @return AsyncSubject
   */
  public play(): AsyncSubject<any> {
    const as = new AsyncSubject<any>();
    if (this.isPause) {
      this.video?.nativeElement?.play();
      this.detectionLoop();
      AS_COMPLETE(as, true);
    } else {
      AS_COMPLETE(as, false);
    }
    return as;
  }

  /**
   * pause
   * @return AsyncSubject 
   */
  public pause(): AsyncSubject<any> {
    const as = new AsyncSubject<any>();
    if (this.isStart) {
      cancelAnimationFrame(this.rAF_ID);
      this.video?.nativeElement?.pause();
      AS_COMPLETE(as, true);
    } else {
      AS_COMPLETE(as, false);
    }
    return as;
  }

  /**
   * loadImage
   * @param src 
   */
  public loadImage(src: string): AsyncSubject<any> {
    let as = new AsyncSubject<any>();

    // Set the src of this Image object.
    const image = new Image();

    // Setting cross origin value to anonymous
    image.setAttribute('crossOrigin', 'anonymous');

    // Set src
    image.src = src;

    // When our image has loaded.
    image.onload = async () => {
      // Loading on
      this.status(false, true);

      // new Human
      let human = new Human(this.human); // create instance of human with overrides from user configuration
      this.overrideEnv(human);
      this.overrideDraw(human);

      // draw
      const draw = async () => { // main screen refresh loop
        this.canvas.nativeElement.style.position = '';
        this.video.nativeElement.style.display = 'none';
        this.canvas.nativeElement.style.maxWidth = '100%';
        this.canvas.nativeElement.width = image.naturalWidth ?? image.width ?? document.body.clientWidth;
        this.canvas.nativeElement.height = image.naturalHeight ?? image.height ?? document.body.clientHeight;
        const interpolated = human.next(human.result); // smoothen result using last-known results
        if (human.config.filter.flip) {
          human.draw.canvas(interpolated.canvas as HTMLCanvasElement, this.canvas.nativeElement); // draw processed image to screen canvas
        } else {
          human.draw.canvas(image, this.canvas.nativeElement); // draw original video to screen canvas // better than using procesed image as this loop happens faster than processing loop
        }
        await human.draw.all(this.canvas.nativeElement, interpolated); // draw labels, boxes, lines, etc.
        this.eventEmit(interpolated);
      }

      // run
      await human.detect(image)
      await draw();
      const loop = setInterval(async () => await draw(), this.fps);  // use to slow down refresh from max refresh rate to target of 30 fps
      setTimeout(() => {
        clearInterval(loop);
        this.status(false, false);
        AS_COMPLETE(as, true);
      }, this.timeoutDetect);
    };

    // error
    image.onerror = (error: any) => AS_COMPLETE(as, false, error);

    return as;
  }

  /**
   * download
   * @param fileName 
   * @return AsyncSubject
   */
  public download(fileName: string): AsyncSubject<{ url: string, el: HTMLCanvasElement }> {
    const as = new AsyncSubject<{ url: string, el: HTMLCanvasElement }>()
    const canvas = document.createElement('canvas');
    canvas.width = this.video.nativeElement.videoWidth;
    canvas.height = this.video.nativeElement.videoHeight;
    // draw labels, boxes, lines, etc.
    const loop = setInterval(async () => {
      // Get a 2D drawing context for the canvas.
      const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
      // Draw image
      ctx.drawImage(this.video.nativeElement, 0, 0, canvas.width, canvas.height);
      await this.H_OBJ.draw.all(canvas, this.interpolated)
      const dataURL = canvas.toDataURL(`image/${fileName?.split('.')?.slice(-1)?.toString()}`);
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataURL;
      link.click();
      AS_COMPLETE(as, { url: fileName, el: this.canvas?.nativeElement });
      clearInterval(loop);
    }, this.fps);  // use to slow down refresh from max refresh rate to target of 30 fps
    loop;
    return as;
  }

  /**
   * getDevices
   */
  private getDevices(as: AsyncSubject<any>): void {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      let cameraDevices: Device[] = [];
      for (let i = 0; i < devices.length; i++) {
        let device = devices[i];
        if (device.kind == 'videoinput') {
          cameraDevices.push(device);
        }
      }
      this.devices.next(cameraDevices);
      if (cameraDevices.length > 0) {
        this.playDevice(cameraDevices[0].deviceId, as);
      } else {
        AS_COMPLETE(as, false, 'No camera detected.' as any);
      }
    });
  }

  /**
   * Override Config
   */
  private overrideConfig(): void {
    this.fps = this.config?.fps ?? this.fps ?? FPS;
    this.timeoutDetect = this.config?.timeoutDetect ?? this.timeoutDetect ?? TIMEOUT_DETECT;
    this.isAuto = this.config?.isAuto ?? this.isAuto ?? false;
    this.env = OVERRIDES(ENV, this.config?.env ?? this.env) as Partial<Env>;
    this.draw = OVERRIDES(DRAW_OPTIONS, this.config?.draw ?? this.draw) as Partial<DrawOptions>;
    this.human = OVERRIDES(CONFIG, this.config?.human ?? this.human) as Partial<Config>;
    this.medias = OVERRIDES(MEDIASTREAM, this.config?.medias ?? this.medias) as MediaStreamConstraints;
  }

  /**
   * Override Env
   * @return void
   */
  private overrideEnv(human: Partial<Human>): void {
    // Set env
    for (const key in this.env) {
      (human.env as any)[key] = (this.env as any)[key];
    }
  }

  /**
   * Override drawOptions
   * @return void
   */
  private overrideDraw(human: Partial<Human>): void {
    // Set drawOptions
    for (const key in this.draw) {
      (human.draw as any).options[key] = (this.draw as any)[key];
    }
  }

  /**
   * status
   * @param isStart 
   * @param isLoading 
   */
  private status(isStart: boolean, isLoading: boolean): void {
    this.isStart = isStart;
    this.isLoading = isLoading;
  }

  /**
   * eventEmit
   * @param response 
   * @param error 
   */
  private eventEmit(response: any = false, error: any = false): void {
    (response !== false) && this.data.next(response ?? null);
    (response !== false) && this.event.emit(response ?? null);
    (error !== false) && this.error.emit(error ?? null);
  }

  /**
   * Status of camera
   * @return boolean
   */
  get isPause(): boolean {
    return this.video?.nativeElement?.paused;
  }

  ngOnDestroy(): void {
    this.pause();
  }
}
