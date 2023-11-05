# ngx-scanner-face

This library is built to provide a solution analysis of human face recognition.\
This library analyzes each face and provides statistics for Angular web applications easily.\
This [Github](https://id1945.github.io/ngx-scanner-face/).

![Logo](https://raw.githubusercontent.com/id1945/ngx-scanner-face/master/ngx-scanner-face.png)

## Installation
Install `ngx-scanner-face` from `npm`:
```bash
npm install ngx-scanner-face@<version> --save
```

Add wanted package to NgModule imports:
```typescript
import { NgxScannerFaceModule } from 'ngx-scanner-face';
@NgModule({
  imports: [
    NgxScannerFaceModule
  ]
})
```

<details><summary><b>Camera :hammer_and_wrench:</b></summary>

```html
<ngx-scanner-face #scanner="scanner" [isAuto]="true"></ngx-scanner-face>

<span>{{scanner.data.value | json}}</span><!-- value -->
<span>{{scanner.data | async | json}}</span><!-- async -->
```
</details>

<details><summary><b>Image src :hammer_and_wrench:</b></summary>

```html
<ngx-scanner-face #scanner="scanner" [src]="'http://domain.com/picture.png'"></ngx-scanner-face>

<span>{{scanner.data.value | json}}</span><!-- value -->
<span>{{scanner.data | async | json}}</span><!-- async -->
```
</details>

<details><summary><b>Select files :hammer_and_wrench:</b></summary>

```typescript
import { NgxScannerFaceService, ScannerFaceConfig, ScannerFaceResult } from 'ngx-scanner-face';

public scannerConfig: ScannerFaceConfig = {};

public scannerResult: ScannerFaceResult[] = [];

constructor(private face: NgxScannerFaceService) {}

public onSelects(files: any) {
  this.face.loadFiles(files, this.scannerConfig).subscribe((res: ScannerFaceResult[]) => {
    this.scannerResult = res;
  });
}
```

```html
<input #file type="file" (change)="onSelects(file.files)" [multiple]="'multiple'" [accept]="'.jpg, .png'"/>

<div *ngFor="let row of scannerResult">
  <img [src]="row.url" [alt]="row.name"><!-- Need bypassSecurityTrustUrl -->
</div>
```
</details>


### API Documentation

<details><summary><b>Input :old_key:</b></summary>

| Field         | Description                 | Type                                            | Default                                                                                                         |
| ---           | ---                         | ---                                             | ---                                                                                                             |
| [src]         | image url                   | string                                          | -                                                                                                               |
| [isAuto]      | auto camera                 | boolean                                         | false                                                                                                           |
| [fps]         | frames/ms                   | number                                          | 30                                                                                                              |
| [timeoutDetect]| detect faces/ms            | number                                          | 1000                                                                                                            |
| [style]       | style for canvas and video  | Object                                          | null                                                                                                            |
| [videoStyle]  | style for video             | Object                                          | null                                                                                                            |
| [canvasStyle] | style for canvas            | Object                                          | null                                                                                                            |
| [constraints] | setting video               | MediaStreamConstraints                          | ``` { audio: false, video: true }```                                                                            |
| [env]         | env config                  | <Env>                                           | ``` { perfadd: false } ```                                                                                      |
| [draw]        | draw config                 | <DrawOptions>                                   | ``` { font: 'monospace', lineHeight: 20 }```                                                                    |
| [human]       | user configuration for human, used to fine-tune behavior  | <Config>          | ``` {...} ```                                                                                                   |
| [config]      | Config all                  | BaseConfig                                      | ``` { src:..., isAuto:..., isLoading:..., fps:..., env:..., draw:..., human:..., style:..., constraints:... } ```    |

</details>

<details><summary><b>Output :old_key:</b></summary>

| Field     | Description     | Type        | Default     |
| ---       | ---             | ---         | ---         |
| (event)   | Data            | Result      | -           |

</details>

<details><summary><b>Global variable in component :old_key:</b></summary>

| Field             | Description               | Type                      | Default     |
| ---               | ---                       | ---                       | ---         |   
| isStart           | start status              | boolean                   | false       |
| isPause           | pause status              | boolean                   | false       |
| isLoading         | loading status            | boolean                   | false       |
| isTorch           | flashlight status         | boolean                   | false       |
| data              | data                      | BehaviorSubject<Result>   | {}          |
| devices           | devices                   | BehaviorSubject<Device[]> | []          |
| deviceIndexActive | device index              | number                    | 0           |

</details>

<details><summary><b>Global event in component :old_key:</b></summary>

| Field       | Description               | Type                      | Default     |
| ---         | ---                       | ---                       | ---         |   
| (start)     | start camera              | AsyncSubject              | -           |
| (stop)      | stop camera               | AsyncSubject              | -           |
| (play)      | play video                | AsyncSubject              | -           |
| (pause)     | pause video               | AsyncSubject              | -           |
| (torcher)   | toggle on/off flashlight  | AsyncSubject              | -           |
| (loadImage) | load image from src       | AsyncSubject              | -           |
| (download)  | download image form video | AsyncSubject              | -           |

</details>

<details><summary><b>Global event in service :old_key:</b></summary>

| Field             | Description                   | Type                            | Default     |
| ---               | ---                           | ---                             | ---         |   
| (toBase64)        | used for file selection       | AsyncSubject<ScannerFaceResult> | -           |
| (loadFiles)       | used for file selection       | AsyncSubject<ScannerFaceResult> | -           |
| (streamToBase64)  | used for with camera scanner  | AsyncSubject<Result>            | -           |
| (streamToBlobURL) | used for with camera scanner  | AsyncSubject<Result>            | -           |

</details>

#### Models :magnet:
  
<details><summary><b>ScannerFaceConfig</b></summary>

```typescript
interface ScannerFaceConfig {
  src?: string;
  isAuto?: boolean;
  isLoading?: boolean;
  fps?: number;
  timeoutDetect?: number;
  env?: Partial<Env>;
  draw?: Partial<DrawOptions>;
  human?: Partial<Config>;
  constraints?: MediaStreamConstraints;
}
```
</details>

<details><summary><b>ScannerFaceResult</b></summary>

```typescript
interface ScannerFaceResult {
  file?: File;
  name?: string;
  url?: string;
  blob?: any;
  base64?: string;
  result?: Result;
}
```
</details>

<details><summary><b>Device</b></summary>

```typescript
interface Device {
  deviceId: string;
  kind: string;
  label: string;
  groupId: string;
}
```
</details>

<details><summary><b>Env</b></summary>

```typescript
class Env {
  /** Running in Browser */
  browser: boolean;
  /** Running in NodeJS */
  node: boolean;
  /** Running in WebWorker thread */
  worker: boolean;
  /** Detected platform */
  platform: string;
  /** Detected agent */
  agent: string;
  /** List of supported backends */
  backends: string[];
  /** Has any work been performed so far */
  initial: boolean;
  /** Are image filters supported? */
  filter: boolean | undefined;
  /** TFJS instance details */
  tfjs: {
      version: undefined | string;
  };
  /** Is offscreenCanvas supported? */
  offscreen: undefined | boolean;
  /** Are performance counter instant values or additive */
  perfadd: boolean;
  /** If using tfjs-node get version of underlying tensorflow shared library and if gpu acceleration is enabled */
  tensorflow: {
      version: undefined | string;
      gpu: undefined | boolean;
  };
  /** WASM detected capabilities */
  wasm: {
      supported: undefined | boolean;
      backend: undefined | boolean;
      simd: undefined | boolean;
      multithread: undefined | boolean;
  };
  /** WebGL detected capabilities */
  webgl: {
      supported: undefined | boolean;
      backend: undefined | boolean;
      version: undefined | string;
      renderer: undefined | string;
  };
  /** WebGPU detected capabilities */
  webgpu: {
      supported: undefined | boolean;
      backend: undefined | boolean;
      adapter: undefined | string;
  };
  /** CPU info */
  cpu: {
      model: undefined | string;
      flags: string[];
  };
  /** List of supported kernels for current backend */
  kernels: string[];
  /** MonkeyPatch for Canvas */
  Canvas: undefined;
  /** MonkeyPatch for Image */
  Image: undefined;
  /** MonkeyPatch for ImageData */
  ImageData: undefined;
  constructor();
  /** update backend information */
  updateBackend(): Promise<void>;
  /** update cpu information */
  updateCPU(): void;
}
```
</details>

<details><summary><b>Config</b></summary>

```typescript
interface Config {
  /** Backend used for TFJS operations
   * valid build-in backends are:
   * - Browser: `cpu`, `wasm`, `webgl`, `humangl`, `webgpu`
   * - NodeJS: `cpu`, `wasm`, `tensorflow`
   * default: `webgl` for browser and `tensorflow` for nodejs
   */
  backend: '' | 'cpu' | 'wasm' | 'webgl' | 'humangl' | 'tensorflow' | 'webgpu';
  /** Path to *.wasm files if backend is set to `wasm`
   *
   * default: auto-detects to link to CDN `jsdelivr` when running in browser
   */
  wasmPath: string;
  /** Force WASM loader to use platform fetch
   *
   * default: auto-detects to link to CDN `jsdelivr` when running in browser
   */
  wasmPlatformFetch: boolean;
  /** Print debug statements to console
   *
   * default: `true`
   */
  debug: boolean;
  /** Perform model loading and inference concurrently or sequentially
   *
   * default: `true`
   */
  async: boolean;
  /** What to use for `human.warmup()`
   * - warmup pre-initializes all models for faster inference but can take significant time on startup
   * - used by `webgl`, `humangl` and `webgpu` backends
   *
   * default: `full`
   */
  warmup: '' | 'none' | 'face' | 'full' | 'body';
  /** Base model path (typically starting with file://, http:// or https://) for all models
   * - individual modelPath values are relative to this path
   *
   * default: `../models/` for browsers and `file://models/` for nodejs
   */
  modelBasePath: string;
  /** Cache models in IndexDB on first sucessfull load
   * default: true if indexdb is available (browsers), false if its not (nodejs)
   */
  cacheModels: boolean;
  /** Validate kernel ops used in model during model load
   * default: true
   * any errors will be printed on console but will be treated as non-fatal
   */
  validateModels: boolean;
  /** Cache sensitivity
   * - values 0..1 where 0.01 means reset cache if input changed more than 1%
   * - set to 0 to disable caching
   *
   * default: 0.7
   */
  cacheSensitivity: number;
  /** Explicit flags passed to initialize TFJS */
  flags: Record<string, unknown>;
  /** Software Kernels
   * Registers software kernel ops running on CPU when accelerated version of kernel is not found in the current backend
   */
  softwareKernels: boolean;
  /** Perform immediate garbage collection on deallocated tensors instead of caching them */
  deallocate: boolean;
  /** Internal Variable */
  skipAllowed: boolean;
  /** Filter config {@link FilterConfig} */
  filter: Partial<FilterConfig>;
  /** Gesture config {@link GestureConfig} */
  gesture: Partial<GestureConfig>;
  /** Face config {@link FaceConfig} */
  face: Partial<FaceConfig>;
  /** Body config {@link BodyConfig} */
  body: Partial<BodyConfig>;
  /** Hand config {@link HandConfig} */
  hand: Partial<HandConfig>;
  /** Object config {@link ObjectConfig} */
  object: Partial<ObjectConfig>;
  /** Segmentation config {@link SegmentationConfig} */
  segmentation: Partial<SegmentationConfig>;
}
```

</details>

<details><summary><b>DrawOptions</b></summary>

```typescript
interface DrawOptions {
  /** draw line color */
  color: string;
  /** alpha value used for lines */
  alpha: number;
  /** label color */
  labelColor: string;
  /** label shadow color */
  shadowColor: string;
  /** label font */
  font: string;
  /** line spacing between labels */
  lineHeight: number;
  /** line width for drawn lines */
  lineWidth: number;
  /** size of drawn points */
  pointSize: number;
  /** draw rounded boxes by n pixels */
  roundRect: number;
  /** should points be drawn? */
  drawPoints: boolean;
  /** should labels be drawn? */
  drawLabels: boolean;
  /** should face attention keypoints be highlighted */
  drawAttention: boolean;
  /** should detected gestures be drawn? */
  drawGestures: boolean;
  /** should draw boxes around detection results? */
  drawBoxes: boolean;
  /** should draw polygons from detection points? */
  drawPolygons: boolean;
  /** should draw gaze arrows? */
  drawGaze: boolean;
  /** should fill polygons? */
  fillPolygons: boolean;
  /** use z-coordinate when available */
  useDepth: boolean;
  /** should lines be curved? */
  useCurves: boolean;
}
```

</details>
  
<details><summary><b>Result</b></summary>

```typescript
interface Result {
  /** {@link FaceResult}: detection & analysis results */
  face: FaceResult[];
  /** {@link BodyResult}: detection & analysis results */
  body: BodyResult[];
  /** {@link HandResult}: detection & analysis results */
  hand: HandResult[];
  /** {@link GestureResult}: detection & analysis results */
  gesture: GestureResult[];
  /** {@link ObjectResult}: detection & analysis results */
  object: ObjectResult[];
  /** global performance object with timing values for each operation */
  performance: Record<string, number>;
  /** optional processed canvas that can be used to draw input on screen */
  canvas?: AnyCanvas | null;
  /** timestamp of detection representing the milliseconds elapsed since the UNIX epoch */
  readonly timestamp: number;
  /** getter property that returns unified persons object  */
  persons: PersonResult[];
  /** Last known error message */
  error: string | null;
  /** ===================== */
  /**  start version 1.1.6  */
  /** ===================== */
  /** Draw frames for detected faces */
  /** In this case the scanner will not drawn frame on the original image */
  /** Need to use service to handle streamToBase64 and streamToBlobURL */
  /** This solves the problem related to perfomance */
  canvas2: HTMLCanvasElement;
  /** using for service with streamToBase64() */
  base64: string;
  /** using for service with streamToBlobURL() */
  blobUrl?: string;
}
```

</details>

#### Models in Config :magnet:

<details><summary><b>FilterConfig</b></summary>

```typescript
interface FilterConfig {
  /** are image filters enabled? */
  enabled: boolean;
  /** perform image histogram equalization
   * - equalization is performed on input as a whole and detected face before its passed for further analysis
   */
  equalization: boolean;
  /** resize input width
   * - if both width and height are set to 0, there is no resizing
   * - if just one is set, second one is scaled automatically
   * - if both are set, values are used as-is
   */
  width: number;
  /** resize input height
   * - if both width and height are set to 0, there is no resizing
   * - if just one is set, second one is scaled automatically
   * - if both are set, values are used as-is
   */
  height: number;
  /** return processed canvas imagedata in result */
  return: boolean;
  /** flip input as mirror image */
  flip: boolean;
  /** range: -1 (darken) to 1 (lighten) */
  brightness: number;
  /** range: -1 (reduce contrast) to 1 (increase contrast) */
  contrast: number;
  /** range: 0 (no sharpening) to 1 (maximum sharpening) */
  sharpness: number;
  /** range: 0 (no blur) to N (blur radius in pixels) */
  blur: number;
  /** range: -1 (reduce saturation) to 1 (increase saturation) */
  saturation: number;
  /** range: 0 (no change) to 360 (hue rotation in degrees) */
  hue: number;
  /** image negative */
  negative: boolean;
  /** image sepia colors */
  sepia: boolean;
  /** image vintage colors */
  vintage: boolean;
  /** image kodachrome colors */
  kodachrome: boolean;
  /** image technicolor colors */
  technicolor: boolean;
  /** image polaroid camera effect */
  polaroid: boolean;
  /** range: 0 (no pixelate) to N (number of pixels to pixelate) */
  pixelate: number;
}
```
</details>
  
<details><summary><b>GestureConfig</b></summary>

```typescript
interface GestureConfig {
  /** is gesture detection enabled? */
  enabled: boolean;
}
```
</details>
  
<details><summary><b>FaceConfig</b></summary>

```typescript
interface FaceConfig extends GestureConfig {
  detector: Partial<FaceDetectorConfig>;
  mesh: Partial<FaceMeshConfig>;
  attention: Partial<FaceAttentionConfig>;
  iris: Partial<FaceIrisConfig>;
  description: Partial<FaceDescriptionConfig>;
  emotion: Partial<FaceEmotionConfig>;
  antispoof: Partial<FaceAntiSpoofConfig>;
  liveness: Partial<FaceLivenessConfig>;
  gear: Partial<FaceGearConfig>;
}
```
</details>
  
<details><summary><b>BodyConfig</b></summary>

```typescript
interface BodyConfig extends GenericConfig {
  /** maximum number of detected bodies */
  maxDetected: number;
  /** minimum confidence for a detected body before results are discarded */
  minConfidence: number;
}
```
</details>
  
<details><summary><b>HandConfig</b></summary>

```typescript
interface HandConfig extends GenericConfig {
  /** should hand rotation correction be performed after hand detection? */
  rotation: boolean;
  /** minimum confidence for a detected hand before results are discarded */
  minConfidence: number;
  /** minimum overlap between two detected hands before one is discarded */
  iouThreshold: number;
  /** maximum number of detected hands */
  maxDetected: number;
  /** should hand landmarks be detected or just return detected hand box */
  landmarks: boolean;
  detector: {
      /** path to hand detector model json */
      modelPath?: string;
  };
  skeleton: {
      /** path to hand skeleton model json */
      modelPath?: string;
  };
}
```
</details>
  
    
<details><summary><b>ObjectConfig</b></summary>

```typescript
interface ObjectConfig extends GenericConfig {
  /** minimum confidence for a detected objects before results are discarded */
  minConfidence: number;
  /** minimum overlap between two detected objects before one is discarded */
  iouThreshold: number;
  /** maximum number of detected objects */
  maxDetected: number;
}
```
</details>
    
<details><summary><b>SegmentationConfig</b></summary>

```typescript
interface SegmentationConfig extends GenericConfig {
  /** blur segmentation output by <number> pixels for more realistic image */
  blur: number;
}
```
</details>

#### Models in Result :magnet:

<details><summary><b>FaceResult</b></summary>

```typescript
interface FaceResult {
  /** face id */
  id: number;
  /** overall face score */
  score: number;
  /** detection score */
  boxScore: number;
  /** mesh score */
  faceScore: number;
  /** detected face box */
  box: Box;
  /** detected face box normalized to 0..1 */
  boxRaw: Box;
  /** detected face mesh */
  mesh: Point[];
  /** detected face mesh normalized to 0..1 */
  meshRaw: Point[];
  /** face contours as array of 2d points normalized to 0..1 */
  /** face contours as array of 2d points */
  /** mesh keypoints combined into annotated results */
  annotations: Record<FaceLandmark, Point[]>;
  /** detected age */
  age?: number;
  /** detected gender */
  gender?: Gender;
  /** gender detection score */
  genderScore?: number;
  /** detected emotions */
  emotion?: {
      score: number;
      emotion: Emotion;
  }[];
  /** detected race */
  race?: {
      score: number;
      race: Race;
  }[];
  /** face descriptor */
  embedding?: number[];
  /** face iris distance from camera */
  iris?: number;
  /** face anti-spoofing result confidence */
  real?: number;
  /** face liveness result confidence */
  live?: number;
  /** face rotation details */
  rotation?: {
      angle: {
          roll: number;
          yaw: number;
          pitch: number;
      };
      matrix: [number, number, number, number, number, number, number, number, number];
      gaze: {
          bearing: number;
          strength: number;
      };
  } | null;
  /** detected face as tensor that can be used in further pipelines */
  tensor?: Tensor;
}
```
</details>

<details><summary><b>BodyResult</b></summary>

```typescript
interface BodyResult {
  /** body id */
  id: number;
  /** body detection score */
  score: number;
  /** detected body box */
  box: Box;
  /** detected body box normalized to 0..1 */
  boxRaw: Box;
  /** detected body keypoints */
  keypoints: BodyKeypoint[];
  /** detected body keypoints combined into annotated parts */
  annotations: Record<BodyAnnotation, Point[][]>;
}
```
</details>


<details><summary><b>HandResult</b></summary>

```typescript
interface HandResult {
  /** hand id */
  id: number;
  /** hand overal score */
  score: number;
  /** hand detection score */
  boxScore: number;
  /** hand skelton score */
  fingerScore: number;
  /** detected hand box */
  box: Box;
  /** detected hand box normalized to 0..1 */
  boxRaw: Box;
  /** detected hand keypoints */
  keypoints: Point[];
  /** detected hand class */
  label: HandType;
  /** detected hand keypoints combined into annotated parts */
  annotations: Record<Finger, Point[]>;
  /** detected hand parts annotated with part gestures */
  landmarks: Record<Finger, {
      curl: FingerCurl;
      direction: FingerDirection;
  }>;
}
```
</details>


<details><summary><b>GestureResult</b></summary>

```typescript
type GestureResult = {
  'face': number;
  gesture: FaceGesture;
} | {
  'iris': number;
  gesture: IrisGesture;
} | {
  'body': number;
  gesture: BodyGesture;
} | {
  'hand': number;
  gesture: HandGesture;
};
```
</details>


<details><summary><b>ObjectResult</b></summary>

```typescript
interface ObjectResult {
  /** object id */
  id: number;
  /** object detection score */
  score: number;
  /** detected object class id */
  class: number;
  /** detected object class name */
  label: ObjectType;
  /** detected object box */
  box: Box;
  /** detected object box normalized to 0..1 */
  boxRaw: Box;
}

```
</details>


<details><summary><b>PersonResult</b></summary>

```typescript
interface PersonResult {
  /** person id */
  id: number;
  /** face result that belongs to this person */
  face: FaceResult;
  /** body result that belongs to this person */
  body: BodyResult | null;
  /** left and right hand results that belong to this person */
  hands: {
      left: HandResult | null;
      right: HandResult | null;
  };
  /** detected gestures specific to this person */
  gestures: GestureResult[];
  /** box that defines the person */
  box: Box;
  /** box that defines the person normalized to 0..1 */
  boxRaw?: Box;
}
```
</details>

#### Models in FaceConfig :magnet:

<details><summary><b>FaceDetectorConfig</b></summary>

```typescript
interface FaceDetectorConfig extends GenericConfig {
  /** is face rotation correction performed after detecting face?
   * used to correctly analyze faces under high angles
   */
  rotation: boolean;
  /** maximum number of detected faces */
  maxDetected: number;
  /** minimum confidence for a detected face before results are discarded */
  minConfidence: number;
  /** minimum overlap between two detected faces before one is discarded */
  iouThreshold: number;
  /** should child models perform on masked image of a face */
  mask: boolean;
  /** should face detection return processed and cropped face tensor that can with an external model for addtional processing?
   * if enabled it must be manually deallocated to avoid memory leak */
  return: boolean;
}
```
</details>

<details><summary><b>FaceMeshConfig</b></summary>

```typescript
interface FaceMeshConfig extends GenericConfig {
    /** Keep detected faces that cannot be verified using facemesh */
    keepInvalid: boolean;
}
```
</details>

<details><summary><b>FaceDescriptionConfig</b></summary>

```typescript
interface FaceDescriptionConfig extends GenericConfig {
    /** minimum confidence for a detected face before results are discarded */
    minConfidence: number;
}
```
</details>

<details><summary><b>FaceEmotionConfig</b></summary>

```typescript
interface FaceEmotionConfig extends GenericConfig {
    /** minimum confidence for a detected face before results are discarded */
    minConfidence: number;
}
```
</details>

<details><summary><b>FaceGearConfig</b></summary>

```typescript
interface FaceGearConfig extends GenericConfig {
    /** minimum confidence for a detected race before results are discarded */
    minConfidence: number;
}
```
</details>
  
#### Support versions 
  
<table>
  <tr>
    <th colspan="2">Support versions</th>
  </tr>
  <tr>
    <td>Angular 16</td>
    <td>1.2.3</td>
  </tr>
  <tr>
    <td>Angular 12</td>
    <td>1.2.2</td>
  </tr>
</table>

#### Author Information

<table>
  <tr>
    <th colspan="2">Author Information</th>
  </tr>
  <tr>
    <td>Author</td>
    <td>DaiDH</td>
  </tr>
  <tr>
    <td>Phone</td>
    <td>+84845882882</td>
  </tr>
  <tr>
    <td>Country</td>
    <td>Vietnam</td>
  </tr>
</table>

#### To make this library more complete, please donate to me if you can!

<table>
  <tr>
    <th>Bitcoin</th>
    <th>Paypal</th>
    <th>MbBank</th>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/id1945/id1945/master/donate-bitcoin.png" width="182px"></td>
    <td><img src="https://raw.githubusercontent.com/id1945/id1945/master/donate-paypal.png" width="182px"></td>
    <td><img src="https://raw.githubusercontent.com/id1945/id1945/master/donate-mbbank.png" width="182px"></td>
  </tr>
</table>

![Vietnam](https://raw.githubusercontent.com/id1945/id1945/master/vietnam.gif)

[MIT License](https://github.com/id1945/ngx-scanner-face/blob/master/LICENSE). Copyright (c) 2021 DaiDH