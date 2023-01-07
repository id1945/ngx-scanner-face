import { AsyncSubject } from 'rxjs';
import { ScannerFaceConfig, ScannerFaceResult } from './ngx-scanner-face.options';
import * as i0 from "@angular/core";
export declare class NgxScannerFaceService {
    /**
     * Files to base64: ScannerFaceResult[]
     * @param files
     * @param ScannerFaceResult
     * @returns ScannerFaceResult
     */
    toBase64(files: File[]): AsyncSubject<ScannerFaceResult[]>;
    /**
     * Load files
     * @param files
     * @param config
     * @return AsyncSubject
     */
    loadFiles(files: File[] | undefined, baseConfig: ScannerFaceConfig): AsyncSubject<ScannerFaceResult[]>;
    /**
     * readAsDataURL
     * @param file
     * @param config
     * @return Promise
     */
    private readAsDataURL;
    /**
     * Override Config
     */
    private overrideConfig;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxScannerFaceService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgxScannerFaceService>;
}
