import { Injectable } from '@angular/core';
import { AsyncSubject } from 'rxjs';
import { Human } from 'ngx-scanner-face-human';
import {
  ScannerFaceConfig,
  ScannerFaceResult,
} from './ngx-scanner-face.options';
import {
  FPS,
  ENV,
  CONFIG,
  DRAW_OPTIONS,
  MEDIASTREAM,
  TIMEOUT_DETECT,
} from './ngx-scanner-face.default';
import { AS_COMPLETE } from './ngx-scanner-face.helper';

@Injectable({
  providedIn: 'root',
})
export class NgxScannerFaceService {

  /**
   * Files to base64: ScannerFaceResult[]
   * @param files
   * @param ScannerFaceResult
   * @returns ScannerFaceResult
   */
  public toBase64(files: File[]): AsyncSubject<ScannerFaceResult[]> {
    const result = new AsyncSubject<ScannerFaceResult[]>();
    const data: ScannerFaceResult[] = [];
    if (files?.length) {
      Object.keys(files)?.forEach((file, i) => {
        const url = URL.createObjectURL(files[i]);
        const reader = new FileReader();
        reader.readAsDataURL(files[i]);
        reader.onload = (e) => {
          data.push({
            name: files[i]?.name,
            file: files[i],
            base64: reader?.result as string,
            url: url,
          });
          if (files?.length === i + 1) {
            result.next(data);
            result.complete();
          }
        };
      });
      return result;
    } else {
      result.next([]);
      result.complete();
      return result;
    }
  }

  /**
   * Load files
   * @param files
   * @param config
   * @return AsyncSubject
   */
  public loadFiles(
    files: File[] = [],
    baseConfig: ScannerFaceConfig
  ): AsyncSubject<ScannerFaceResult[]> {
    this.overrideConfig(baseConfig);
    const as = new AsyncSubject<ScannerFaceResult[]>();
    Promise.all([...files].map((m) => this.readAsDataURL(m, baseConfig))).then((img: ScannerFaceResult[]) => AS_COMPLETE(as, img)).catch((error: any) => AS_COMPLETE(as, null, error));
    return as;
  }

  /**
   * readAsDataURL
   * @param file
   * @param config
   * @return Promise
   */
  private readAsDataURL(
    file: File,
    baseConfig: ScannerFaceConfig
  ): Promise<ScannerFaceResult> {
    /** drawImage **/
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.onload = () => {
        // Set the src of this Image object.
        const image = new Image();
        // Setting cross origin value to anonymous
        image.setAttribute('crossOrigin', 'anonymous');
        // When our image has loaded.
        image.onload = async () => {
          // Get the canvas element by using the getElementById method.
          const canvas = document.createElement('canvas');
          // HTMLImageElement size
          canvas.width =
            image.naturalWidth ?? image.width ?? document.body.clientWidth;
          canvas.height =
            image.naturalHeight ?? image.height ?? document.body.clientHeight;
          // Get a 2D drawing context for the canvas.
          const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
          // Draw image
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          // Draw frame
          // new Human
          let human = new Human(baseConfig.human); // create instance of human with overrides from user configuration
          // draw
          const draw = async () => {
            // main screen refresh loop
            let interpolated = human.next(human.result); // smoothen result using last-known results
            if (human.config.filter.flip) {
              human.draw.canvas(
                interpolated.canvas as HTMLCanvasElement,
                canvas
              ); // draw processed image to screen canvas
            } else {
              human.draw.canvas(image, canvas); // draw original video to screen canvas // better than using procesed image as this loop happens faster than processing loop
            }
            await human.draw.all(canvas, interpolated); // draw labels, boxes, lines, etc.
            return interpolated;
          };

          // run
          await human.detect(image);
          let result = await draw();
          const loop = setInterval(async () => {
            result = await draw();
          }, baseConfig.fps); // use to slow down refresh from max refresh rate to target of 30 fps
          setTimeout(() => {
            clearInterval(loop);
            canvas.toBlob((blob: any) => {
              resolve({
                ...result,
                name: file?.name,
                file: file,
                url: URL.createObjectURL(blob),
                blob: blob,
              });
            });
          }, baseConfig.timeoutDetect);
        };
        // Set src
        image.src = URL.createObjectURL(file);
      };
      fileReader.onerror = (error: any) => reject(error);
      fileReader.readAsDataURL(file);
    });
  }

  /**
   * Override Config
   */
  private overrideConfig(baseConfig: ScannerFaceConfig): void {
    const isNull = (field: string) => (baseConfig as any)?.[field] == null || (baseConfig as any)?.[field] == undefined;
    if (isNull('fps')) baseConfig.fps = FPS;
    if (isNull('timeoutDetect')) baseConfig.timeoutDetect = TIMEOUT_DETECT;
    if (isNull('isAuto')) baseConfig.isAuto = false;
    if (isNull('env')) baseConfig.env = ENV;
    if (isNull('draw')) baseConfig.draw = DRAW_OPTIONS;
    if (isNull('human')) baseConfig.human = CONFIG;
    if (isNull('medias')) baseConfig.medias = MEDIASTREAM;
  }
}
