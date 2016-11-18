import { NgModule } from '@angular/core';
import { Counter } from './test.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [ ReactiveFormsModule, CommonModule ],
  declarations: [ Counter ],
  exports: [
    Counter
  ]
})

export class TestModule { }
