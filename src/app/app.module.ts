import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SafePipe } from './safe.pipe';
import { NgxScannerFaceModule } from 'ngx-scanner-face';

@NgModule({
  imports:      [ BrowserModule, FormsModule, NgxScannerFaceModule ],
  declarations: [ AppComponent, SafePipe ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
