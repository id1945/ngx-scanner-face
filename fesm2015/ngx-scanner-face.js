import { __awaiter } from 'tslib';
import * as i0 from '@angular/core';
import { Injectable, EventEmitter, Component, ViewChild, NgModule } from '@angular/core';
import { AsyncSubject, BehaviorSubject } from 'rxjs';
import { Human as Human$1, Env as Env$1 } from 'ngx-scanner-face-human';

/**
 * Frame speed ms/fps.
 */
const FPS = 30;
/**
 * setTimeout 1000ms.
 */
const TIMEOUT_DETECT = 1000;
/**
 * user configuration for human, used to fine-tune behavior
 */
const CONFIG = {
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
const ENV = {
    perfadd: false, // is performance data showing instant or total values
};
/**
 * Draw Options
 */
const DRAW_OPTIONS = {
    font: 'monospace',
    lineHeight: 20,
};
/**
 * MediaStream
s * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
 */
const MEDIASTREAM = {
    audio: false,
    video: true
};

/**
 * Override Config
 */
const OVERRIDES = (defaultConfig, switchConfig) => {
    var _a;
    if (switchConfig && ((_a = Object.keys(switchConfig)) === null || _a === void 0 ? void 0 : _a.length)) {
        for (const key in defaultConfig) {
            switchConfig = (switchConfig === null || switchConfig === void 0 ? void 0 : switchConfig.hasOwnProperty(key))
                ? switchConfig
                : JSON.parse(JSON.stringify(Object.assign(Object.assign({}, switchConfig), { [key]: defaultConfig[key] })));
        }
        return switchConfig;
    }
    else {
        return defaultConfig;
    }
};
/**
 * Rxjs complete
 * @param as
 * @param data
 * @param error
 */
const AS_COMPLETE = (as, data, error = null) => {
    error ? as.error(error) : as.next(data);
    as.complete();
};

class NgxScannerFaceService {
    /**
     * Files to base64: ScannerFaceResult[]
     * @param files
     * @param ScannerFaceResult
     * @returns ScannerFaceResult
     */
    toBase64(files) {
        var _a;
        const result = new AsyncSubject();
        const data = [];
        if (files === null || files === void 0 ? void 0 : files.length) {
            (_a = Object.keys(files)) === null || _a === void 0 ? void 0 : _a.forEach((file, i) => {
                const url = URL.createObjectURL(files[i]);
                const reader = new FileReader();
                reader.readAsDataURL(files[i]);
                reader.onload = (e) => {
                    var _a;
                    data.push({
                        name: (_a = files[i]) === null || _a === void 0 ? void 0 : _a.name,
                        file: files[i],
                        base64: reader === null || reader === void 0 ? void 0 : reader.result,
                        url: url,
                    });
                    if ((files === null || files === void 0 ? void 0 : files.length) === i + 1) {
                        result.next(data);
                        result.complete();
                    }
                };
            });
            return result;
        }
        else {
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
    loadFiles(files = [], baseConfig) {
        this.overrideConfig(baseConfig);
        const as = new AsyncSubject();
        Promise.all([...files].map((m) => this.readAsDataURL(m, baseConfig))).then((img) => AS_COMPLETE(as, img)).catch((error) => AS_COMPLETE(as, null, error));
        return as;
    }
    /**
     * readAsDataURL
     * @param file
     * @param config
     * @return Promise
     */
    readAsDataURL(file, baseConfig) {
        /** drawImage **/
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            fileReader.onload = () => {
                // Set the src of this Image object.
                const image = new Image();
                // Setting cross origin value to anonymous
                image.setAttribute('crossOrigin', 'anonymous');
                // When our image has loaded.
                image.onload = () => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c, _d;
                    // Get the canvas element by using the getElementById method.
                    const canvas = document.createElement('canvas');
                    // HTMLImageElement size
                    canvas.width =
                        (_b = (_a = image.naturalWidth) !== null && _a !== void 0 ? _a : image.width) !== null && _b !== void 0 ? _b : document.body.clientWidth;
                    canvas.height =
                        (_d = (_c = image.naturalHeight) !== null && _c !== void 0 ? _c : image.height) !== null && _d !== void 0 ? _d : document.body.clientHeight;
                    // Get a 2D drawing context for the canvas.
                    const ctx = canvas.getContext('2d');
                    // Draw image
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                    // Draw frame
                    // new Human
                    let human = new Human$1(baseConfig.human); // create instance of human with overrides from user configuration
                    // draw
                    const draw = () => __awaiter(this, void 0, void 0, function* () {
                        // main screen refresh loop
                        let interpolated = human.next(human.result); // smoothen result using last-known results
                        if (human.config.filter.flip) {
                            human.draw.canvas(interpolated.canvas, canvas); // draw processed image to screen canvas
                        }
                        else {
                            human.draw.canvas(image, canvas); // draw original video to screen canvas // better than using procesed image as this loop happens faster than processing loop
                        }
                        yield human.draw.all(canvas, interpolated); // draw labels, boxes, lines, etc.
                        return interpolated;
                    });
                    // run
                    yield human.detect(image);
                    let result = yield draw();
                    const loop = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                        result = yield draw();
                    }), baseConfig.fps); // use to slow down refresh from max refresh rate to target of 30 fps
                    setTimeout(() => {
                        clearInterval(loop);
                        canvas.toBlob((blob) => {
                            resolve(Object.assign(Object.assign({}, result), { name: file === null || file === void 0 ? void 0 : file.name, file: file, url: URL.createObjectURL(blob), blob: blob }));
                        });
                    }, baseConfig.timeoutDetect);
                });
                // Set src
                image.src = URL.createObjectURL(file);
            };
            fileReader.onerror = (error) => reject(error);
            fileReader.readAsDataURL(file);
        });
    }
    /**
     * Override Config
     */
    overrideConfig(baseConfig) {
        const isNull = (field) => { var _a, _b; return ((_a = baseConfig) === null || _a === void 0 ? void 0 : _a[field]) == null || ((_b = baseConfig) === null || _b === void 0 ? void 0 : _b[field]) == undefined; };
        if (isNull('fps'))
            baseConfig.fps = FPS;
        if (isNull('timeoutDetect'))
            baseConfig.timeoutDetect = TIMEOUT_DETECT;
        if (isNull('isAuto'))
            baseConfig.isAuto = false;
        if (isNull('env'))
            baseConfig.env = ENV;
        if (isNull('draw'))
            baseConfig.draw = DRAW_OPTIONS;
        if (isNull('human'))
            baseConfig.human = CONFIG;
        if (isNull('medias'))
            baseConfig.medias = MEDIASTREAM;
    }
}
NgxScannerFaceService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: NgxScannerFaceService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgxScannerFaceService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: NgxScannerFaceService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: NgxScannerFaceService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

