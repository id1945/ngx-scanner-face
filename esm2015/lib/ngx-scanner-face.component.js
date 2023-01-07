import { __awaiter } from "tslib";
/**
 * @default ngx-scanner-face
 * @author <DaiDH>
 * @package https://www.npmjs.com/package/ngx-scanner-face
 * @license MIT https://github.com/id1945/ngx-scanner-face/blob/master/LICENSE
 * @copyright <https://github.com/id1945>
*/
import { Component, EventEmitter, ViewChild } from '@angular/core';
import { AsyncSubject, BehaviorSubject } from 'rxjs';
import { Human } from 'ngx-scanner-face-human';
import { FPS, CONFIG, DRAW_OPTIONS, ENV, MEDIASTREAM, TIMEOUT_DETECT } from './ngx-scanner-face.default';
import { AS_COMPLETE, OVERRIDES } from './ngx-scanner-face.helper';
import * as i0 from "@angular/core";
export class NgxScannerFaceComponent {
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
                    this.H_OBJ = new Human(this.human); // create instance of human with overrides from user configuration
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
            let human = new Human(this.human); // create instance of human with overrides from user configuration
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNjYW5uZXItZmFjZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZ3gtc2Nhbm5lci1mYWNlL3NyYy9saWIvbmd4LXNjYW5uZXItZmFjZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7RUFNRTtBQUVGLE9BQU8sRUFBRSxTQUFTLEVBQWMsWUFBWSxFQUFxQixTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbEcsT0FBTyxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDckQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQy9DLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRXpHLE9BQU8sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7O0FBYW5FLE1BQU0sT0FBTyx1QkFBdUI7SUFYcEM7UUFvQkU7O1dBRUc7UUFDSSxVQUFLLEdBQUcsSUFBSSxZQUFZLEVBQW1CLENBQUM7UUFDNUMsVUFBSyxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFFdkM7O1dBRUc7UUFDSSxRQUFHLEdBQVcsRUFBRSxDQUFDO1FBQ2pCLFdBQU0sR0FBWSxLQUFLLENBQUMsQ0FBQyxxQkFBcUI7UUFDOUMsUUFBRyxHQUFXLEdBQUcsQ0FBQyxDQUFDLHNCQUFzQjtRQUN6QyxrQkFBYSxHQUFXLGNBQWMsQ0FBQyxDQUFDLHFCQUFxQjtRQUM3RCxXQUFNLEdBQTJCLEVBQUUsQ0FBQztRQUNwQyxRQUFHLEdBQWlCLEVBQUUsQ0FBQztRQUN2QixTQUFJLEdBQXlCLEVBQUUsQ0FBQztRQUNoQyxVQUFLLEdBQW9CLEVBQUUsQ0FBQztRQUM1QixXQUFNLEdBQXNCLEVBQUUsQ0FBQztRQUMvQixVQUFLLEdBQVEsSUFBSSxDQUFDO1FBQ2xCLGVBQVUsR0FBUSxJQUFJLENBQUM7UUFDdkIsZ0JBQVcsR0FBUSxJQUFJLENBQUM7UUFFL0I7O1dBRUc7UUFDSSxZQUFPLEdBQVksS0FBSyxDQUFDO1FBQ3pCLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFDM0IsU0FBSSxHQUFHLElBQUksZUFBZSxDQUFrQixFQUFFLENBQUMsQ0FBQztRQUNoRCxZQUFPLEdBQUcsSUFBSSxlQUFlLENBQVcsRUFBRSxDQUFDLENBQUM7S0FxV3BEO0lBOVZDLFFBQVE7UUFDTixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdEIsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ1osSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDMUI7YUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDdEIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ2Q7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksS0FBSztRQUNWLE1BQU0sRUFBRSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDbkMsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLFNBQVM7WUFDVCxXQUFXLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3hCO2FBQU07WUFDTCxlQUFlO1lBQ2YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNyQjtRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksVUFBVSxDQUFDLFFBQWdCLEVBQUUsS0FBd0IsSUFBSSxZQUFZLEVBQU87UUFDakYsSUFBSSxFQUFFLENBQUM7UUFDUCxJQUFJLFFBQVEsSUFBSSxRQUFRLElBQUksTUFBTSxFQUFFO1lBQ2xDLE1BQU0sV0FBVyxHQUFHO2dCQUNsQixLQUFLLEVBQUUsS0FBSztnQkFDWixLQUFLLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7YUFDbEssQ0FBQTtZQUNELGNBQWM7WUFDZCxNQUFNLEdBQUcsR0FBRyxHQUFTLEVBQUU7Z0JBQ3JCLElBQUk7b0JBQ0YsYUFBYTtvQkFDYixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFFekIsWUFBWTtvQkFDWixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGtFQUFrRTtvQkFDdEcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzdCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUU5QixzRUFBc0U7b0JBQ3RFLE1BQU0sR0FBRyxHQUFHO3dCQUNWLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWlDO3dCQUNuRCxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFrQztxQkFDdkQsQ0FBQztvQkFFRixNQUFNLFNBQVMsR0FBRyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLDRFQUE0RTtvQkFDNUksTUFBTSxHQUFHLEdBQUcsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxzRUFBc0U7b0JBQ3pJLE1BQU0sTUFBTSxHQUFHLEdBQVMsRUFBRTt3QkFDeEIsTUFBTSxNQUFNLEdBQWdCLE1BQU0sU0FBUyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7d0JBQ25GLE1BQU0sS0FBSyxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLFlBQVksR0FBRyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDMUYsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO3dCQUM3QixLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBQ3RCLE1BQU0sS0FBSyxDQUFDO3dCQUNaLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDO3dCQUN4QyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQzt3QkFDMUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsd0RBQXdEO29CQUNwSSxDQUFDLENBQUEsQ0FBQTtvQkFFRCxJQUFJLENBQUMsYUFBYSxHQUFHLEdBQVMsRUFBRTt3QkFDOUIsb0JBQW9CLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUNsQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7NEJBQ3JCLElBQUksU0FBUyxDQUFDLEtBQUssS0FBSyxDQUFDO2dDQUFFLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQzs0QkFDOUQsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyw2R0FBNkc7NEJBQ2pKLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLDhDQUE4Qzs0QkFDakcsU0FBUyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7NEJBQzVCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7NEJBQ3ZGLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQzs0QkFDYixHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQzs0QkFDNUYsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO3lCQUNyQzt3QkFDRCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7NEJBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcscUJBQXFCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsOEJBQThCO3lCQUN4RjtvQkFDSCxDQUFDLENBQUEsQ0FBQTtvQkFFRCxNQUFNLFFBQVEsR0FBRyxHQUFTLEVBQUU7d0JBQzFCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTs0QkFDckIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsMkNBQTJDOzRCQUNuRyxlQUFlOzRCQUNmLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxFQUFFLGtCQUFrQixFQUFFLElBQUksRUFBRSxDQUE2QixDQUFDOzRCQUN0RyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzs0QkFDN0QsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxrQ0FBa0M7NEJBQzVGLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO3lCQUNuQzt3QkFDRCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO3dCQUM3QixHQUFHLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7d0JBQ3RFLFNBQVMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO3dCQUNyQixJQUFJLENBQUMsT0FBTyxJQUFJLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMscUVBQXFFO29CQUN2SCxDQUFDLENBQUEsQ0FBQTtvQkFFRCxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxvRUFBb0U7b0JBQy9GLE1BQU0sTUFBTSxFQUFFLENBQUMsQ0FBQyxlQUFlO29CQUMvQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDekIsTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyx1QkFBdUI7b0JBQ25ELE1BQU0sUUFBUSxFQUFFLENBQUMsQ0FBQyxrQkFBa0I7b0JBQ3BDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQ3ZCO2dCQUFDLE9BQU8sS0FBVSxFQUFFO29CQUNuQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQzVCLFdBQVcsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO2lCQUMvQjtZQUNILENBQUMsQ0FBQSxDQUFBO1lBQ0QsR0FBRyxFQUFFLENBQUM7U0FDUDthQUFNO1lBQ0wsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ1osV0FBVyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUN4QjtRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVEOzs7T0FHRztJQUNJLElBQUk7O1FBQ1QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMxQixNQUFNLEVBQUUsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQ25DLElBQUk7WUFDRixvQkFBb0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbEMsTUFBQSxNQUFDLE1BQUEsTUFBQSxJQUFJLENBQUMsS0FBSywwQ0FBRSxhQUFhLDBDQUFFLFNBQWlCLDBDQUFFLFNBQVMsRUFBRSwwQ0FBRSxPQUFPLENBQUMsQ0FBQyxLQUFVLEVBQUUsRUFBRTtnQkFDakYsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLElBQUksRUFBRSxDQUFDO2dCQUNkLFdBQVcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDeEIsQ0FBQyxDQUFDLENBQUM7U0FDSjtRQUFDLE9BQU8sS0FBVSxFQUFFO1lBQ25CLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzdCLFdBQVcsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQy9CO1FBQ0QsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksSUFBSTs7UUFDVCxNQUFNLEVBQUUsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQ25DLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixNQUFBLE1BQUEsSUFBSSxDQUFDLEtBQUssMENBQUUsYUFBYSwwQ0FBRSxJQUFJLEVBQUUsQ0FBQztZQUNsQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDckIsV0FBVyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUN2QjthQUFNO1lBQ0wsV0FBVyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUN4QjtRQUNELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVEOzs7T0FHRztJQUNJLEtBQUs7O1FBQ1YsTUFBTSxFQUFFLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUNuQyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsb0JBQW9CLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2xDLE1BQUEsTUFBQSxJQUFJLENBQUMsS0FBSywwQ0FBRSxhQUFhLDBDQUFFLEtBQUssRUFBRSxDQUFDO1lBQ25DLFdBQVcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDdkI7YUFBTTtZQUNMLFdBQVcsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDeEI7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFFRDs7O09BR0c7SUFDSSxTQUFTLENBQUMsR0FBVztRQUMxQixJQUFJLEVBQUUsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBRWpDLG9DQUFvQztRQUNwQyxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1FBRTFCLDBDQUEwQztRQUMxQyxLQUFLLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUUvQyxVQUFVO1FBQ1YsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFFaEIsNkJBQTZCO1FBQzdCLEtBQUssQ0FBQyxNQUFNLEdBQUcsR0FBUyxFQUFFO1lBQ3hCLGFBQWE7WUFDYixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUV6QixZQUFZO1lBQ1osSUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsa0VBQWtFO1lBQ3JHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUV6QixPQUFPO1lBQ1AsTUFBTSxJQUFJLEdBQUcsR0FBUyxFQUFFOztnQkFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7Z0JBQzlDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO2dCQUNoRCxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztnQkFDbEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxHQUFHLE1BQUEsTUFBQSxLQUFLLENBQUMsWUFBWSxtQ0FBSSxLQUFLLENBQUMsS0FBSyxtQ0FBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztnQkFDakcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLE1BQUEsTUFBQSxLQUFLLENBQUMsYUFBYSxtQ0FBSSxLQUFLLENBQUMsTUFBTSxtQ0FBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztnQkFDckcsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQywyQ0FBMkM7Z0JBQzFGLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO29CQUM1QixLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBMkIsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsd0NBQXdDO2lCQUNqSTtxQkFBTTtvQkFDTCxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLDRIQUE0SDtpQkFDbEw7Z0JBQ0QsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLGtDQUFrQztnQkFDakcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMvQixDQUFDLENBQUEsQ0FBQTtZQUVELE1BQU07WUFDTixNQUFNLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDekIsTUFBTSxJQUFJLEVBQUUsQ0FBQztZQUNiLE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxHQUFTLEVBQUUsZ0RBQUMsT0FBQSxNQUFNLElBQUksRUFBRSxDQUFBLEdBQUEsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBRSxxRUFBcUU7WUFDcEksVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZCxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUMxQixXQUFXLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3hCLENBQUMsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDekIsQ0FBQyxDQUFBLENBQUM7UUFFRixRQUFRO1FBQ1IsS0FBSyxDQUFDLE9BQU8sR0FBRyxDQUFDLEtBQVUsRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFOUQsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLFFBQVEsQ0FBQyxRQUFnQjtRQUM5QixNQUFNLEVBQUUsR0FBRyxJQUFJLFlBQVksRUFBMEMsQ0FBQTtRQUNyRSxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDO1FBQ25ELE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDO1FBQ3JELGtDQUFrQztRQUNsQyxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsR0FBUyxFQUFFOztZQUNsQywyQ0FBMkM7WUFDM0MsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxrQkFBa0IsRUFBRSxJQUFJLEVBQUUsQ0FBNkIsQ0FBQztZQUM5RixhQUFhO1lBQ2IsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzNFLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7WUFDcEQsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLE1BQUEsTUFBQSxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQywwQ0FBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsMENBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3pGLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7WUFDekIsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7WUFDcEIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2IsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQUEsSUFBSSxDQUFDLE1BQU0sMENBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQztZQUNuRSxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEIsQ0FBQyxDQUFBLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUUscUVBQXFFO1FBQ3BGLElBQUksQ0FBQztRQUNMLE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVEOztPQUVHO0lBQ0ssVUFBVSxDQUFDLEVBQXFCO1FBQ3RDLFNBQVMsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDdkQsSUFBSSxhQUFhLEdBQWEsRUFBRSxDQUFDO1lBQ2pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN2QyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxZQUFZLEVBQUU7b0JBQy9CLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQzVCO2FBQ0Y7WUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNqQyxJQUFJLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUM1QixJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDaEQ7aUJBQU07Z0JBQ0wsV0FBVyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUscUJBQTRCLENBQUMsQ0FBQzthQUN0RDtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0ssY0FBYzs7UUFDcEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFBLE1BQUEsTUFBQSxJQUFJLENBQUMsTUFBTSwwQ0FBRSxHQUFHLG1DQUFJLElBQUksQ0FBQyxHQUFHLG1DQUFJLEdBQUcsQ0FBQztRQUMvQyxJQUFJLENBQUMsYUFBYSxHQUFHLE1BQUEsTUFBQSxNQUFBLElBQUksQ0FBQyxNQUFNLDBDQUFFLGFBQWEsbUNBQUksSUFBSSxDQUFDLGFBQWEsbUNBQUksY0FBYyxDQUFDO1FBQ3hGLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBQSxNQUFBLE1BQUEsSUFBSSxDQUFDLE1BQU0sMENBQUUsTUFBTSxtQ0FBSSxJQUFJLENBQUMsTUFBTSxtQ0FBSSxLQUFLLENBQUM7UUFDMUQsSUFBSSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxFQUFFLE1BQUEsTUFBQSxJQUFJLENBQUMsTUFBTSwwQ0FBRSxHQUFHLG1DQUFJLElBQUksQ0FBQyxHQUFHLENBQWlCLENBQUM7UUFDeEUsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsWUFBWSxFQUFFLE1BQUEsTUFBQSxJQUFJLENBQUMsTUFBTSwwQ0FBRSxJQUFJLG1DQUFJLElBQUksQ0FBQyxJQUFJLENBQXlCLENBQUM7UUFDNUYsSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLE1BQUEsTUFBQSxJQUFJLENBQUMsTUFBTSwwQ0FBRSxLQUFLLG1DQUFJLElBQUksQ0FBQyxLQUFLLENBQW9CLENBQUM7UUFDcEYsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsV0FBVyxFQUFFLE1BQUEsTUFBQSxJQUFJLENBQUMsTUFBTSwwQ0FBRSxNQUFNLG1DQUFJLElBQUksQ0FBQyxNQUFNLENBQTJCLENBQUM7SUFDckcsQ0FBQztJQUVEOzs7T0FHRztJQUNLLFdBQVcsQ0FBQyxLQUFxQjtRQUN2QyxVQUFVO1FBQ1YsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ3pCLEtBQUssQ0FBQyxHQUFXLENBQUMsR0FBRyxDQUFDLEdBQUksSUFBSSxDQUFDLEdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNsRDtJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSyxZQUFZLENBQUMsS0FBcUI7UUFDeEMsa0JBQWtCO1FBQ2xCLEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUMxQixLQUFLLENBQUMsSUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBSSxJQUFJLENBQUMsSUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzVEO0lBQ0gsQ0FBQztJQUVEOzs7O09BSUc7SUFDSyxNQUFNLENBQUMsT0FBZ0IsRUFBRSxTQUFrQjtRQUNqRCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUM3QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNLLFNBQVMsQ0FBQyxXQUFnQixLQUFLLEVBQUUsUUFBYSxLQUFLO1FBQ3pELENBQUMsUUFBUSxLQUFLLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsYUFBUixRQUFRLGNBQVIsUUFBUSxHQUFJLElBQUksQ0FBQyxDQUFDO1FBQ3pELENBQUMsUUFBUSxLQUFLLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsYUFBUixRQUFRLGNBQVIsUUFBUSxHQUFJLElBQUksQ0FBQyxDQUFDO1FBQzFELENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssYUFBTCxLQUFLLGNBQUwsS0FBSyxHQUFJLElBQUksQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFJLE9BQU87O1FBQ1QsT0FBTyxNQUFBLE1BQUEsSUFBSSxDQUFDLEtBQUssMENBQUUsYUFBYSwwQ0FBRSxNQUFNLENBQUM7SUFDM0MsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDZixDQUFDOztvSEF6WVUsdUJBQXVCO3dHQUF2Qix1QkFBdUIscWpCQVR4QixpTkFBaU47MkZBU2hOLHVCQUF1QjtrQkFYbkMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsa0JBQWtCO29CQUM1QixRQUFRLEVBQUUsaU5BQWlOO29CQUMzTixNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLGFBQWEsQ0FBQztvQkFDbkksT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQztvQkFDM0IsUUFBUSxFQUFFLFNBQVM7b0JBQ25CLE9BQU8sRUFBRTt3QkFDUCxLQUFLLEVBQUUsSUFBSSxTQUFTLENBQUMsT0FBTyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO3dCQUMvQyxNQUFNLEVBQUUsSUFBSSxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDO3FCQUNsRDtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAZGVmYXVsdCBuZ3gtc2Nhbm5lci1mYWNlXHJcbiAqIEBhdXRob3IgPERhaURIPlxyXG4gKiBAcGFja2FnZSBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9uZ3gtc2Nhbm5lci1mYWNlXHJcbiAqIEBsaWNlbnNlIE1JVCBodHRwczovL2dpdGh1Yi5jb20vaWQxOTQ1L25neC1zY2FubmVyLWZhY2UvYmxvYi9tYXN0ZXIvTElDRU5TRVxyXG4gKiBAY29weXJpZ2h0IDxodHRwczovL2dpdGh1Yi5jb20vaWQxOTQ1PlxyXG4qL1xyXG5cclxuaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgT25Jbml0LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQXN5bmNTdWJqZWN0LCBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgSHVtYW4gfSBmcm9tICduZ3gtc2Nhbm5lci1mYWNlLWh1bWFuJztcclxuaW1wb3J0IHsgRlBTLCBDT05GSUcsIERSQVdfT1BUSU9OUywgRU5WLCBNRURJQVNUUkVBTSwgVElNRU9VVF9ERVRFQ1QgfSBmcm9tICcuL25neC1zY2FubmVyLWZhY2UuZGVmYXVsdCc7XHJcbmltcG9ydCB7IFNjYW5uZXJGYWNlQ29uZmlnLCBDb25maWcsIERyYXdPcHRpb25zLCBFbnYsIFJlc3VsdCwgRGV2aWNlIH0gZnJvbSAnLi9uZ3gtc2Nhbm5lci1mYWNlLm9wdGlvbnMnO1xyXG5pbXBvcnQgeyBBU19DT01QTEVURSwgT1ZFUlJJREVTIH0gZnJvbSAnLi9uZ3gtc2Nhbm5lci1mYWNlLmhlbHBlcic7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1zY2FubmVyLWZhY2UnLFxyXG4gIHRlbXBsYXRlOiBgPGNhbnZhcyAjY2FudmFzIFtzdHlsZV09XCJjYW52YXNTdHlsZSB8fCBzdHlsZVwiIHN0eWxlPVwicG9zaXRpb246IGFic29sdXRlXCI+PC9jYW52YXM+PHZpZGVvICN2aWRlbyBwbGF5c2lubGluZSBbc3R5bGVdPVwidmlkZW9TdHlsZSB8fCBzdHlsZVwiIHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogIzI2MjYyNjtcIj48L3ZpZGVvPjxuZy1jb250ZW50PjwvbmctY29udGVudD5gLFxyXG4gIGlucHV0czogWydzcmMnLCAnaXNBdXRvJywgJ2ZwcycsICd0aW1lb3V0RGV0ZWN0JywgJ21lZGlhcycsICdlbnYnLCAnZHJhdycsICdodW1hbicsICdjb25maWcnLCAnc3R5bGUnLCAndmlkZW9TdHlsZScsICdjYW52YXNTdHlsZSddLFxyXG4gIG91dHB1dHM6IFsnZXZlbnQnLCAnZXJyb3InXSxcclxuICBleHBvcnRBczogJ3NjYW5uZXInLFxyXG4gIHF1ZXJpZXM6IHtcclxuICAgIHZpZGVvOiBuZXcgVmlld0NoaWxkKCd2aWRlbycsIHsgc3RhdGljOiB0cnVlIH0pLFxyXG4gICAgY2FudmFzOiBuZXcgVmlld0NoaWxkKCdjYW52YXMnLCB7IHN0YXRpYzogdHJ1ZSB9KVxyXG4gIH1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5neFNjYW5uZXJGYWNlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xyXG5cclxuICAvKipcclxuICAgKiBFbGVtZW50XHJcbiAgICogcGxheXNpbmxpbmUgcmVxdWlyZWQgdG8gdGVsbCBpT1Mgc2FmYXJpIHdlIGRvbid0IHdhbnQgZnVsbHNjcmVlblxyXG4gICAqL1xyXG4gIHB1YmxpYyB2aWRlbyE6IEVsZW1lbnRSZWY8SFRNTFZpZGVvRWxlbWVudD47XHJcbiAgcHVibGljIGNhbnZhcyE6IEVsZW1lbnRSZWY8SFRNTENhbnZhc0VsZW1lbnQ+O1xyXG5cclxuICAvKipcclxuICAgKiBFdmVudEVtaXR0ZXJcclxuICAgKi9cclxuICBwdWJsaWMgZXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyPFBhcnRpYWw8UmVzdWx0Pj4oKTtcclxuICBwdWJsaWMgZXJyb3IgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcclxuXHJcbiAgLyoqXHJcbiAgICogSW5wdXRcclxuICAgKi9cclxuICBwdWJsaWMgc3JjOiBzdHJpbmcgPSAnJztcclxuICBwdWJsaWMgaXNBdXRvOiBib29sZWFuID0gZmFsc2U7IC8vIEF1dG8gc3RhcnQgY2FtZXJhLlxyXG4gIHB1YmxpYyBmcHM6IG51bWJlciA9IEZQUzsgLy8gRnJhbWUgc3BlZWQgbXMvZnBzLlxyXG4gIHB1YmxpYyB0aW1lb3V0RGV0ZWN0OiBudW1iZXIgPSBUSU1FT1VUX0RFVEVDVDsgLy8gc2V0VGltZW91dCAxMDAwbXMuXHJcbiAgcHVibGljIG1lZGlhczogTWVkaWFTdHJlYW1Db25zdHJhaW50cyA9IHt9O1xyXG4gIHB1YmxpYyBlbnY6IFBhcnRpYWw8RW52PiA9IHt9O1xyXG4gIHB1YmxpYyBkcmF3OiBQYXJ0aWFsPERyYXdPcHRpb25zPiA9IHt9O1xyXG4gIHB1YmxpYyBodW1hbjogUGFydGlhbDxDb25maWc+ID0ge307XHJcbiAgcHVibGljIGNvbmZpZzogU2Nhbm5lckZhY2VDb25maWcgPSB7fTtcclxuICBwdWJsaWMgc3R5bGU6IGFueSA9IG51bGw7XHJcbiAgcHVibGljIHZpZGVvU3R5bGU6IGFueSA9IG51bGw7XHJcbiAgcHVibGljIGNhbnZhc1N0eWxlOiBhbnkgPSBudWxsO1xyXG5cclxuICAvKipcclxuICAgKiBFeHBvcnRcclxuICAgKi9cclxuICBwdWJsaWMgaXNTdGFydDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHB1YmxpYyBpc0xvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBwdWJsaWMgZGF0YSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8UGFydGlhbDxSZXN1bHQ+Pih7fSk7XHJcbiAgcHVibGljIGRldmljZXMgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PERldmljZVtdPihbXSk7XHJcblxyXG4gIHByaXZhdGUgckFGX0lEOiBhbnk7XHJcbiAgcHJpdmF0ZSBkZXRlY3Rpb25Mb29wOiBhbnk7XHJcbiAgcHJpdmF0ZSBIX09CSiE6IEh1bWFuO1xyXG4gIHByaXZhdGUgaW50ZXJwb2xhdGVkITogUmVzdWx0O1xyXG5cclxuICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgIHRoaXMub3ZlcnJpZGVDb25maWcoKTtcclxuICAgIGlmICh0aGlzLnNyYykge1xyXG4gICAgICB0aGlzLmxvYWRJbWFnZSh0aGlzLnNyYyk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNBdXRvKSB7XHJcbiAgICAgIHRoaXMuc3RhcnQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHN0YXJ0XHJcbiAgICogQHJldHVybiBBc3luY1N1YmplY3RcclxuICAgKi9cclxuICBwdWJsaWMgc3RhcnQoKTogQXN5bmNTdWJqZWN0PGFueT4ge1xyXG4gICAgY29uc3QgYXMgPSBuZXcgQXN5bmNTdWJqZWN0PGFueT4oKTtcclxuICAgIGlmICh0aGlzLmlzU3RhcnQpIHtcclxuICAgICAgLy8gUmVqZWN0XHJcbiAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBtZWRpYURldmljZXNcclxuICAgICAgdGhpcy5nZXREZXZpY2VzKGFzKTtcclxuICAgIH1cclxuICAgIHJldHVybiBhcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHBsYXlEZXZpY2VcclxuICAgKiBAcGFyYW0gZGV2aWNlSWQgXHJcbiAgICogQHBhcmFtIGFzIFxyXG4gICAqIEByZXR1cm5zIFxyXG4gICAqL1xyXG4gIHB1YmxpYyBwbGF5RGV2aWNlKGRldmljZUlkOiBzdHJpbmcsIGFzOiBBc3luY1N1YmplY3Q8YW55PiA9IG5ldyBBc3luY1N1YmplY3Q8YW55PigpKTogQXN5bmNTdWJqZWN0PGFueT4ge1xyXG4gICAgc3RvcCgpO1xyXG4gICAgaWYgKGRldmljZUlkICYmIGRldmljZUlkICE9ICdudWxsJykge1xyXG4gICAgICBjb25zdCBjb25zdHJhaW50cyA9IHtcclxuICAgICAgICBhdWRpbzogZmFsc2UsXHJcbiAgICAgICAgdmlkZW86IHR5cGVvZiAodGhpcy5tZWRpYXMgJiYgdGhpcy5tZWRpYXMudmlkZW8pID09PSAnYm9vbGVhbicgPyB7IGRldmljZUlkOiBkZXZpY2VJZCB9IDogT2JqZWN0LmFzc2lnbih7IGRldmljZUlkOiBkZXZpY2VJZCB9LCB0aGlzLm1lZGlhcyAmJiB0aGlzLm1lZGlhcy52aWRlbylcclxuICAgICAgfVxyXG4gICAgICAvLyBNZWRpYVN0cmVhbVxyXG4gICAgICBjb25zdCBydW4gPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIC8vIExvYWRpbmcgb25cclxuICAgICAgICAgIHRoaXMuc3RhdHVzKGZhbHNlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAvLyBuZXcgSHVtYW5cclxuICAgICAgICAgIHRoaXMuSF9PQkogPSBuZXcgSHVtYW4odGhpcy5odW1hbik7IC8vIGNyZWF0ZSBpbnN0YW5jZSBvZiBodW1hbiB3aXRoIG92ZXJyaWRlcyBmcm9tIHVzZXIgY29uZmlndXJhdGlvblxyXG4gICAgICAgICAgdGhpcy5vdmVycmlkZUVudih0aGlzLkhfT0JKKTtcclxuICAgICAgICAgIHRoaXMub3ZlcnJpZGVEcmF3KHRoaXMuSF9PQkopO1xyXG5cclxuICAgICAgICAgIC8vIGdyYWIgaW5zdGFuY2VzIG9mIGRvbSBvYmplY3RzIHNvIHdlIGRvbnQgaGF2ZSB0byBsb29rIHRoZW0gdXAgbGF0ZXJcclxuICAgICAgICAgIGNvbnN0IGRvbSA9IHtcclxuICAgICAgICAgICAgdmlkZW86IHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudCBhcyBIVE1MVmlkZW9FbGVtZW50LFxyXG4gICAgICAgICAgICBjYW52YXM6IHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTENhbnZhc0VsZW1lbnRcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgY29uc3QgdGltZXN0YW1wID0geyBkZXRlY3Q6IDAsIGRyYXc6IDAsIHRlbnNvcnM6IDAsIHN0YXJ0OiAwIH07IC8vIGhvbGRzIGluZm9ybWF0aW9uIHVzZWQgdG8gY2FsY3VsYXRlIHBlcmZvcm1hbmNlIGFuZCBwb3NzaWJsZSBtZW1vcnkgbGVha3NcclxuICAgICAgICAgIGNvbnN0IGZwcyA9IHsgZGV0ZWN0RlBTOiAwLCBkcmF3RlBTOiAwLCBmcmFtZXM6IDAsIGF2ZXJhZ2VNczogMCB9OyAvLyBob2xkcyBjYWxjdWxhdGVkIGZwcyBpbmZvcm1hdGlvbiBmb3IgYm90aCBkZXRlY3QgYW5kIHNjcmVlbiByZWZyZXNoXHJcbiAgICAgICAgICBjb25zdCB3ZWJDYW0gPSBhc3luYyAoKSA9PiB7IC8vIGluaXRpYWxpemUgd2ViY2FtXHJcbiAgICAgICAgICAgIGNvbnN0IHN0cmVhbTogTWVkaWFTdHJlYW0gPSBhd2FpdCBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYShjb25zdHJhaW50cyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlYWR5ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHsgZG9tLnZpZGVvLm9ubG9hZGVkZGF0YSA9ICgpID0+IHJlc29sdmUodHJ1ZSk7IH0pO1xyXG4gICAgICAgICAgICBkb20udmlkZW8uc3JjT2JqZWN0ID0gc3RyZWFtO1xyXG4gICAgICAgICAgICB2b2lkIGRvbS52aWRlby5wbGF5KCk7XHJcbiAgICAgICAgICAgIGF3YWl0IHJlYWR5O1xyXG4gICAgICAgICAgICBkb20uY2FudmFzLndpZHRoID0gZG9tLnZpZGVvLnZpZGVvV2lkdGg7XHJcbiAgICAgICAgICAgIGRvbS5jYW52YXMuaGVpZ2h0ID0gZG9tLnZpZGVvLnZpZGVvSGVpZ2h0O1xyXG4gICAgICAgICAgICBkb20uY2FudmFzLm9uY2xpY2sgPSAoKSA9PiBkb20udmlkZW8ucGF1c2VkID8gdGhpcy5wbGF5KCkgOiB0aGlzLnBhdXNlKCk7IC8vIHBhdXNlIHdoZW4gY2xpY2tlZCBvbiBzY3JlZW4gYW5kIHJlc3VtZSBvbiBuZXh0IGNsaWNrXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdGhpcy5kZXRlY3Rpb25Mb29wID0gYXN5bmMgKCkgPT4geyAvLyBtYWluIGRldGVjdGlvbiBsb29wXHJcbiAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuckFGX0lEKTtcclxuICAgICAgICAgICAgaWYgKCFkb20udmlkZW8ucGF1c2VkKSB7XHJcbiAgICAgICAgICAgICAgaWYgKHRpbWVzdGFtcC5zdGFydCA9PT0gMCkgdGltZXN0YW1wLnN0YXJ0ID0gdGhpcy5IX09CSi5ub3coKTtcclxuICAgICAgICAgICAgICBhd2FpdCB0aGlzLkhfT0JKLmRldGVjdChkb20udmlkZW8pOyAvLyBhY3R1YWwgZGV0ZWN0aW9uOyB3ZXJlIG5vdCBjYXB0dXJpbmcgb3V0cHV0IGluIGEgbG9jYWwgdmFyaWFibGUgYXMgaXQgY2FuIGFsc28gYmUgcmVhY2hlZCB2aWEgaHVtYW4ucmVzdWx0XHJcbiAgICAgICAgICAgICAgY29uc3QgdGVuc29ycyA9IHRoaXMuSF9PQkoudGYubWVtb3J5KCkubnVtVGVuc29yczsgLy8gY2hlY2sgY3VycmVudCB0ZW5zb3IgdXNhZ2UgZm9yIG1lbW9yeSBsZWFrc1xyXG4gICAgICAgICAgICAgIHRpbWVzdGFtcC50ZW5zb3JzID0gdGVuc29ycztcclxuICAgICAgICAgICAgICBmcHMuZGV0ZWN0RlBTID0gTWF0aC5yb3VuZCgxMDAwICogMTAwMCAvICh0aGlzLkhfT0JKLm5vdygpIC0gdGltZXN0YW1wLmRldGVjdCkpIC8gMTAwMDtcclxuICAgICAgICAgICAgICBmcHMuZnJhbWVzKys7XHJcbiAgICAgICAgICAgICAgZnBzLmF2ZXJhZ2VNcyA9IE1hdGgucm91bmQoMTAwMCAqICh0aGlzLkhfT0JKLm5vdygpIC0gdGltZXN0YW1wLnN0YXJ0KSAvIGZwcy5mcmFtZXMpIC8gMTAwMDtcclxuICAgICAgICAgICAgICB0aW1lc3RhbXAuZGV0ZWN0ID0gdGhpcy5IX09CSi5ub3coKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1N0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yQUZfSUQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5kZXRlY3Rpb25Mb29wKTsgLy8gc3RhcnQgbmV3IGZyYW1lIGltbWVkaWF0ZWx5XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjb25zdCBkcmF3TG9vcCA9IGFzeW5jICgpID0+IHsgLy8gbWFpbiBzY3JlZW4gcmVmcmVzaCBsb29wXHJcbiAgICAgICAgICAgIGlmICghZG9tLnZpZGVvLnBhdXNlZCkge1xyXG4gICAgICAgICAgICAgIHRoaXMuaW50ZXJwb2xhdGVkID0gdGhpcy5IX09CSi5uZXh0KHRoaXMuSF9PQkoucmVzdWx0KTsgLy8gc21vb3RoZW4gcmVzdWx0IHVzaW5nIGxhc3Qta25vd24gcmVzdWx0c1xyXG4gICAgICAgICAgICAgIC8vIHJlc2V0IGNhbnZhc1xyXG4gICAgICAgICAgICAgIGNvbnN0IGNvbnRleHQgPSBkb20uY2FudmFzLmdldENvbnRleHQoJzJkJywgeyB3aWxsUmVhZEZyZXF1ZW50bHk6IHRydWUgfSkgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgICAgICAgICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIGRvbS5jYW52YXMud2lkdGgsIGRvbS5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICBhd2FpdCB0aGlzLkhfT0JKLmRyYXcuYWxsKGRvbS5jYW52YXMsIHRoaXMuaW50ZXJwb2xhdGVkKTsgLy8gZHJhdyBsYWJlbHMsIGJveGVzLCBsaW5lcywgZXRjLlxyXG4gICAgICAgICAgICAgIHRoaXMuZXZlbnRFbWl0KHRoaXMuaW50ZXJwb2xhdGVkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBub3cgPSB0aGlzLkhfT0JKLm5vdygpO1xyXG4gICAgICAgICAgICBmcHMuZHJhd0ZQUyA9IE1hdGgucm91bmQoMTAwMCAqIDEwMDAgLyAobm93IC0gdGltZXN0YW1wLmRyYXcpKSAvIDEwMDA7XHJcbiAgICAgICAgICAgIHRpbWVzdGFtcC5kcmF3ID0gbm93O1xyXG4gICAgICAgICAgICB0aGlzLmlzU3RhcnQgJiYgc2V0VGltZW91dChkcmF3TG9vcCwgdGhpcy5mcHMpOyAvLyB1c2UgdG8gc2xvdyBkb3duIHJlZnJlc2ggZnJvbSBtYXggcmVmcmVzaCByYXRlIHRvIHRhcmdldCBvZiAzMCBmcHNcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBhd2FpdCB0aGlzLkhfT0JKLndhcm11cCgpOyAvLyB3YXJtdXAgZnVuY3Rpb24gdG8gaW5pdGlhbGl6ZSBiYWNrZW5kIGZvciBmdXR1cmUgZmFzdGVyIGRldGVjdGlvblxyXG4gICAgICAgICAgYXdhaXQgd2ViQ2FtKCk7IC8vIHN0YXJ0IHdlYmNhbVxyXG4gICAgICAgICAgdGhpcy5zdGF0dXModHJ1ZSwgZmFsc2UpO1xyXG4gICAgICAgICAgYXdhaXQgdGhpcy5kZXRlY3Rpb25Mb29wKCk7IC8vIHN0YXJ0IGRldGVjdGlvbiBsb29wXHJcbiAgICAgICAgICBhd2FpdCBkcmF3TG9vcCgpOyAvLyBzdGFydCBkcmF3IGxvb3BcclxuICAgICAgICAgIEFTX0NPTVBMRVRFKGFzLCB0cnVlKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgICAgICB0aGlzLnN0YXR1cyhmYWxzZSwgZmFsc2UpO1xyXG4gICAgICAgICAgdGhpcy5ldmVudEVtaXQobnVsbCwgZXJyb3IpO1xyXG4gICAgICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlLCBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJ1bigpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBzdG9wXHJcbiAgICogQHJldHVybiBBc3luY1N1YmplY3RcclxuICAgKi9cclxuICBwdWJsaWMgc3RvcCgpOiBBc3luY1N1YmplY3Q8YW55PiB7XHJcbiAgICB0aGlzLmV2ZW50RW1pdChudWxsKVxyXG4gICAgdGhpcy5zdGF0dXMoZmFsc2UsIGZhbHNlKTtcclxuICAgIGNvbnN0IGFzID0gbmV3IEFzeW5jU3ViamVjdDxhbnk+KCk7XHJcbiAgICB0cnkge1xyXG4gICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnJBRl9JRCk7XHJcbiAgICAgICh0aGlzLnZpZGVvPy5uYXRpdmVFbGVtZW50Py5zcmNPYmplY3QgYXMgYW55KT8uZ2V0VHJhY2tzKCk/LmZvckVhY2goKHRyYWNrOiBhbnkpID0+IHtcclxuICAgICAgICB0cmFjaz8uc3RvcCgpO1xyXG4gICAgICAgIEFTX0NPTVBMRVRFKGFzLCB0cnVlKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICAgIHRoaXMuZXZlbnRFbWl0KGZhbHNlLCBlcnJvcik7XHJcbiAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSwgZXJyb3IpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcGxheVxyXG4gICAqIEByZXR1cm4gQXN5bmNTdWJqZWN0XHJcbiAgICovXHJcbiAgcHVibGljIHBsYXkoKTogQXN5bmNTdWJqZWN0PGFueT4ge1xyXG4gICAgY29uc3QgYXMgPSBuZXcgQXN5bmNTdWJqZWN0PGFueT4oKTtcclxuICAgIGlmICh0aGlzLmlzUGF1c2UpIHtcclxuICAgICAgdGhpcy52aWRlbz8ubmF0aXZlRWxlbWVudD8ucGxheSgpO1xyXG4gICAgICB0aGlzLmRldGVjdGlvbkxvb3AoKTtcclxuICAgICAgQVNfQ09NUExFVEUoYXMsIHRydWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlKTtcclxuICAgIH1cclxuICAgIHJldHVybiBhcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHBhdXNlXHJcbiAgICogQHJldHVybiBBc3luY1N1YmplY3QgXHJcbiAgICovXHJcbiAgcHVibGljIHBhdXNlKCk6IEFzeW5jU3ViamVjdDxhbnk+IHtcclxuICAgIGNvbnN0IGFzID0gbmV3IEFzeW5jU3ViamVjdDxhbnk+KCk7XHJcbiAgICBpZiAodGhpcy5pc1N0YXJ0KSB7XHJcbiAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuckFGX0lEKTtcclxuICAgICAgdGhpcy52aWRlbz8ubmF0aXZlRWxlbWVudD8ucGF1c2UoKTtcclxuICAgICAgQVNfQ09NUExFVEUoYXMsIHRydWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlKTtcclxuICAgIH1cclxuICAgIHJldHVybiBhcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGxvYWRJbWFnZVxyXG4gICAqIEBwYXJhbSBzcmMgXHJcbiAgICovXHJcbiAgcHVibGljIGxvYWRJbWFnZShzcmM6IHN0cmluZyk6IEFzeW5jU3ViamVjdDxhbnk+IHtcclxuICAgIGxldCBhcyA9IG5ldyBBc3luY1N1YmplY3Q8YW55PigpO1xyXG5cclxuICAgIC8vIFNldCB0aGUgc3JjIG9mIHRoaXMgSW1hZ2Ugb2JqZWN0LlxyXG4gICAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuXHJcbiAgICAvLyBTZXR0aW5nIGNyb3NzIG9yaWdpbiB2YWx1ZSB0byBhbm9ueW1vdXNcclxuICAgIGltYWdlLnNldEF0dHJpYnV0ZSgnY3Jvc3NPcmlnaW4nLCAnYW5vbnltb3VzJyk7XHJcblxyXG4gICAgLy8gU2V0IHNyY1xyXG4gICAgaW1hZ2Uuc3JjID0gc3JjO1xyXG5cclxuICAgIC8vIFdoZW4gb3VyIGltYWdlIGhhcyBsb2FkZWQuXHJcbiAgICBpbWFnZS5vbmxvYWQgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIC8vIExvYWRpbmcgb25cclxuICAgICAgdGhpcy5zdGF0dXMoZmFsc2UsIHRydWUpO1xyXG5cclxuICAgICAgLy8gbmV3IEh1bWFuXHJcbiAgICAgIGxldCBodW1hbiA9IG5ldyBIdW1hbih0aGlzLmh1bWFuKTsgLy8gY3JlYXRlIGluc3RhbmNlIG9mIGh1bWFuIHdpdGggb3ZlcnJpZGVzIGZyb20gdXNlciBjb25maWd1cmF0aW9uXHJcbiAgICAgIHRoaXMub3ZlcnJpZGVFbnYoaHVtYW4pO1xyXG4gICAgICB0aGlzLm92ZXJyaWRlRHJhdyhodW1hbik7XHJcblxyXG4gICAgICAvLyBkcmF3XHJcbiAgICAgIGNvbnN0IGRyYXcgPSBhc3luYyAoKSA9PiB7IC8vIG1haW4gc2NyZWVuIHJlZnJlc2ggbG9vcFxyXG4gICAgICAgIHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnJztcclxuICAgICAgICB0aGlzLnZpZGVvLm5hdGl2ZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LnN0eWxlLm1heFdpZHRoID0gJzEwMCUnO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQud2lkdGggPSBpbWFnZS5uYXR1cmFsV2lkdGggPz8gaW1hZ2Uud2lkdGggPz8gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aDtcclxuICAgICAgICB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LmhlaWdodCA9IGltYWdlLm5hdHVyYWxIZWlnaHQgPz8gaW1hZ2UuaGVpZ2h0ID8/IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgIGNvbnN0IGludGVycG9sYXRlZCA9IGh1bWFuLm5leHQoaHVtYW4ucmVzdWx0KTsgLy8gc21vb3RoZW4gcmVzdWx0IHVzaW5nIGxhc3Qta25vd24gcmVzdWx0c1xyXG4gICAgICAgIGlmIChodW1hbi5jb25maWcuZmlsdGVyLmZsaXApIHtcclxuICAgICAgICAgIGh1bWFuLmRyYXcuY2FudmFzKGludGVycG9sYXRlZC5jYW52YXMgYXMgSFRNTENhbnZhc0VsZW1lbnQsIHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQpOyAvLyBkcmF3IHByb2Nlc3NlZCBpbWFnZSB0byBzY3JlZW4gY2FudmFzXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGh1bWFuLmRyYXcuY2FudmFzKGltYWdlLCB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50KTsgLy8gZHJhdyBvcmlnaW5hbCB2aWRlbyB0byBzY3JlZW4gY2FudmFzIC8vIGJldHRlciB0aGFuIHVzaW5nIHByb2Nlc2VkIGltYWdlIGFzIHRoaXMgbG9vcCBoYXBwZW5zIGZhc3RlciB0aGFuIHByb2Nlc3NpbmcgbG9vcFxyXG4gICAgICAgIH1cclxuICAgICAgICBhd2FpdCBodW1hbi5kcmF3LmFsbCh0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LCBpbnRlcnBvbGF0ZWQpOyAvLyBkcmF3IGxhYmVscywgYm94ZXMsIGxpbmVzLCBldGMuXHJcbiAgICAgICAgdGhpcy5ldmVudEVtaXQoaW50ZXJwb2xhdGVkKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gcnVuXHJcbiAgICAgIGF3YWl0IGh1bWFuLmRldGVjdChpbWFnZSlcclxuICAgICAgYXdhaXQgZHJhdygpO1xyXG4gICAgICBjb25zdCBsb29wID0gc2V0SW50ZXJ2YWwoYXN5bmMgKCkgPT4gYXdhaXQgZHJhdygpLCB0aGlzLmZwcyk7ICAvLyB1c2UgdG8gc2xvdyBkb3duIHJlZnJlc2ggZnJvbSBtYXggcmVmcmVzaCByYXRlIHRvIHRhcmdldCBvZiAzMCBmcHNcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbChsb29wKTtcclxuICAgICAgICB0aGlzLnN0YXR1cyhmYWxzZSwgZmFsc2UpO1xyXG4gICAgICAgIEFTX0NPTVBMRVRFKGFzLCB0cnVlKTtcclxuICAgICAgfSwgdGhpcy50aW1lb3V0RGV0ZWN0KTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gZXJyb3JcclxuICAgIGltYWdlLm9uZXJyb3IgPSAoZXJyb3I6IGFueSkgPT4gQVNfQ09NUExFVEUoYXMsIGZhbHNlLCBlcnJvcik7XHJcblxyXG4gICAgcmV0dXJuIGFzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogZG93bmxvYWRcclxuICAgKiBAcGFyYW0gZmlsZU5hbWUgXHJcbiAgICogQHJldHVybiBBc3luY1N1YmplY3RcclxuICAgKi9cclxuICBwdWJsaWMgZG93bmxvYWQoZmlsZU5hbWU6IHN0cmluZyk6IEFzeW5jU3ViamVjdDx7IHVybDogc3RyaW5nLCBlbDogSFRNTENhbnZhc0VsZW1lbnQgfT4ge1xyXG4gICAgY29uc3QgYXMgPSBuZXcgQXN5bmNTdWJqZWN0PHsgdXJsOiBzdHJpbmcsIGVsOiBIVE1MQ2FudmFzRWxlbWVudCB9PigpXHJcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgIGNhbnZhcy53aWR0aCA9IHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudC52aWRlb1dpZHRoO1xyXG4gICAgY2FudmFzLmhlaWdodCA9IHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudC52aWRlb0hlaWdodDtcclxuICAgIC8vIGRyYXcgbGFiZWxzLCBib3hlcywgbGluZXMsIGV0Yy5cclxuICAgIGNvbnN0IGxvb3AgPSBzZXRJbnRlcnZhbChhc3luYyAoKSA9PiB7XHJcbiAgICAgIC8vIEdldCBhIDJEIGRyYXdpbmcgY29udGV4dCBmb3IgdGhlIGNhbnZhcy5cclxuICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJywgeyB3aWxsUmVhZEZyZXF1ZW50bHk6IHRydWUgfSkgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgICAvLyBEcmF3IGltYWdlXHJcbiAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy52aWRlby5uYXRpdmVFbGVtZW50LCAwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICBhd2FpdCB0aGlzLkhfT0JKLmRyYXcuYWxsKGNhbnZhcywgdGhpcy5pbnRlcnBvbGF0ZWQpXHJcbiAgICAgIGNvbnN0IGRhdGFVUkwgPSBjYW52YXMudG9EYXRhVVJMKGBpbWFnZS8ke2ZpbGVOYW1lPy5zcGxpdCgnLicpPy5zbGljZSgtMSk/LnRvU3RyaW5nKCl9YCk7XHJcbiAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgIGxpbmsuZG93bmxvYWQgPSBmaWxlTmFtZTtcclxuICAgICAgbGluay5ocmVmID0gZGF0YVVSTDtcclxuICAgICAgbGluay5jbGljaygpO1xyXG4gICAgICBBU19DT01QTEVURShhcywgeyB1cmw6IGZpbGVOYW1lLCBlbDogdGhpcy5jYW52YXM/Lm5hdGl2ZUVsZW1lbnQgfSk7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwobG9vcCk7XHJcbiAgICB9LCB0aGlzLmZwcyk7ICAvLyB1c2UgdG8gc2xvdyBkb3duIHJlZnJlc2ggZnJvbSBtYXggcmVmcmVzaCByYXRlIHRvIHRhcmdldCBvZiAzMCBmcHNcclxuICAgIGxvb3A7XHJcbiAgICByZXR1cm4gYXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBnZXREZXZpY2VzXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBnZXREZXZpY2VzKGFzOiBBc3luY1N1YmplY3Q8YW55Pik6IHZvaWQge1xyXG4gICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5lbnVtZXJhdGVEZXZpY2VzKCkudGhlbihkZXZpY2VzID0+IHtcclxuICAgICAgbGV0IGNhbWVyYURldmljZXM6IERldmljZVtdID0gW107XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGV2aWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBkZXZpY2UgPSBkZXZpY2VzW2ldO1xyXG4gICAgICAgIGlmIChkZXZpY2Uua2luZCA9PSAndmlkZW9pbnB1dCcpIHtcclxuICAgICAgICAgIGNhbWVyYURldmljZXMucHVzaChkZXZpY2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICB0aGlzLmRldmljZXMubmV4dChjYW1lcmFEZXZpY2VzKTtcclxuICAgICAgaWYgKGNhbWVyYURldmljZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHRoaXMucGxheURldmljZShjYW1lcmFEZXZpY2VzWzBdLmRldmljZUlkLCBhcyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlLCAnTm8gY2FtZXJhIGRldGVjdGVkLicgYXMgYW55KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPdmVycmlkZSBDb25maWdcclxuICAgKi9cclxuICBwcml2YXRlIG92ZXJyaWRlQ29uZmlnKCk6IHZvaWQge1xyXG4gICAgdGhpcy5mcHMgPSB0aGlzLmNvbmZpZz8uZnBzID8/IHRoaXMuZnBzID8/IEZQUztcclxuICAgIHRoaXMudGltZW91dERldGVjdCA9IHRoaXMuY29uZmlnPy50aW1lb3V0RGV0ZWN0ID8/IHRoaXMudGltZW91dERldGVjdCA/PyBUSU1FT1VUX0RFVEVDVDtcclxuICAgIHRoaXMuaXNBdXRvID0gdGhpcy5jb25maWc/LmlzQXV0byA/PyB0aGlzLmlzQXV0byA/PyBmYWxzZTtcclxuICAgIHRoaXMuZW52ID0gT1ZFUlJJREVTKEVOViwgdGhpcy5jb25maWc/LmVudiA/PyB0aGlzLmVudikgYXMgUGFydGlhbDxFbnY+O1xyXG4gICAgdGhpcy5kcmF3ID0gT1ZFUlJJREVTKERSQVdfT1BUSU9OUywgdGhpcy5jb25maWc/LmRyYXcgPz8gdGhpcy5kcmF3KSBhcyBQYXJ0aWFsPERyYXdPcHRpb25zPjtcclxuICAgIHRoaXMuaHVtYW4gPSBPVkVSUklERVMoQ09ORklHLCB0aGlzLmNvbmZpZz8uaHVtYW4gPz8gdGhpcy5odW1hbikgYXMgUGFydGlhbDxDb25maWc+O1xyXG4gICAgdGhpcy5tZWRpYXMgPSBPVkVSUklERVMoTUVESUFTVFJFQU0sIHRoaXMuY29uZmlnPy5tZWRpYXMgPz8gdGhpcy5tZWRpYXMpIGFzIE1lZGlhU3RyZWFtQ29uc3RyYWludHM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPdmVycmlkZSBFbnZcclxuICAgKiBAcmV0dXJuIHZvaWRcclxuICAgKi9cclxuICBwcml2YXRlIG92ZXJyaWRlRW52KGh1bWFuOiBQYXJ0aWFsPEh1bWFuPik6IHZvaWQge1xyXG4gICAgLy8gU2V0IGVudlxyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5lbnYpIHtcclxuICAgICAgKGh1bWFuLmVudiBhcyBhbnkpW2tleV0gPSAodGhpcy5lbnYgYXMgYW55KVtrZXldO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogT3ZlcnJpZGUgZHJhd09wdGlvbnNcclxuICAgKiBAcmV0dXJuIHZvaWRcclxuICAgKi9cclxuICBwcml2YXRlIG92ZXJyaWRlRHJhdyhodW1hbjogUGFydGlhbDxIdW1hbj4pOiB2b2lkIHtcclxuICAgIC8vIFNldCBkcmF3T3B0aW9uc1xyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5kcmF3KSB7XHJcbiAgICAgIChodW1hbi5kcmF3IGFzIGFueSkub3B0aW9uc1trZXldID0gKHRoaXMuZHJhdyBhcyBhbnkpW2tleV07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBzdGF0dXNcclxuICAgKiBAcGFyYW0gaXNTdGFydCBcclxuICAgKiBAcGFyYW0gaXNMb2FkaW5nIFxyXG4gICAqL1xyXG4gIHByaXZhdGUgc3RhdHVzKGlzU3RhcnQ6IGJvb2xlYW4sIGlzTG9hZGluZzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgdGhpcy5pc1N0YXJ0ID0gaXNTdGFydDtcclxuICAgIHRoaXMuaXNMb2FkaW5nID0gaXNMb2FkaW5nO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogZXZlbnRFbWl0XHJcbiAgICogQHBhcmFtIHJlc3BvbnNlIFxyXG4gICAqIEBwYXJhbSBlcnJvciBcclxuICAgKi9cclxuICBwcml2YXRlIGV2ZW50RW1pdChyZXNwb25zZTogYW55ID0gZmFsc2UsIGVycm9yOiBhbnkgPSBmYWxzZSk6IHZvaWQge1xyXG4gICAgKHJlc3BvbnNlICE9PSBmYWxzZSkgJiYgdGhpcy5kYXRhLm5leHQocmVzcG9uc2UgPz8gbnVsbCk7XHJcbiAgICAocmVzcG9uc2UgIT09IGZhbHNlKSAmJiB0aGlzLmV2ZW50LmVtaXQocmVzcG9uc2UgPz8gbnVsbCk7XHJcbiAgICAoZXJyb3IgIT09IGZhbHNlKSAmJiB0aGlzLmVycm9yLmVtaXQoZXJyb3IgPz8gbnVsbCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTdGF0dXMgb2YgY2FtZXJhXHJcbiAgICogQHJldHVybiBib29sZWFuXHJcbiAgICovXHJcbiAgZ2V0IGlzUGF1c2UoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy52aWRlbz8ubmF0aXZlRWxlbWVudD8ucGF1c2VkO1xyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICB0aGlzLnBhdXNlKCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==