import { Component, ViewChild } from '@angular/core';
import { Device, NgxScannerFaceComponent, NgxScannerFaceService, Result, ScannerFaceConfig, ScannerFaceResult } from 'ngx-scanner-face';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('action', { static: false }) action!: NgxScannerFaceComponent;

  public scannerConfig: ScannerFaceConfig = {
    isAuto: false,
    human: {
      face: {
        detector: {
          maxDetected: 20,
        },
      },
    },
    constraints: {
      video: {
        width: { ideal: window.innerWidth > 1280 ? 1280 : window.innerWidth - 20 }
      }
    }
  };

  public scannerResult: ScannerFaceResult[] = [];
  public base64 = '';

  constructor(private face: NgxScannerFaceService) {
  }

  public onEvent(result: Result): void {
    console.log(result)
    // this.base64 = result.base64; // only frame 
    this.face.streamToBase64(result).subscribe((res: Result) => {
      this.base64 = res.base64; // origin image + frame
    });
  }

  public handle(action: any, fn: string): void {
    const playDeviceFacingBack = (devices: Device[]) => {
      // front camera or back camera check here!
      const device = devices.find(f => (/back|rear|environment/gi.test(f.label))); // Default Back Facing Camera
      action.playDevice(device ? device.deviceId : devices[0].deviceId);
    }

    if (fn === 'start') {
      action[fn](playDeviceFacingBack).subscribe((r: any) => console.log(fn, r), alert);
    } else {
      action[fn]().subscribe((r: any) => console.log(fn, r), alert);
    }
  }

  public onSelects(files: any) {
    this.face.loadFiles(files, this.scannerConfig, this.percentage, this.quality).subscribe((res) => (this.scannerResult = res));
  }

  public onGetConstraints() {
    const constrains = this.action.getConstraints();
    console.log(constrains);
  }
  
  public applyConstraints() {
    const constrains = this.action.applyConstraints({
      ...this.action.getConstraints(),
      width: 710,
      height: 410,
    });
    console.log(constrains);
  }
}
