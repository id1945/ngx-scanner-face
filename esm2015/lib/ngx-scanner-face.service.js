import { __awaiter } from "tslib";
import { Injectable } from '@angular/core';
import { AsyncSubject } from 'rxjs';
import { Human } from 'ngx-scanner-face-human';
import { FPS, ENV, CONFIG, DRAW_OPTIONS, MEDIASTREAM, TIMEOUT_DETECT, } from './ngx-scanner-face.default';
import { AS_COMPLETE } from './ngx-scanner-face.helper';
import * as i0 from "@angular/core";
export class NgxScannerFaceService {
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
                    let human = new Human(baseConfig.human); // create instance of human with overrides from user configuration
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNjYW5uZXItZmFjZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXNjYW5uZXItZmFjZS9zcmMvbGliL25neC1zY2FubmVyLWZhY2Uuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUsvQyxPQUFPLEVBQ0wsR0FBRyxFQUNILEdBQUcsRUFDSCxNQUFNLEVBQ04sWUFBWSxFQUNaLFdBQVcsRUFDWCxjQUFjLEdBQ2YsTUFBTSw0QkFBNEIsQ0FBQztBQUNwQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7O0FBS3hELE1BQU0sT0FBTyxxQkFBcUI7SUFFaEM7Ozs7O09BS0c7SUFDSSxRQUFRLENBQUMsS0FBYTs7UUFDM0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxZQUFZLEVBQXVCLENBQUM7UUFDdkQsTUFBTSxJQUFJLEdBQXdCLEVBQUUsQ0FBQztRQUNyQyxJQUFJLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxNQUFNLEVBQUU7WUFDakIsTUFBQSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQywwQ0FBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3RDLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFDLE1BQU0sTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7Z0JBQ2hDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRTs7b0JBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUM7d0JBQ1IsSUFBSSxFQUFFLE1BQUEsS0FBSyxDQUFDLENBQUMsQ0FBQywwQ0FBRSxJQUFJO3dCQUNwQixJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQzt3QkFDZCxNQUFNLEVBQUUsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLE1BQWdCO3dCQUNoQyxHQUFHLEVBQUUsR0FBRztxQkFDVCxDQUFDLENBQUM7b0JBQ0gsSUFBSSxDQUFBLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxNQUFNLE1BQUssQ0FBQyxHQUFHLENBQUMsRUFBRTt3QkFDM0IsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDbEIsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO3FCQUNuQjtnQkFDSCxDQUFDLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQztZQUNILE9BQU8sTUFBTSxDQUFDO1NBQ2Y7YUFBTTtZQUNMLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEIsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2xCLE9BQU8sTUFBTSxDQUFDO1NBQ2Y7SUFDSCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxTQUFTLENBQ2QsUUFBZ0IsRUFBRSxFQUNsQixVQUE2QjtRQUU3QixJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sRUFBRSxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO1FBQ25ELE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQXdCLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFVLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDbkwsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSyxhQUFhLENBQ25CLElBQVUsRUFDVixVQUE2QjtRQUU3QixpQkFBaUI7UUFDakIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNyQyxJQUFJLFVBQVUsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO1lBQ2xDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFO2dCQUN2QixvQ0FBb0M7Z0JBQ3BDLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7Z0JBQzFCLDBDQUEwQztnQkFDMUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0JBQy9DLDZCQUE2QjtnQkFDN0IsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFTLEVBQUU7O29CQUN4Qiw2REFBNkQ7b0JBQzdELE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ2hELHdCQUF3QjtvQkFDeEIsTUFBTSxDQUFDLEtBQUs7d0JBQ1YsTUFBQSxNQUFBLEtBQUssQ0FBQyxZQUFZLG1DQUFJLEtBQUssQ0FBQyxLQUFLLG1DQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO29CQUNqRSxNQUFNLENBQUMsTUFBTTt3QkFDWCxNQUFBLE1BQUEsS0FBSyxDQUFDLGFBQWEsbUNBQUksS0FBSyxDQUFDLE1BQU0sbUNBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7b0JBQ3BFLDJDQUEyQztvQkFDM0MsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQTZCLENBQUM7b0JBQ2hFLGFBQWE7b0JBQ2IsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDeEQsYUFBYTtvQkFDYixZQUFZO29CQUNaLElBQUksS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGtFQUFrRTtvQkFDM0csT0FBTztvQkFDUCxNQUFNLElBQUksR0FBRyxHQUFTLEVBQUU7d0JBQ3RCLDJCQUEyQjt3QkFDM0IsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQywyQ0FBMkM7d0JBQ3hGLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFOzRCQUM1QixLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FDZixZQUFZLENBQUMsTUFBMkIsRUFDeEMsTUFBTSxDQUNQLENBQUMsQ0FBQyx3Q0FBd0M7eUJBQzVDOzZCQUFNOzRCQUNMLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLDRIQUE0SDt5QkFDL0o7d0JBQ0QsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQyxrQ0FBa0M7d0JBQzlFLE9BQU8sWUFBWSxDQUFDO29CQUN0QixDQUFDLENBQUEsQ0FBQztvQkFFRixNQUFNO29CQUNOLE1BQU0sS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDMUIsSUFBSSxNQUFNLEdBQUcsTUFBTSxJQUFJLEVBQUUsQ0FBQztvQkFDMUIsTUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDLEdBQVMsRUFBRTt3QkFDbEMsTUFBTSxHQUFHLE1BQU0sSUFBSSxFQUFFLENBQUM7b0JBQ3hCLENBQUMsQ0FBQSxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLHFFQUFxRTtvQkFDekYsVUFBVSxDQUFDLEdBQUcsRUFBRTt3QkFDZCxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3BCLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFTLEVBQUUsRUFBRTs0QkFDMUIsT0FBTyxpQ0FDRixNQUFNLEtBQ1QsSUFBSSxFQUFFLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxJQUFJLEVBQ2hCLElBQUksRUFBRSxJQUFJLEVBQ1YsR0FBRyxFQUFFLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQzlCLElBQUksRUFBRSxJQUFJLElBQ1YsQ0FBQzt3QkFDTCxDQUFDLENBQUMsQ0FBQztvQkFDTCxDQUFDLEVBQUUsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUMvQixDQUFDLENBQUEsQ0FBQztnQkFDRixVQUFVO2dCQUNWLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4QyxDQUFDLENBQUM7WUFDRixVQUFVLENBQUMsT0FBTyxHQUFHLENBQUMsS0FBVSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkQsVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNLLGNBQWMsQ0FBQyxVQUE2QjtRQUNsRCxNQUFNLE1BQU0sR0FBRyxDQUFDLEtBQWEsRUFBRSxFQUFFLGVBQUMsT0FBQSxDQUFBLE1BQUMsVUFBa0IsMENBQUcsS0FBSyxDQUFDLEtBQUksSUFBSSxJQUFJLENBQUEsTUFBQyxVQUFrQiwwQ0FBRyxLQUFLLENBQUMsS0FBSSxTQUFTLENBQUEsRUFBQSxDQUFDO1FBQ3BILElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQztZQUFFLFVBQVUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ3hDLElBQUksTUFBTSxDQUFDLGVBQWUsQ0FBQztZQUFFLFVBQVUsQ0FBQyxhQUFhLEdBQUcsY0FBYyxDQUFDO1FBQ3ZFLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUFFLFVBQVUsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ2hELElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQztZQUFFLFVBQVUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ3hDLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUFFLFVBQVUsQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDO1FBQ25ELElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUFFLFVBQVUsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1FBQy9DLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUFFLFVBQVUsQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDO0lBQ3hELENBQUM7O2tIQTlJVSxxQkFBcUI7c0hBQXJCLHFCQUFxQixjQUZwQixNQUFNOzJGQUVQLHFCQUFxQjtrQkFIakMsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEFzeW5jU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBIdW1hbiB9IGZyb20gJ25neC1zY2FubmVyLWZhY2UtaHVtYW4nO1xyXG5pbXBvcnQge1xyXG4gIFNjYW5uZXJGYWNlQ29uZmlnLFxyXG4gIFNjYW5uZXJGYWNlUmVzdWx0LFxyXG59IGZyb20gJy4vbmd4LXNjYW5uZXItZmFjZS5vcHRpb25zJztcclxuaW1wb3J0IHtcclxuICBGUFMsXHJcbiAgRU5WLFxyXG4gIENPTkZJRyxcclxuICBEUkFXX09QVElPTlMsXHJcbiAgTUVESUFTVFJFQU0sXHJcbiAgVElNRU9VVF9ERVRFQ1QsXHJcbn0gZnJvbSAnLi9uZ3gtc2Nhbm5lci1mYWNlLmRlZmF1bHQnO1xyXG5pbXBvcnQgeyBBU19DT01QTEVURSB9IGZyb20gJy4vbmd4LXNjYW5uZXItZmFjZS5oZWxwZXInO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290JyxcclxufSlcclxuZXhwb3J0IGNsYXNzIE5neFNjYW5uZXJGYWNlU2VydmljZSB7XHJcblxyXG4gIC8qKlxyXG4gICAqIEZpbGVzIHRvIGJhc2U2NDogU2Nhbm5lckZhY2VSZXN1bHRbXVxyXG4gICAqIEBwYXJhbSBmaWxlc1xyXG4gICAqIEBwYXJhbSBTY2FubmVyRmFjZVJlc3VsdFxyXG4gICAqIEByZXR1cm5zIFNjYW5uZXJGYWNlUmVzdWx0XHJcbiAgICovXHJcbiAgcHVibGljIHRvQmFzZTY0KGZpbGVzOiBGaWxlW10pOiBBc3luY1N1YmplY3Q8U2Nhbm5lckZhY2VSZXN1bHRbXT4ge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gbmV3IEFzeW5jU3ViamVjdDxTY2FubmVyRmFjZVJlc3VsdFtdPigpO1xyXG4gICAgY29uc3QgZGF0YTogU2Nhbm5lckZhY2VSZXN1bHRbXSA9IFtdO1xyXG4gICAgaWYgKGZpbGVzPy5sZW5ndGgpIHtcclxuICAgICAgT2JqZWN0LmtleXMoZmlsZXMpPy5mb3JFYWNoKChmaWxlLCBpKSA9PiB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlc1tpXSk7XHJcbiAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlc1tpXSk7XHJcbiAgICAgICAgcmVhZGVyLm9ubG9hZCA9IChlKSA9PiB7XHJcbiAgICAgICAgICBkYXRhLnB1c2goe1xyXG4gICAgICAgICAgICBuYW1lOiBmaWxlc1tpXT8ubmFtZSxcclxuICAgICAgICAgICAgZmlsZTogZmlsZXNbaV0sXHJcbiAgICAgICAgICAgIGJhc2U2NDogcmVhZGVyPy5yZXN1bHQgYXMgc3RyaW5nLFxyXG4gICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgaWYgKGZpbGVzPy5sZW5ndGggPT09IGkgKyAxKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5uZXh0KGRhdGEpO1xyXG4gICAgICAgICAgICByZXN1bHQuY29tcGxldGUoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdC5uZXh0KFtdKTtcclxuICAgICAgcmVzdWx0LmNvbXBsZXRlKCk7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBMb2FkIGZpbGVzXHJcbiAgICogQHBhcmFtIGZpbGVzXHJcbiAgICogQHBhcmFtIGNvbmZpZ1xyXG4gICAqIEByZXR1cm4gQXN5bmNTdWJqZWN0XHJcbiAgICovXHJcbiAgcHVibGljIGxvYWRGaWxlcyhcclxuICAgIGZpbGVzOiBGaWxlW10gPSBbXSxcclxuICAgIGJhc2VDb25maWc6IFNjYW5uZXJGYWNlQ29uZmlnXHJcbiAgKTogQXN5bmNTdWJqZWN0PFNjYW5uZXJGYWNlUmVzdWx0W10+IHtcclxuICAgIHRoaXMub3ZlcnJpZGVDb25maWcoYmFzZUNvbmZpZyk7XHJcbiAgICBjb25zdCBhcyA9IG5ldyBBc3luY1N1YmplY3Q8U2Nhbm5lckZhY2VSZXN1bHRbXT4oKTtcclxuICAgIFByb21pc2UuYWxsKFsuLi5maWxlc10ubWFwKChtKSA9PiB0aGlzLnJlYWRBc0RhdGFVUkwobSwgYmFzZUNvbmZpZykpKS50aGVuKChpbWc6IFNjYW5uZXJGYWNlUmVzdWx0W10pID0+IEFTX0NPTVBMRVRFKGFzLCBpbWcpKS5jYXRjaCgoZXJyb3I6IGFueSkgPT4gQVNfQ09NUExFVEUoYXMsIG51bGwsIGVycm9yKSk7XHJcbiAgICByZXR1cm4gYXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZWFkQXNEYXRhVVJMXHJcbiAgICogQHBhcmFtIGZpbGVcclxuICAgKiBAcGFyYW0gY29uZmlnXHJcbiAgICogQHJldHVybiBQcm9taXNlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSByZWFkQXNEYXRhVVJMKFxyXG4gICAgZmlsZTogRmlsZSxcclxuICAgIGJhc2VDb25maWc6IFNjYW5uZXJGYWNlQ29uZmlnXHJcbiAgKTogUHJvbWlzZTxTY2FubmVyRmFjZVJlc3VsdD4ge1xyXG4gICAgLyoqIGRyYXdJbWFnZSAqKi9cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGxldCBmaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgZmlsZVJlYWRlci5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgLy8gU2V0IHRoZSBzcmMgb2YgdGhpcyBJbWFnZSBvYmplY3QuXHJcbiAgICAgICAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAvLyBTZXR0aW5nIGNyb3NzIG9yaWdpbiB2YWx1ZSB0byBhbm9ueW1vdXNcclxuICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ2Nyb3NzT3JpZ2luJywgJ2Fub255bW91cycpO1xyXG4gICAgICAgIC8vIFdoZW4gb3VyIGltYWdlIGhhcyBsb2FkZWQuXHJcbiAgICAgICAgaW1hZ2Uub25sb2FkID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgLy8gR2V0IHRoZSBjYW52YXMgZWxlbWVudCBieSB1c2luZyB0aGUgZ2V0RWxlbWVudEJ5SWQgbWV0aG9kLlxyXG4gICAgICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICAgICAgICAvLyBIVE1MSW1hZ2VFbGVtZW50IHNpemVcclxuICAgICAgICAgIGNhbnZhcy53aWR0aCA9XHJcbiAgICAgICAgICAgIGltYWdlLm5hdHVyYWxXaWR0aCA/PyBpbWFnZS53aWR0aCA/PyBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xyXG4gICAgICAgICAgY2FudmFzLmhlaWdodCA9XHJcbiAgICAgICAgICAgIGltYWdlLm5hdHVyYWxIZWlnaHQgPz8gaW1hZ2UuaGVpZ2h0ID8/IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xyXG4gICAgICAgICAgLy8gR2V0IGEgMkQgZHJhd2luZyBjb250ZXh0IGZvciB0aGUgY2FudmFzLlxyXG4gICAgICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJykgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgICAgICAgLy8gRHJhdyBpbWFnZVxyXG4gICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWFnZSwgMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICAgIC8vIERyYXcgZnJhbWVcclxuICAgICAgICAgIC8vIG5ldyBIdW1hblxyXG4gICAgICAgICAgbGV0IGh1bWFuID0gbmV3IEh1bWFuKGJhc2VDb25maWcuaHVtYW4pOyAvLyBjcmVhdGUgaW5zdGFuY2Ugb2YgaHVtYW4gd2l0aCBvdmVycmlkZXMgZnJvbSB1c2VyIGNvbmZpZ3VyYXRpb25cclxuICAgICAgICAgIC8vIGRyYXdcclxuICAgICAgICAgIGNvbnN0IGRyYXcgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIG1haW4gc2NyZWVuIHJlZnJlc2ggbG9vcFxyXG4gICAgICAgICAgICBsZXQgaW50ZXJwb2xhdGVkID0gaHVtYW4ubmV4dChodW1hbi5yZXN1bHQpOyAvLyBzbW9vdGhlbiByZXN1bHQgdXNpbmcgbGFzdC1rbm93biByZXN1bHRzXHJcbiAgICAgICAgICAgIGlmIChodW1hbi5jb25maWcuZmlsdGVyLmZsaXApIHtcclxuICAgICAgICAgICAgICBodW1hbi5kcmF3LmNhbnZhcyhcclxuICAgICAgICAgICAgICAgIGludGVycG9sYXRlZC5jYW52YXMgYXMgSFRNTENhbnZhc0VsZW1lbnQsXHJcbiAgICAgICAgICAgICAgICBjYW52YXNcclxuICAgICAgICAgICAgICApOyAvLyBkcmF3IHByb2Nlc3NlZCBpbWFnZSB0byBzY3JlZW4gY2FudmFzXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgaHVtYW4uZHJhdy5jYW52YXMoaW1hZ2UsIGNhbnZhcyk7IC8vIGRyYXcgb3JpZ2luYWwgdmlkZW8gdG8gc2NyZWVuIGNhbnZhcyAvLyBiZXR0ZXIgdGhhbiB1c2luZyBwcm9jZXNlZCBpbWFnZSBhcyB0aGlzIGxvb3AgaGFwcGVucyBmYXN0ZXIgdGhhbiBwcm9jZXNzaW5nIGxvb3BcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhd2FpdCBodW1hbi5kcmF3LmFsbChjYW52YXMsIGludGVycG9sYXRlZCk7IC8vIGRyYXcgbGFiZWxzLCBib3hlcywgbGluZXMsIGV0Yy5cclxuICAgICAgICAgICAgcmV0dXJuIGludGVycG9sYXRlZDtcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgLy8gcnVuXHJcbiAgICAgICAgICBhd2FpdCBodW1hbi5kZXRlY3QoaW1hZ2UpO1xyXG4gICAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IGRyYXcoKTtcclxuICAgICAgICAgIGNvbnN0IGxvb3AgPSBzZXRJbnRlcnZhbChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGF3YWl0IGRyYXcoKTtcclxuICAgICAgICAgIH0sIGJhc2VDb25maWcuZnBzKTsgLy8gdXNlIHRvIHNsb3cgZG93biByZWZyZXNoIGZyb20gbWF4IHJlZnJlc2ggcmF0ZSB0byB0YXJnZXQgb2YgMzAgZnBzXHJcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChsb29wKTtcclxuICAgICAgICAgICAgY2FudmFzLnRvQmxvYigoYmxvYjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgcmVzb2x2ZSh7XHJcbiAgICAgICAgICAgICAgICAuLi5yZXN1bHQsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiBmaWxlPy5uYW1lLFxyXG4gICAgICAgICAgICAgICAgZmlsZTogZmlsZSxcclxuICAgICAgICAgICAgICAgIHVybDogVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKSxcclxuICAgICAgICAgICAgICAgIGJsb2I6IGJsb2IsXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSwgYmFzZUNvbmZpZy50aW1lb3V0RGV0ZWN0KTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIFNldCBzcmNcclxuICAgICAgICBpbWFnZS5zcmMgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xyXG4gICAgICB9O1xyXG4gICAgICBmaWxlUmVhZGVyLm9uZXJyb3IgPSAoZXJyb3I6IGFueSkgPT4gcmVqZWN0KGVycm9yKTtcclxuICAgICAgZmlsZVJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPdmVycmlkZSBDb25maWdcclxuICAgKi9cclxuICBwcml2YXRlIG92ZXJyaWRlQ29uZmlnKGJhc2VDb25maWc6IFNjYW5uZXJGYWNlQ29uZmlnKTogdm9pZCB7XHJcbiAgICBjb25zdCBpc051bGwgPSAoZmllbGQ6IHN0cmluZykgPT4gKGJhc2VDb25maWcgYXMgYW55KT8uW2ZpZWxkXSA9PSBudWxsIHx8IChiYXNlQ29uZmlnIGFzIGFueSk/LltmaWVsZF0gPT0gdW5kZWZpbmVkO1xyXG4gICAgaWYgKGlzTnVsbCgnZnBzJykpIGJhc2VDb25maWcuZnBzID0gRlBTO1xyXG4gICAgaWYgKGlzTnVsbCgndGltZW91dERldGVjdCcpKSBiYXNlQ29uZmlnLnRpbWVvdXREZXRlY3QgPSBUSU1FT1VUX0RFVEVDVDtcclxuICAgIGlmIChpc051bGwoJ2lzQXV0bycpKSBiYXNlQ29uZmlnLmlzQXV0byA9IGZhbHNlO1xyXG4gICAgaWYgKGlzTnVsbCgnZW52JykpIGJhc2VDb25maWcuZW52ID0gRU5WO1xyXG4gICAgaWYgKGlzTnVsbCgnZHJhdycpKSBiYXNlQ29uZmlnLmRyYXcgPSBEUkFXX09QVElPTlM7XHJcbiAgICBpZiAoaXNOdWxsKCdodW1hbicpKSBiYXNlQ29uZmlnLmh1bWFuID0gQ09ORklHO1xyXG4gICAgaWYgKGlzTnVsbCgnbWVkaWFzJykpIGJhc2VDb25maWcubWVkaWFzID0gTUVESUFTVFJFQU07XHJcbiAgfVxyXG59XHJcbiJdfQ==