import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationComponent } from './application/application.component';
import { FormRenderSubmissionComponent } from './form-render-submission/form-render-submission.component';
import { ViewFormComponent } from './view-form/view-form.component';
import { MaterialModule } from '../Material/material.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    ApplicationComponent,
    FormRenderSubmissionComponent,
    ViewFormComponent
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
    
  ]
})
export class ApplicationModule { }
