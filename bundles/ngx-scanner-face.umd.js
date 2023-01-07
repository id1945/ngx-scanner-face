(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('ngx-scanner-face-human')) :
    typeof define === 'function' && define.amd ? define('ngx-scanner-face', ['exports', '@angular/core', 'rxjs', 'ngx-scanner-face-human'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["ngx-scanner-face"] = {}, global.ng.core, global.rxjs, global.ngxScannerFaceHuman));
})(this, (function (exports, i0, rxjs, ngxScannerFaceHuman) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
            desc = { enumerable: true, get: function () { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++) {
                if (ar || !(i in from)) {
                    if (!ar)
                        ar = Array.prototype.slice.call(from, 0, i);
                    ar[i] = from[i];
                }
            }
        return to.concat(ar || Array.prototype.slice.call(from));
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }
    function __classPrivateFieldIn(state, receiver) {
        if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function"))
            throw new TypeError("Cannot use 'in' operator on non-object");
        return typeof state === "function" ? receiver === state : state.has(receiver);
    }

    /**
     * Frame speed ms/fps.
     */
    var FPS = 30;
    /**
     * setTimeout 1000ms.
     */
    var TIMEOUT_DETECT = 1000;
    /**
     * user configuration for human, used to fine-tune behavior
     */
    var CONFIG = {
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
    var ENV = {
        perfadd: false, // is performance data showing instant or total values
    };
    /**
     * Draw Options
     */
    var DRAW_OPTIONS = {
        font: 'monospace',
        lineHeight: 20,
    };
    /**
     * MediaStream
    s * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
     */
    var MEDIASTREAM = {
        audio: false,
        video: true
    };

    /**
     * Override Config
     */
    var OVERRIDES = function (defaultConfig, switchConfig) {
        var _b;
        var _a;
        if (switchConfig && ((_a = Object.keys(switchConfig)) === null || _a === void 0 ? void 0 : _a.length)) {
            for (var key in defaultConfig) {
                switchConfig = (switchConfig === null || switchConfig === void 0 ? void 0 : switchConfig.hasOwnProperty(key))
                    ? switchConfig
                    : JSON.parse(JSON.stringify(Object.assign(Object.assign({}, switchConfig), (_b = {}, _b[key] = defaultConfig[key], _b))));
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
    var AS_COMPLETE = function (as, data, error) {
        if (error === void 0) { error = null; }
        error ? as.error(error) : as.next(data);
        as.complete();
    };

    var NgxScannerFaceService = /** @class */ (function () {
        function NgxScannerFaceService() {
        }
        /**
         * Files to base64: ScannerFaceResult[]
         * @param files
         * @param ScannerFaceResult
         * @returns ScannerFaceResult
         */
        NgxScannerFaceService.prototype.toBase64 = function (files) {
            var _a;
            var result = new rxjs.AsyncSubject();
            var data = [];
            if (files === null || files === void 0 ? void 0 : files.length) {
                (_a = Object.keys(files)) === null || _a === void 0 ? void 0 : _a.forEach(function (file, i) {
                    var url = URL.createObjectURL(files[i]);
                    var reader = new FileReader();
                    reader.readAsDataURL(files[i]);
                    reader.onload = function (e) {
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
        };
        /**
         * Load files
         * @param files
         * @param config
         * @return AsyncSubject
         */
        NgxScannerFaceService.prototype.loadFiles = function (files, baseConfig) {
            var _this = this;
            if (files === void 0) { files = []; }
            this.overrideConfig(baseConfig);
            var as = new rxjs.AsyncSubject();
            Promise.all(__spreadArray([], __read(files)).map(function (m) { return _this.readAsDataURL(m, baseConfig); })).then(function (img) { return AS_COMPLETE(as, img); }).catch(function (error) { return AS_COMPLETE(as, null, error); });
            return as;
        };
        /**
         * readAsDataURL
         * @param file
         * @param config
         * @return Promise
         */
        NgxScannerFaceService.prototype.readAsDataURL = function (file, baseConfig) {
            var _this = this;
            /** drawImage **/
            return new Promise(function (resolve, reject) {
                var fileReader = new FileReader();
                fileReader.onload = function () {
                    // Set the src of this Image object.
                    var image = new Image();
                    // Setting cross origin value to anonymous
                    image.setAttribute('crossOrigin', 'anonymous');
                    // When our image has loaded.
                    image.onload = function () { return __awaiter(_this, void 0, void 0, function () {
                        var _a, _b, _c, _d, canvas, ctx, human, draw, result, loop;
                        var _this = this;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    canvas = document.createElement('canvas');
                                    // HTMLImageElement size
                                    canvas.width =
                                        (_b = (_a = image.naturalWidth) !== null && _a !== void 0 ? _a : image.width) !== null && _b !== void 0 ? _b : document.body.clientWidth;
                                    canvas.height =
                                        (_d = (_c = image.naturalHeight) !== null && _c !== void 0 ? _c : image.height) !== null && _d !== void 0 ? _d : document.body.clientHeight;
                                    ctx = canvas.getContext('2d');
                                    // Draw image
                                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                    human = new ngxScannerFaceHuman.Human(baseConfig.human);
                                    draw = function () { return __awaiter(_this, void 0, void 0, function () {
                                        var interpolated;
                                        return __generator(this, function (_e) {
                                            switch (_e.label) {
                                                case 0:
                                                    interpolated = human.next(human.result);
                                                    if (human.config.filter.flip) {
                                                        human.draw.canvas(interpolated.canvas, canvas); // draw processed image to screen canvas
                                                    }
                                                    else {
                                                        human.draw.canvas(image, canvas); // draw original video to screen canvas // better than using procesed image as this loop happens faster than processing loop
                                                    }
                                                    return [4 /*yield*/, human.draw.all(canvas, interpolated)];
                                                case 1:
                                                    _e.sent(); // draw labels, boxes, lines, etc.
                                                    return [2 /*return*/, interpolated];
                                            }
                                        });
                                    }); };
                                    // run
                                    return [4 /*yield*/, human.detect(image)];
                                case 1:
                                    // run
                                    _e.sent();
                                    return [4 /*yield*/, draw()];
                                case 2:
                                    result = _e.sent();
                                    loop = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_e) {
                                            switch (_e.label) {
                                                case 0: return [4 /*yield*/, draw()];
                                                case 1:
                                                    result = _e.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }, baseConfig.fps);
                                    setTimeout(function () {
                                        clearInterval(loop);
                                        canvas.toBlob(function (blob) {
                                            resolve(Object.assign(Object.assign({}, result), { name: file === null || file === void 0 ? void 0 : file.name, file: file, url: URL.createObjectURL(blob), blob: blob }));
                                        });
                                    }, baseConfig.timeoutDetect);
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    // Set src
                    image.src = URL.createObjectURL(file);
                };
                fileReader.onerror = function (error) { return reject(error); };
                fileReader.readAsDataURL(file);
            });
        };
        /**
         * Override Config
         */
        NgxScannerFaceService.prototype.overrideConfig = function (baseConfig) {
            var isNull = function (field) { var _a, _b; return ((_a = baseConfig) === null || _a === void 0 ? void 0 : _a[field]) == null || ((_b = baseConfig) === null || _b === void 0 ? void 0 : _b[field]) == undefined; };
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
        };
        return NgxScannerFaceService;
    }());
    NgxScannerFaceService.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0__namespace, type: NgxScannerFaceService, deps: [], target: i0__namespace.ɵɵFactoryTarget.Injectable });
    NgxScannerFaceService.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0__namespace, type: NgxScannerFaceService, providedIn: 'root' });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0__namespace, type: NgxScannerFaceService, decorators: [{
                type: i0.Injectable,
                args: [{
                        providedIn: 'root',
                    }]
            }] });

    var NgxScannerFaceComponent = /** @class */ (function () {
        function NgxScannerFaceComponent() {
            /**
             * EventEmitter
             */
            this.event = new i0.EventEmitter();
            this.error = new i0.EventEmitter();
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
            this.data = new rxjs.BehaviorSubject({});
            this.devices = new rxjs.BehaviorSubject([]);
        }
        NgxScannerFaceComponent.prototype.ngOnInit = function () {
            this.overrideConfig();
            if (this.src) {
                this.loadImage(this.src);
            }
            else if (this.isAuto) {
                this.start();
            }
        };
        /**
         * start
         * @return AsyncSubject
         */
        NgxScannerFaceComponent.prototype.start = function () {
            var as = new rxjs.AsyncSubject();
            if (this.isStart) {
                // Reject
                AS_COMPLETE(as, false);
            }
            else {
                // mediaDevices
                this.getDevices(as);
            }
            return as;
        };
        /**
         * playDevice
         * @param deviceId
         * @param as
         * @returns
         */
        NgxScannerFaceComponent.prototype.playDevice = function (deviceId, as) {
            var _this = this;
            if (as === void 0) { as = new rxjs.AsyncSubject(); }
            stop();
            if (deviceId && deviceId != 'null') {
                var constraints_1 = {
                    audio: false,
                    video: typeof (this.medias && this.medias.video) === 'boolean' ? { deviceId: deviceId } : Object.assign({ deviceId: deviceId }, this.medias && this.medias.video)
                };
                // MediaStream
                var run = function () { return __awaiter(_this, void 0, void 0, function () {
                    var dom_1, timestamp_1, fps_1, webCam, drawLoop_1, error_1;
                    var _this = this;
                    return __generator(this, function (_t) {
                        switch (_t.label) {
                            case 0:
                                _t.trys.push([0, 5, , 6]);
                                // Loading on
                                this.status(false, true);
                                // new Human
                                this.H_OBJ = new ngxScannerFaceHuman.Human(this.human); // create instance of human with overrides from user configuration
                                this.overrideEnv(this.H_OBJ);
                                this.overrideDraw(this.H_OBJ);
                                dom_1 = {
                                    video: this.video.nativeElement,
                                    canvas: this.canvas.nativeElement
                                };
                                timestamp_1 = { detect: 0, draw: 0, tensors: 0, start: 0 };
                                fps_1 = { detectFPS: 0, drawFPS: 0, frames: 0, averageMs: 0 };
                                webCam = function () { return __awaiter(_this, void 0, void 0, function () {
                                    var stream, ready;
                                    var _this = this;
                                    return __generator(this, function (_t) {
                                        switch (_t.label) {
                                            case 0: return [4 /*yield*/, navigator.mediaDevices.getUserMedia(constraints_1)];
                                            case 1:
                                                stream = _t.sent();
                                                ready = new Promise(function (resolve) { dom_1.video.onloadeddata = function () { return resolve(true); }; });
                                                dom_1.video.srcObject = stream;
                                                void dom_1.video.play();
                                                return [4 /*yield*/, ready];
                                            case 2:
                                                _t.sent();
                                                dom_1.canvas.width = dom_1.video.videoWidth;
                                                dom_1.canvas.height = dom_1.video.videoHeight;
                                                dom_1.canvas.onclick = function () { return dom_1.video.paused ? _this.play() : _this.pause(); }; // pause when clicked on screen and resume on next click
                                                return [2 /*return*/];
                                        }
                                    });
                                }); };
                                this.detectionLoop = function () { return __awaiter(_this, void 0, void 0, function () {
                                    var tensors;
                                    return __generator(this, function (_t) {
                                        switch (_t.label) {
                                            case 0:
                                                cancelAnimationFrame(this.rAF_ID);
                                                if (!!dom_1.video.paused) return [3 /*break*/, 2];
                                                if (timestamp_1.start === 0)
                                                    timestamp_1.start = this.H_OBJ.now();
                                                return [4 /*yield*/, this.H_OBJ.detect(dom_1.video)];
                                            case 1:
                                                _t.sent(); // actual detection; were not capturing output in a local variable as it can also be reached via human.result
                                                tensors = this.H_OBJ.tf.memory().numTensors;
                                                timestamp_1.tensors = tensors;
                                                fps_1.detectFPS = Math.round(1000 * 1000 / (this.H_OBJ.now() - timestamp_1.detect)) / 1000;
                                                fps_1.frames++;
                                                fps_1.averageMs = Math.round(1000 * (this.H_OBJ.now() - timestamp_1.start) / fps_1.frames) / 1000;
                                                timestamp_1.detect = this.H_OBJ.now();
                                                _t.label = 2;
                                            case 2:
                                                if (this.isStart) {
                                                    this.rAF_ID = requestAnimationFrame(this.detectionLoop); // start new frame immediately
                                                }
                                                return [2 /*return*/];
                                        }
                                    });
                                }); };
                                drawLoop_1 = function () { return __awaiter(_this, void 0, void 0, function () {
                                    var context, now;
                                    return __generator(this, function (_t) {
                                        switch (_t.label) {
                                            case 0:
                                                if (!!dom_1.video.paused) return [3 /*break*/, 2];
                                                this.interpolated = this.H_OBJ.next(this.H_OBJ.result); // smoothen result using last-known results
                                                context = dom_1.canvas.getContext('2d', { willReadFrequently: true });
                                                context.clearRect(0, 0, dom_1.canvas.width, dom_1.canvas.height);
                                                return [4 /*yield*/, this.H_OBJ.draw.all(dom_1.canvas, this.interpolated)];
                                            case 1:
                                                _t.sent(); // draw labels, boxes, lines, etc.
                                                this.eventEmit(this.interpolated);
                                                _t.label = 2;
                                            case 2:
                                                now = this.H_OBJ.now();
                                                fps_1.drawFPS = Math.round(1000 * 1000 / (now - timestamp_1.draw)) / 1000;
                                                timestamp_1.draw = now;
                                                this.isStart && setTimeout(drawLoop_1, this.fps); // use to slow down refresh from max refresh rate to target of 30 fps
                                                return [2 /*return*/];
                                        }
                                    });
                                }); };
                                return [4 /*yield*/, this.H_OBJ.warmup()];
                            case 1:
                                _t.sent(); // warmup function to initialize backend for future faster detection
                                return [4 /*yield*/, webCam()];
                            case 2:
                                _t.sent(); // start webcam
                                this.status(true, false);
                                return [4 /*yield*/, this.detectionLoop()];
                            case 3:
                                _t.sent(); // start detection loop
                                return [4 /*yield*/, drawLoop_1()];
                            case 4:
                                _t.sent(); // start draw loop
                                AS_COMPLETE(as, true);
                                return [3 /*break*/, 6];
                            case 5:
                                error_1 = _t.sent();
                                this.status(false, false);
                                this.eventEmit(null, error_1);
                                AS_COMPLETE(as, false, error_1);
                                return [3 /*break*/, 6];
                            case 6: return [2 /*return*/];
                        }
                    });
                }); };
                run();
            }
            else {
                this.stop();
                AS_COMPLETE(as, false);
            }
            return as;
        };
        /**
         * stop
         * @return AsyncSubject
         */
        NgxScannerFaceComponent.prototype.stop = function () {
            var _a, _b, _c, _d;
            this.eventEmit(null);
            this.status(false, false);
            var as = new rxjs.AsyncSubject();
            try {
                cancelAnimationFrame(this.rAF_ID);
                (_d = (_c = (_b = (_a = this.video) === null || _a === void 0 ? void 0 : _a.nativeElement) === null || _b === void 0 ? void 0 : _b.srcObject) === null || _c === void 0 ? void 0 : _c.getTracks()) === null || _d === void 0 ? void 0 : _d.forEach(function (track) {
                    track === null || track === void 0 ? void 0 : track.stop();
                    AS_COMPLETE(as, true);
                });
            }
            catch (error) {
                this.eventEmit(false, error);
                AS_COMPLETE(as, false, error);
            }
            return as;
        };
        /**
         * play
         * @return AsyncSubject
         */
        NgxScannerFaceComponent.prototype.play = function () {
            var _a, _b;
            var as = new rxjs.AsyncSubject();
            if (this.isPause) {
                (_b = (_a = this.video) === null || _a === void 0 ? void 0 : _a.nativeElement) === null || _b === void 0 ? void 0 : _b.play();
                this.detectionLoop();
                AS_COMPLETE(as, true);
            }
            else {
                AS_COMPLETE(as, false);
            }
            return as;
        };
        /**
         * pause
         * @return AsyncSubject
         */
        NgxScannerFaceComponent.prototype.pause = function () {
            var _a, _b;
            var as = new rxjs.AsyncSubject();
            if (this.isStart) {
                cancelAnimationFrame(this.rAF_ID);
                (_b = (_a = this.video) === null || _a === void 0 ? void 0 : _a.nativeElement) === null || _b === void 0 ? void 0 : _b.pause();
                AS_COMPLETE(as, true);
            }
            else {
                AS_COMPLETE(as, false);
            }
            return as;
        };
        /**
         * loadImage
         * @param src
         */
        NgxScannerFaceComponent.prototype.loadImage = function (src) {
            var _this = this;
            var as = new rxjs.AsyncSubject();
            // Set the src of this Image object.
            var image = new Image();
            // Setting cross origin value to anonymous
            image.setAttribute('crossOrigin', 'anonymous');
            // Set src
            image.src = src;
            // When our image has loaded.
            image.onload = function () { return __awaiter(_this, void 0, void 0, function () {
                var human, draw, loop;
                var _this = this;
                return __generator(this, function (_t) {
                    switch (_t.label) {
                        case 0:
                            // Loading on
                            this.status(false, true);
                            human = new ngxScannerFaceHuman.Human(this.human);
                            this.overrideEnv(human);
                            this.overrideDraw(human);
                            draw = function () { return __awaiter(_this, void 0, void 0, function () {
                                var _a, _b, _c, _d, interpolated;
                                return __generator(this, function (_t) {
                                    switch (_t.label) {
                                        case 0:
                                            this.canvas.nativeElement.style.position = '';
                                            this.video.nativeElement.style.display = 'none';
                                            this.canvas.nativeElement.style.maxWidth = '100%';
                                            this.canvas.nativeElement.width = (_b = (_a = image.naturalWidth) !== null && _a !== void 0 ? _a : image.width) !== null && _b !== void 0 ? _b : document.body.clientWidth;
                                            this.canvas.nativeElement.height = (_d = (_c = image.naturalHeight) !== null && _c !== void 0 ? _c : image.height) !== null && _d !== void 0 ? _d : document.body.clientHeight;
                                            interpolated = human.next(human.result);
                                            if (human.config.filter.flip) {
                                                human.draw.canvas(interpolated.canvas, this.canvas.nativeElement); // draw processed image to screen canvas
                                            }
                                            else {
                                                human.draw.canvas(image, this.canvas.nativeElement); // draw original video to screen canvas // better than using procesed image as this loop happens faster than processing loop
                                            }
                                            return [4 /*yield*/, human.draw.all(this.canvas.nativeElement, interpolated)];
                                        case 1:
                                            _t.sent(); // draw labels, boxes, lines, etc.
                                            this.eventEmit(interpolated);
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                            // run
                            return [4 /*yield*/, human.detect(image)];
                        case 1:
                            // run
                            _t.sent();
                            return [4 /*yield*/, draw()];
                        case 2:
                            _t.sent();
                            loop = setInterval(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_t) {
                                switch (_t.label) {
                                    case 0: return [4 /*yield*/, draw()];
                                    case 1: return [2 /*return*/, _t.sent()];
                                }
                            }); }); }, this.fps);
                            setTimeout(function () {
                                clearInterval(loop);
                                _this.status(false, false);
                                AS_COMPLETE(as, true);
                            }, this.timeoutDetect);
                            return [2 /*return*/];
                    }
                });
            }); };
            // error
            image.onerror = function (error) { return AS_COMPLETE(as, false, error); };
            return as;
        };
        /**
         * download
         * @param fileName
         * @return AsyncSubject
         */
        NgxScannerFaceComponent.prototype.download = function (fileName) {
            var _this = this;
            var as = new rxjs.AsyncSubject();
            var canvas = document.createElement('canvas');
            canvas.width = this.video.nativeElement.videoWidth;
            canvas.height = this.video.nativeElement.videoHeight;
            // draw labels, boxes, lines, etc.
            var loop = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                var _a, _b, _c, ctx, dataURL, link;
                return __generator(this, function (_t) {
                    switch (_t.label) {
                        case 0:
                            ctx = canvas.getContext('2d', { willReadFrequently: true });
                            // Draw image
                            ctx.drawImage(this.video.nativeElement, 0, 0, canvas.width, canvas.height);
                            return [4 /*yield*/, this.H_OBJ.draw.all(canvas, this.interpolated)];
                        case 1:
                            _t.sent();
                            dataURL = canvas.toDataURL("image/" + ((_b = (_a = fileName === null || fileName === void 0 ? void 0 : fileName.split('.')) === null || _a === void 0 ? void 0 : _a.slice(-1)) === null || _b === void 0 ? void 0 : _b.toString()));
                            link = document.createElement('a');
                            link.download = fileName;
                            link.href = dataURL;
                            link.click();
                            AS_COMPLETE(as, { url: fileName, el: (_c = this.canvas) === null || _c === void 0 ? void 0 : _c.nativeElement });
                            clearInterval(loop);
                            return [2 /*return*/];
                    }
                });
            }); }, this.fps); // use to slow down refresh from max refresh rate to target of 30 fps
            loop;
            return as;
        };
        /**
         * getDevices
         */
        NgxScannerFaceComponent.prototype.getDevices = function (as) {
            var _this = this;
            navigator.mediaDevices.enumerateDevices().then(function (devices) {
                var cameraDevices = [];
                for (var i = 0; i < devices.length; i++) {
                    var device = devices[i];
                    if (device.kind == 'videoinput') {
                        cameraDevices.push(device);
                    }
                }
                _this.devices.next(cameraDevices);
                if (cameraDevices.length > 0) {
                    _this.playDevice(cameraDevices[0].deviceId, as);
                }
                else {
                    AS_COMPLETE(as, false, 'No camera detected.');
                }
            });
        };
        /**
         * Override Config
         */
        NgxScannerFaceComponent.prototype.overrideConfig = function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
            this.fps = (_c = (_b = (_a = this.config) === null || _a === void 0 ? void 0 : _a.fps) !== null && _b !== void 0 ? _b : this.fps) !== null && _c !== void 0 ? _c : FPS;
            this.timeoutDetect = (_f = (_e = (_d = this.config) === null || _d === void 0 ? void 0 : _d.timeoutDetect) !== null && _e !== void 0 ? _e : this.timeoutDetect) !== null && _f !== void 0 ? _f : TIMEOUT_DETECT;
            this.isAuto = (_j = (_h = (_g = this.config) === null || _g === void 0 ? void 0 : _g.isAuto) !== null && _h !== void 0 ? _h : this.isAuto) !== null && _j !== void 0 ? _j : false;
            this.env = OVERRIDES(ENV, (_l = (_k = this.config) === null || _k === void 0 ? void 0 : _k.env) !== null && _l !== void 0 ? _l : this.env);
            this.draw = OVERRIDES(DRAW_OPTIONS, (_o = (_m = this.config) === null || _m === void 0 ? void 0 : _m.draw) !== null && _o !== void 0 ? _o : this.draw);
            this.human = OVERRIDES(CONFIG, (_q = (_p = this.config) === null || _p === void 0 ? void 0 : _p.human) !== null && _q !== void 0 ? _q : this.human);
            this.medias = OVERRIDES(MEDIASTREAM, (_s = (_r = this.config) === null || _r === void 0 ? void 0 : _r.medias) !== null && _s !== void 0 ? _s : this.medias);
        };
        /**
         * Override Env
         * @return void
         */
        NgxScannerFaceComponent.prototype.overrideEnv = function (human) {
            // Set env
            for (var key in this.env) {
                human.env[key] = this.env[key];
            }
        };
        /**
         * Override drawOptions
         * @return void
         */
        NgxScannerFaceComponent.prototype.overrideDraw = function (human) {
            // Set drawOptions
            for (var key in this.draw) {
                human.draw.options[key] = this.draw[key];
            }
        };
        /**
         * status
         * @param isStart
         * @param isLoading
         */
        NgxScannerFaceComponent.prototype.status = function (isStart, isLoading) {
            this.isStart = isStart;
            this.isLoading = isLoading;
        };
        /**
         * eventEmit
         * @param response
         * @param error
         */
        NgxScannerFaceComponent.prototype.eventEmit = function (response, error) {
            if (response === void 0) { response = false; }
            if (error === void 0) { error = false; }
            (response !== false) && this.data.next(response !== null && response !== void 0 ? response : null);
            (response !== false) && this.event.emit(response !== null && response !== void 0 ? response : null);
            (error !== false) && this.error.emit(error !== null && error !== void 0 ? error : null);
        };
        Object.defineProperty(NgxScannerFaceComponent.prototype, "isPause", {
            /**
             * Status of camera
             * @return boolean
             */
            get: function () {
                var _a, _b;
                return (_b = (_a = this.video) === null || _a === void 0 ? void 0 : _a.nativeElement) === null || _b === void 0 ? void 0 : _b.paused;
            },
            enumerable: false,
            configurable: true
        });
        NgxScannerFaceComponent.prototype.ngOnDestroy = function () {
            this.pause();
        };
        return NgxScannerFaceComponent;
    }());
    NgxScannerFaceComponent.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0__namespace, type: NgxScannerFaceComponent, deps: [], target: i0__namespace.ɵɵFactoryTarget.Component });
    NgxScannerFaceComponent.ɵcmp = i0__namespace.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.0.5", type: NgxScannerFaceComponent, selector: "ngx-scanner-face", inputs: { src: "src", isAuto: "isAuto", fps: "fps", timeoutDetect: "timeoutDetect", medias: "medias", env: "env", draw: "draw", human: "human", config: "config", style: "style", videoStyle: "videoStyle", canvasStyle: "canvasStyle" }, outputs: { event: "event", error: "error" }, viewQueries: [{ propertyName: "video", first: true, predicate: ["video"], descendants: true, static: true }, { propertyName: "canvas", first: true, predicate: ["canvas"], descendants: true, static: true }], exportAs: ["scanner"], ngImport: i0__namespace, template: "<canvas #canvas [style]=\"canvasStyle || style\" style=\"position: absolute\"></canvas><video #video playsinline [style]=\"videoStyle || style\" style=\"background-color: #262626;\"></video><ng-content></ng-content>", isInline: true });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0__namespace, type: NgxScannerFaceComponent, decorators: [{
                type: i0.Component,
                args: [{
                        selector: 'ngx-scanner-face',
                        template: "<canvas #canvas [style]=\"canvasStyle || style\" style=\"position: absolute\"></canvas><video #video playsinline [style]=\"videoStyle || style\" style=\"background-color: #262626;\"></video><ng-content></ng-content>",
                        inputs: ['src', 'isAuto', 'fps', 'timeoutDetect', 'medias', 'env', 'draw', 'human', 'config', 'style', 'videoStyle', 'canvasStyle'],
                        outputs: ['event', 'error'],
                        exportAs: 'scanner',
                        queries: {
                            video: new i0.ViewChild('video', { static: true }),
                            canvas: new i0.ViewChild('canvas', { static: true })
                        }
                    }]
            }] });

    // Models
    var Env = /** @class */ (function (_super) {
        __extends(Env, _super);
        function Env() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Env;
    }(ngxScannerFaceHuman.Env));
    var Human = /** @class */ (function (_super) {
        __extends(Human, _super);
        function Human() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Human;
    }(ngxScannerFaceHuman.Human));

    /**
     * @default ngx-scanner-face
     * @author <DaiDH>
     * @package https://www.npmjs.com/package/ngx-scanner-face
     * @license MIT https://github.com/id1945/ngx-scanner-face/blob/master/LICENSE
     * @copyright <https://github.com/id1945>
    */
    var NgxScannerFaceModule = /** @class */ (function () {
        function NgxScannerFaceModule() {
        }
        return NgxScannerFaceModule;
    }());
    NgxScannerFaceModule.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0__namespace, type: NgxScannerFaceModule, deps: [], target: i0__namespace.ɵɵFactoryTarget.NgModule });
    NgxScannerFaceModule.ɵmod = i0__namespace.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0__namespace, type: NgxScannerFaceModule, declarations: [NgxScannerFaceComponent], exports: [NgxScannerFaceComponent] });
    NgxScannerFaceModule.ɵinj = i0__namespace.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0__namespace, type: NgxScannerFaceModule });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0__namespace, type: NgxScannerFaceModule, decorators: [{
                type: i0.NgModule,
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

    exports.Env = Env;
    exports.Human = Human;
    exports.NgxScannerFaceComponent = NgxScannerFaceComponent;
    exports.NgxScannerFaceModule = NgxScannerFaceModule;
    exports.NgxScannerFaceService = NgxScannerFaceService;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ngx-scanner-face.umd.js.map
