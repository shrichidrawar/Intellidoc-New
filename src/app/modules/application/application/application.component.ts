import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, } from '@angular/material/dialog';
import { HttpClient, } from '@angular/common/http';
import { SharedService } from 'src/app/core/services/shared-service/shared.service';
import { Sort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestApiService } from 'src/app/core/request-service/request-api.service';
import { SnackbarService } from 'src/app/core/snack-bar/snackbar.service';
import { AuthenticationService } from 'src/app/core/request-service/auth/authentication.service';
@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})

export class ApplicationComponent implements OnInit {
  displayedColumns: string[] = ['projectName','formName', 'submittedBy', 'status', 'submittedOn', 'action'];
  dataSource: any = new MatTableDataSource([]);

  myControl: FormControl = new FormControl();

  FormList: any;
  deleteFormId: any;
  projectsList: any;
  filteredOptions: any;
  options = [];
  formName: any;
  tableFetchedData: any;
  pageSize: any;
  pageIndex: any;
  username: any;
  totalDocCount: any;
  specific:any;

  tableData: any = {
    name: null,
    status: null,
    projectName : null,
    startDate: null,
    endDate: null,
    by: null,
    page: 0,
    size: 10,
    sortingField: "name",
    sortingOrder: false
}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private Http: HttpClient, private service: SharedService, public dialog: MatDialog, private router: Router, private apiRequest: RequestApiService, private snackbar: SnackbarService, private authenticationService: AuthenticationService) {
    
    const UI = JSON.parse(localStorage.getItem('__UI')!);
    this.username = UI.userName;
    this.specificuserpatient();
  }

  ngOnInit(): void {
    this.specificuserpatient();
    this.getSSPEnabledForms();
    this.initForm();
  }

  // calling api for all submitted forms
  
  specificuserpatient(){
    if(this.username){
      this.apiRequest.getPatientForms(this.username).subscribe((res:any)=>{
        if(res && res.detail && res.detail.length){
          this.FormList=res.detail;
          this.dataSource=new MatTableDataSource(this.FormList);
          this.dataSource.paginator=this.paginator;
        }
      })
    }
    else if(!this.username){
      this.apiRequest.getAllSubmittedForms().subscribe((res:any)=>{
        if(res && res.detail && res.detail.length){
          this.FormList=res.detail;
          this.dataSource=new MatTableDataSource(this.FormList);
          this.dataSource.paginator=this.paginator;
        }
      },error =>{
        this.snackbar.open('Failed To Fetch the Form List ..!','',{type:'warning'});
      })
    }
  }

  //calling api for deleting Form
  deleteForm(element: any) {
    // this.apiRequest.deleteSubmittedForm(element.id).subscribe((res:any) => {
    //   if (res) {
    //     if (res.status === 'E') {
    //       this.snackbar.open('failed to delete Form', "", { type: 'warning' });
    //     }
    //     else if (res.status === 'S' && res.description) {
    //       this.snackbar.open(res.description, '', { type: 'warning' });
    //     }
    //   }
    //   this.specificuserpatient();
    // })
  }

  //for calling list of self service enabled projects 
  getSSPEnabledForms() {

    this.apiRequest.getSSPEnabledProjects(this.username).subscribe((res:any) => {
      if (res && res.detail && res.detail.length) {
        this.projectsList = res.detail;
        console.log(this.projectsList);
      }
    }, error => {
      this.snackbar.open('Failed To Fetch the Form List ...!', '', { type: 'warning' });
    })
  }

  render() {
    this.router.navigate(['./home/application/render-form'])

  }

  

  initForm() {
    this.myControl.valueChanges
      .pipe()
      .subscribe(response => {
        if (response) {
          this.filterData(response);
        } else {
          this.filteredOptions = this.options;
        }
      })
  }

  filterData(enteredData: string) {
    this.filteredOptions = this.options.filter((item: any) => {
      return item.toLowerCase().indexOf(enteredData.toLowerCase()) > -1
    })
  }


  selected(e: any) {
    for (var projects of this.projectsList) {
      if (projects.project == e.option.value) {
        this.formName = projects.selfServiceForm;
      }
    }
    this.service.sendFormName(this.formName,e.option.value);
  }

  // filter for table

  private formatDate(dateObj:any) {
    let givenDate = new Date(dateObj);
    let month = givenDate.getMonth() + 1;
    let days = givenDate.getDate();
    let dateFormat = (month < 10 ? '0' : '') + month + '/' + (days < 10 ? '0' : '') + days + '/' + givenDate.getFullYear();
    return dateFormat;
  }

  searchByFilter(searchFilter:any) {
    const obj = {
      name: this.tableData.name,
      by: this.tableData.by,
      projectName:this.tableData.projectName,
      status: this.tableData.status,
      startDate: this.formatDate(this.tableData.startDate),
      endDate: this.formatDate(this.tableData.endDate),
      page: 0,
      size: 10,
      sortingField: "formName",
      sortingOrder: false,
    }
    this.fetchTableData();
  }

  fetchTableData() {
    this.apiRequest.searchFilter(this.tableData).subscribe((res:any) => {
      console.log(res);
      this.tableFetchedData = res;
      
      this.dataSource.data = this.tableFetchedData.detail.submittedForms;
      this.totalDocCount = this.tableFetchedData.detail.totalDocument;
      this.pageIndex = this.tableFetchedData.detail.currentPage;
    })
  }

  pageSizeChange(tableFilter:any) {
    this.tableData.size = tableFilter.pageSize;
    this.tableData.page = tableFilter.pageIndex;
    this.fetchTableData();
  }

  clearFilter(filterBy:any) {
    filterBy.projectName = '',
      filterBy.name = '',
      filterBy.status = [],
      filterBy.startDate = '',
      filterBy.endDate = '',
      filterBy.by = '',
      filterBy.page = 0,
      filterBy.size = 10,
      filterBy.sortingField = "name",
      filterBy.sortingOrder = true;
  }

  sortData(sort: Sort) {
    this.tableData.sortingField = sort.active;
    if (sort.direction === 'asc') {
      this.tableData.sortingOrder = true;
    }
    else {
      this.tableData.sortingOrder = false;
    }
    this.fetchTableData();
  }

  getSSPEnabledProjects(searchKey:any) {
    return this.projectsList.filter((proj:any) => proj.project.toLowerCase( ).includes(searchKey.toLowerCase( )) )
  }

}









