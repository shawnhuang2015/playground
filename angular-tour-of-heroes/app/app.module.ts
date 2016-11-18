import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { TestModule } from './test.module';

import { FormsModule } from '@angular/forms';

@NgModule({
  imports:      [ BrowserModule, TestModule, FormsModule],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
