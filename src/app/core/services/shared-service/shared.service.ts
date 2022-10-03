import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  SSPEnabledFormName: any;
  projectname:any;

  constructor() { }

  sendFormName(data: any,e:any) {
    this.SSPEnabledFormName = data;
  this.projectname=e;
  }

  getFormName() {
    return this.SSPEnabledFormName;
  }
  getprojectname(){
    return this.projectname;
  }



}