class NgxScannerFaceComponent {
    constructor() {
        /**
         * EventEmitter
         */
        this.event = new EventEmitter();
        this.error = new EventEmitter();
        /**
         * Input
         */
        this.src = '';
        this.isAuto = false; // Auto start camera.
        this.fps = FPS; // Frame speed ms/fps.
        this.timeoutDetect = TIMEOUT_DETECT; // setTimeout 1000ms.
        this.medias = {};
        this.env = {};
        this.draw = {};
        this.human = {};
        this.config = {};
        this.style = null;
        this.videoStyle = null;
        this.canvasStyle = null;
        /**
         * Export
         */
        this.isStart = false;
        this.isLoading = false;
        this.data = new BehaviorSubject({});
        this.devices = new BehaviorSubject([]);
    }
    ngOnInit() {
        this.overrideConfig();
        if (this.src) {
            this.loadImage(this.src);
        }
        else if (this.isAuto) {
            this.start();
        }
    }
    /**
     * start
     * @return AsyncSubject
     */
    start() {
        const as = new AsyncSubject();
        if (this.isStart) {
            // Reject
            AS_COMPLETE(as, false);
        }
        else {
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
    playDevice(deviceId, as = new AsyncSubject()) {
        stop();
        if (deviceId && deviceId != 'null') {
            const constraints = {
                audio: false,
                video: typeof (this.medias && this.medias.video) === 'boolean' ? { deviceId: deviceId } : Object.assign({ deviceId: deviceId }, this.medias && this.medias.video)
            };
            // MediaStream
            const run = () => __awaiter(this, void 0, void 0, function* () {
                try {
                    // Loading on
                    this.status(false, true);
                    // new Human
                    this.H_OBJ = new Human$1(this.human); // create instance of human with overrides from user configuration
                    this.overrideEnv(this.H_OBJ);
                    this.overrideDraw(this.H_OBJ);
                    // grab instances of dom objects so we dont have to look them up later
                    const dom = {
                        video: this.video.nativeElement,
                        canvas: this.canvas.nativeElement
                    };
                    const timestamp = { detect: 0, draw: 0, tensors: 0, start: 0 }; // holds information used to calculate performance and possible memory leaks
                    const fps = { detectFPS: 0, drawFPS: 0, frames: 0, averageMs: 0 }; // holds calculated fps information for both detect and screen refresh
                    const webCam = () => __awaiter(this, void 0, void 0, function* () {
                        const stream = yield navigator.mediaDevices.getUserMedia(constraints);
                        const ready = new Promise((resolve) => { dom.video.onloadeddata = () => resolve(true); });
                        dom.video.srcObject = stream;
                        void dom.video.play();
                        yield ready;
                        dom.canvas.width = dom.video.videoWidth;
                        dom.canvas.height = dom.video.videoHeight;
                        dom.canvas.onclick = () => dom.video.paused ? this.play() : this.pause(); // pause when clicked on screen and resume on next click
                    });
                    this.detectionLoop = () => __awaiter(this, void 0, void 0, function* () {
                        cancelAnimationFrame(this.rAF_ID);
                        if (!dom.video.paused) {
                            if (timestamp.start === 0)
                                timestamp.start = this.H_OBJ.now();
                            yield this.H_OBJ.detect(dom.video); // actual detection; were not capturing output in a local variable as it can also be reached via human.result
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
                    });
                    const drawLoop = () => __awaiter(this, void 0, void 0, function* () {
                        if (!dom.video.paused) {
                            this.interpolated = this.H_OBJ.next(this.H_OBJ.result); // smoothen result using last-known results
                            // reset canvas
                            const context = dom.canvas.getContext('2d', { willReadFrequently: true });
                            context.clearRect(0, 0, dom.canvas.width, dom.canvas.height);
                            yield this.H_OBJ.draw.all(dom.canvas, this.interpolated); // draw labels, boxes, lines, etc.
                            this.eventEmit(this.interpolated);
                        }
                        const now = this.H_OBJ.now();
                        fps.drawFPS = Math.round(1000 * 1000 / (now - timestamp.draw)) / 1000;
                        timestamp.draw = now;
                        this.isStart && setTimeout(drawLoop, this.fps); // use to slow down refresh from max refresh rate to target of 30 fps
                    });
                    yield this.H_OBJ.warmup(); // warmup function to initialize backend for future faster detection
                    yield webCam(); // start webcam
                    this.status(true, false);
                    yield this.detectionLoop(); // start detection loop
                    yield drawLoop(); // start draw loop
                    AS_COMPLETE(as, true);
                }
                catch (error) {
                    this.status(false, false);
                    this.eventEmit(null, error);
                    AS_COMPLETE(as, false, error);
                }
            });
            run();
        }
        else {
            this.stop();
            AS_COMPLETE(as, false);
        }
        return as;
    }
    /**
     * stop
     * @return AsyncSubject
     */
    stop() {
        var _a, _b, _c, _d;
        this.eventEmit(null);
        this.status(false, false);
        const as = new AsyncSubject();
        try {
            cancelAnimationFrame(this.rAF_ID);
            (_d = (_c = (_b = (_a = this.video) === null || _a === void 0 ? void 0 : _a.nativeElement) === null || _b === void 0 ? void 0 : _b.srcObject) === null || _c === void 0 ? void 0 : _c.getTracks()) === null || _d === void 0 ? void 0 : _d.forEach((track) => {
                track === null || track === void 0 ? void 0 : track.stop();
                AS_COMPLETE(as, true);
            });
        }
        catch (error) {
            this.eventEmit(false, error);
            AS_COMPLETE(as, false, error);
        }
        return as;
    }
    /**
     * play
     * @return AsyncSubject
     */
    play() {
        var _a, _b;
        const as = new AsyncSubject();
        if (this.isPause) {
            (_b = (_a = this.video) === null || _a === void 0 ? void 0 : _a.nativeElement) === null || _b === void 0 ? void 0 : _b.play();
            this.detectionLoop();
            AS_COMPLETE(as, true);
        }
        else {
            AS_COMPLETE(as, false);
        }
        return as;
    }
    /**
     * pause
     * @return AsyncSubject
     */
    pause() {
        var _a, _b;
        const as = new AsyncSubject();
        if (this.isStart) {
            cancelAnimationFrame(this.rAF_ID);
            (_b = (_a = this.video) === null || _a === void 0 ? void 0 : _a.nativeElement) === null || _b === void 0 ? void 0 : _b.pause();
            AS_COMPLETE(as, true);
        }
        else {
            AS_COMPLETE(as, false);
        }
        return as;
    }
    /**
     * loadImage
     * @param src
     */
    loadImage(src) {
        let as = new AsyncSubject();
        // Set the src of this Image object.
        const image = new Image();
        // Setting cross origin value to anonymous
        image.setAttribute('crossOrigin', 'anonymous');
        // Set src
        image.src = src;
        // When our image has loaded.
        image.onload = () => __awaiter(this, void 0, void 0, function* () {
            // Loading on
            this.status(false, true);
            // new Human
            let human = new Human$1(this.human); // create instance of human with overrides from user configuration
            this.overrideEnv(human);
            this.overrideDraw(human);
            // draw
            const draw = () => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d;
                this.canvas.nativeElement.style.position = '';
                this.video.nativeElement.style.display = 'none';
                this.canvas.nativeElement.style.maxWidth = '100%';
                this.canvas.nativeElement.width = (_b = (_a = image.naturalWidth) !== null && _a !== void 0 ? _a : image.width) !== null && _b !== void 0 ? _b : document.body.clientWidth;
                this.canvas.nativeElement.height = (_d = (_c = image.naturalHeight) !== null && _c !== void 0 ? _c : image.height) !== null && _d !== void 0 ? _d : document.body.clientHeight;
                const interpolated = human.next(human.result); // smoothen result using last-known results
                if (human.config.filter.flip) {
                    human.draw.canvas(interpolated.canvas, this.canvas.nativeElement); // draw processed image to screen canvas
                }
                else {
                    human.draw.canvas(image, this.canvas.nativeElement); // draw original video to screen canvas // better than using procesed image as this loop happens faster than processing loop
                }
                yield human.draw.all(this.canvas.nativeElement, interpolated); // draw labels, boxes, lines, etc.
                this.eventEmit(interpolated);
            });
            // run
            yield human.detect(image);
            yield draw();
            const loop = setInterval(() => __awaiter(this, void 0, void 0, function* () { return yield draw(); }), this.fps); // use to slow down refresh from max refresh rate to target of 30 fps
            setTimeout(() => {
                clearInterval(loop);
                this.status(false, false);
                AS_COMPLETE(as, true);
            }, this.timeoutDetect);
        });
        // error
        image.onerror = (error) => AS_COMPLETE(as, false, error);
        return as;
    }
    /**
     * download
     * @param fileName
     * @return AsyncSubject
     */
    download(fileName) {
        const as = new AsyncSubject();
        const canvas = document.createElement('canvas');
        canvas.width = this.video.nativeElement.videoWidth;
        canvas.height = this.video.nativeElement.videoHeight;
        // draw labels, boxes, lines, etc.
        const loop = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            // Get a 2D drawing context for the canvas.
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            // Draw image
            ctx.drawImage(this.video.nativeElement, 0, 0, canvas.width, canvas.height);
            yield this.H_OBJ.draw.all(canvas, this.interpolated);
            const dataURL = canvas.toDataURL(`image/${(_b = (_a = fileName === null || fileName === void 0 ? void 0 : fileName.split('.')) === null || _a === void 0 ? void 0 : _a.slice(-1)) === null || _b === void 0 ? void 0 : _b.toString()}`);
            const link = document.createElement('a');
            link.download = fileName;
            link.href = dataURL;
            link.click();
            AS_COMPLETE(as, { url: fileName, el: (_c = this.canvas) === null || _c === void 0 ? void 0 : _c.nativeElement });
            clearInterval(loop);
        }), this.fps); // use to slow down refresh from max refresh rate to target of 30 fps
        loop;
        return as;
    }
    /**
     * getDevices
     */
    getDevices(as) {
        navigator.mediaDevices.enumerateDevices().then(devices => {
            let cameraDevices = [];
            for (let i = 0; i < devices.length; i++) {
                let device = devices[i];
                if (device.kind == 'videoinput') {
                    cameraDevices.push(device);
                }
            }
            this.devices.next(cameraDevices);
            if (cameraDevices.length > 0) {
                this.playDevice(cameraDevices[0].deviceId, as);
            }
            else {
                AS_COMPLETE(as, false, 'No camera detected.');
            }
        });
    }
    /**
     * Override Config
     */
    overrideConfig() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        this.fps = (_c = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.fps) !== null && _b !== void 0 ? _b : this.fps) !== null && _c !== void 0 ? _c : FPS;
        this.timeoutDetect = (_f = (_e = (_d = this.config) === null || _d === void 0 ? void 0 : _d.timeoutDetect) !== null && _e !== void 0 ? _e : this.timeoutDetect) !== null && _f !== void 0 ? _f : TIMEOUT_DETECT;
        this.isAuto = (_j = (_h = (_g = this.config) === null || _g === void 0 ? void 0 : _g.isAuto) !== null && _h !== void 0 ? _h : this.isAuto) !== null && _j !== void 0 ? _j : false;
        this.env = OVERRIDES(ENV, (_l = (_k = this.config) === null || _k === void 0 ? void 0 : _k.env) !== null && _l !== void 0 ? _l : this.env);
        this.draw = OVERRIDES(DRAW_OPTIONS, (_o = (_m = this.config) === null || _m === void 0 ? void 0 : _m.draw) !== null && _o !== void 0 ? _o : this.draw);
        this.human = OVERRIDES(CONFIG, (_q = (_p = this.config) === null || _p === void 0 ? void 0 : _p.human) !== null && _q !== void 0 ? _q : this.human);
        this.medias = OVERRIDES(MEDIASTREAM, (_s = (_r = this.config) === null || _r === void 0 ? void 0 : _r.medias) !== null && _s !== void 0 ? _s : this.medias);
    }
    /**
     * Override Env
     * @return void
     */
    overrideEnv(human) {
        // Set env
        for (const key in this.env) {
            human.env[key] = this.env[key];
        }
    }
    /**
     * Override drawOptions
     * @return void
     */
    overrideDraw(human) {
        // Set drawOptions
        for (const key in this.draw) {
            human.draw.options[key] = this.draw[key];
        }
    }
    /**
     * status
     * @param isStart
     * @param isLoading
     */
    status(isStart, isLoading) {
        this.isStart = isStart;
        this.isLoading = isLoading;
    }
    /**
     * eventEmit
     * @param response
     * @param error
     */
    eventEmit(response = false, error = false) {
        (response !== false) && this.data.next(response !== null && response !== void 0 ? response : null);
        (response !== false) && this.event.emit(response !== null && response !== void 0 ? response : null);
        (error !== false) && this.error.emit(error !== null && error !== void 0 ? error : null);
    }
    /**
     * Status of camera
     * @return boolean
     */
    get isPause() {
        var _a, _b;
        return (_b = (_a = this.video) === null || _a === void 0 ? void 0 : _a.nativeElement) === null || _b === void 0 ? void 0 : _b.paused;
    }
    ngOnDestroy() {
        this.pause();
    }
}
NgxScannerFaceComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: NgxScannerFaceComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
NgxScannerFaceComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.0.5", type: NgxScannerFaceComponent, selector: "ngx-scanner-face", inputs: { src: "src", isAuto: "isAuto", fps: "fps", timeoutDetect: "timeoutDetect", medias: "medias", env: "env", draw: "draw", human: "human", config: "config", style: "style", videoStyle: "videoStyle", canvasStyle: "canvasStyle" }, outputs: { event: "event", error: "error" }, viewQueries: [{ propertyName: "video", first: true, predicate: ["video"], descendants: true, static: true }, { propertyName: "canvas", first: true, predicate: ["canvas"], descendants: true, static: true }], exportAs: ["scanner"], ngImport: i0, template: `<canvas #canvas [style]="canvasStyle || style" style="position: absolute"></canvas><video #video playsinline [style]="videoStyle || style" style="background-color: #262626;"></video><ng-content></ng-content>`, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: NgxScannerFaceComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngx-scanner-face',
                    template: `<canvas #canvas [style]="canvasStyle || style" style="position: absolute"></canvas><video #video playsinline [style]="videoStyle || style" style="background-color: #262626;"></video><ng-content></ng-content>`,
                    inputs: ['src', 'isAuto', 'fps', 'timeoutDetect', 'medias', 'env', 'draw', 'human', 'config', 'style', 'videoStyle', 'canvasStyle'],
                    outputs: ['event', 'error'],
                    exportAs: 'scanner',
                    queries: {
                        video: new ViewChild('video', { static: true }),
                        canvas: new ViewChild('canvas', { static: true })
                    }
                }]
        }] });

// Models
class Env extends Env$1 {
}
class Human extends Human$1 {
}

/**
 * @default ngx-scanner-face
 * @author <DaiDH>
 * @package https://www.npmjs.com/package/ngx-scanner-face
 * @license MIT https://github.com/id1945/ngx-scanner-face/blob/master/LICENSE
 * @copyright <https://github.com/id1945>
*/
class NgxScannerFaceModule {
}
NgxScannerFaceModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: NgxScannerFaceModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgxScannerFaceModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: NgxScannerFaceModule, declarations: [NgxScannerFaceComponent], exports: [NgxScannerFaceComponent] });
NgxScannerFaceModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: NgxScannerFaceModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: NgxScannerFaceModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        NgxScannerFaceComponent
                    ],
                    exports: [
                        NgxScannerFaceComponent
                    ]
                }]
        }] });

/*
 * Public API Surface of ngx-scanner-face
 */

/**
 * Generated bundle index. Do not edit.
 */

export { Env, Human, NgxScannerFaceComponent, NgxScannerFaceModule, NgxScannerFaceService };
//# sourceMappingURL=ngx-scanner-face.js.map
