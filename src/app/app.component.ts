import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { ServiceProviderService } from './shared/service-provider.service';
import { ToastrService } from 'ngx-toastr';
import { MenuService } from './shared/menu.service';
import { ONE } from '@angular/cdk/keycodes';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app works!';

  isLock: boolean = false;
  menuSummary: any = []; //กลุ่มเมนูสำหรับแสดง
  isLogin = true; //เช็กว่าเข้าสู่ระบบอยู่ไหม
  isChangePassword = false;
  model: any = { username: 'demo', password: 'demo' };
  imageUrl: any = 'app-assets/images/avatar/avatar-7.png';
  username: any = 'demo';
  company: any = 'demo';
  empID: any = 'demo';
  authUser: string = 'false';
  authTimeSheet: string = 'false';
  authDocLogReport: string = 'false';
  authUserLogReport: string = 'false';

  userModel: any = {};

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private serviceProviderService: ServiceProviderService,
    private toastr: ToastrService,
    public menuService: MenuService,
    private http: HttpClient
  ) {
    // this.getIPAddress();
    //this.userModel.username = 'จารุวรรณ';
    // this.userModel.username = 'TH00640801023';
    // this.userModel.password = '8888';
    this.userModel.username = '';
    this.userModel.password = '';
    this.userModel.company = 'SINO';

    if (localStorage.getItem('token_epod_20221006') != null) {
      this.company = localStorage.getItem('company');
      this.username = localStorage.getItem('username');

      let expire = parseInt(localStorage.getItem('expire'));
      this.empID = parseInt(localStorage.getItem('empID'));
      this.authUser = localStorage.getItem('Auth_User');
      this.authTimeSheet = localStorage.getItem('Auth_TimeSheet');
      this.authDocLogReport = localStorage.getItem('Auth_DocLogReport');
      this.authUserLogReport = localStorage.getItem('Auth_UserLogReport');

      if (expire >= 90)
      {
        this.isLogin = true;
        this.isChangePassword = true;
      }
      else
      {
        this.isLogin = false;
        this.isChangePassword = false;
      }
      
    }

    this.isLock = true;
  }

  ngOnInit() {
    // /** spinner starts on init */
    // this.spinner.show();

    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinner.hide();
    // }, 500);

    // this.userModel.username = 'จารุวรรณ';
    // this.userModel.password = '9999';
    // this.userModel.company = 'TEST_STAR_FixedAsset_20220105';

    // this.getIPAddress();
  }

  ipAddress = '';
  getIPAddress(param)
  {
    this.http.get("https://api.ipify.org/?format=json").subscribe((res:any)=>{
      this.ipAddress = res.ip;

      this.createLog(param);
    });
  }

  login() {
    this.spinner.show();

    if (this.userModel.username == 'demo' && this.userModel.password == 'demo') {
      this.spinner.hide();
      localStorage.setItem('category', JSON.stringify({ orderApprove: true, }));
      localStorage.setItem('token_epod_20221006', 'token_epod_20221006');
      localStorage.setItem('company', this.userModel.company);
      localStorage.setItem('username', 'demo');

      this.goToHome();
      window.location.href = "";
    }
    else {

      let param = {
        UserName: this.userModel.username,
        Password: this.userModel.password,
        dbName: this.userModel.company
      };

      this.serviceProviderService.post('register/login', param).subscribe(data => {
        this.spinner.hide();
        let model: any = {};
        model = data;
        // this.viewModel = model;

        if (model.status == 'S') {
          // localStorage.setItem('category', JSON.stringify({ organizationPage: true, userRolePage: true, memberPage: true, createAction: true, readAction: true, updateAction: true, deleteAction: true }));
          localStorage.setItem('token_epod_20221006', JSON.stringify(model.jsonData));
          localStorage.setItem('a', this.userModel.username);
          localStorage.setItem('b', this.userModel.password);
          localStorage.setItem('company', this.userModel.company);
          localStorage.setItem('username', model.objectData.username);

          // this.getIPAddress('Log in');

          window.location.href = "";
        }
        else {
          this.spinner.hide();
          this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
        }

      }, err => {
        this.spinner.hide();
        this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      });
    }
  }

  logout() {
    // this.getIPAddress('Log off');
    
    localStorage.clear();
    window.location.href = "";
  }

  createLog(param) {
    let criteria = {
      "UserInformation": {
        "UserName": localStorage.getItem('a'),
        "Password": localStorage.getItem('b'),
        "empID": localStorage.getItem('empID'),
        "dbName": localStorage.getItem('company'),
      },
      "Operation": param,
      "ClientIP": this.ipAddress,
      "ClientName": ''
    }

    let json = JSON.stringify(criteria);

    this.serviceProviderService.post('api/B1/UserLog', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      // this.viewModel = model;

      if (model.Status) {

        if (param == 'Log off')
          localStorage.clear();

        window.location.href = "";
      }
      else {
        if (param == 'Log off')
          localStorage.clear();

        window.location.href = "";
      }

    }, err => {
      if (param == 'Log off')
          localStorage.clear();

        window.location.href = "";
    });
  }

  menuModel: any = { home: false, issueLog: false };
  goToHome() {

    this.menuModel.home = true;
    this.menuModel.issueLog = false;
    // this.menuService.clearActive();
    this.router.navigate(['']);
  }

  goIssueLog() {

    this.menuModel.home = false;
    this.menuModel.issueLog = true;
    // this.menuService.clearActive();
    this.router.navigate(['event']);
  }

  goToRouting(param) {
    //disable highlight all menu
    // this.reportModel[0].isActive = false;
    this.menuService.clearActive();

    // this.menuSummary.forEach(c => {
    //   c.isActive = false;
    // });

    //set menu active highlight
    param.isActive = true;

    //check type for go to router
    if (param.type == 'N') {
      this.router.navigate([param.routing]);
    }
    else if (param.type == 'P') {
      this.router.navigate([param.routing, param.data]);
    }
    else if (param.type == 'PS') {
      let model = param.data.split(',');
      this.router.navigate([param.routing, model[0], model[1]], { skipLocationChange: true });
    }
    else if (param.type == 'O') {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          special: JSON.stringify(param.data)
        }
      };
      this.router.navigate([param.routing], navigationExtras);
    }
  }

  goToDemoRouting() {
    this.router.navigate(['/demo-routing']);
  }

  goToDemoRoutingParam() {
    this.router.navigate(['/demo-routing-param', 1]);
  }

  goToDemoRoutingParams() {
    this.router.navigate(['/demo-routing-params', 'x', 'y']);
  }

  goToDemoRoutingObject() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify({ 'a': 'a', 'b': 'b' })
      }
    };
    this.router.navigate(['/demo-routing-object'], navigationExtras);
  }

  showSignUp() {
    this.isChangePassword = true;
  }

  changePassword() {
    this.spinner.show();

    let criteria = {
      "UserInformation": {
        "UserName": localStorage.getItem('a'),
        "Password": localStorage.getItem('b'),
        "empID": this.empID,
        "dbName": localStorage.getItem('company'),
      },
      "empID": this.empID,
      "Password": this.userModel.newPassword
      // "FirstName": this.criteriaModel.FirstName,
      // "DateFrom": this.criteriaModel.DateFrom
    }

    this.serviceProviderService.post('api/B1/ResetEmployeePassWord', criteria).subscribe(data => {
      this.spinner.hide();
      let model: any = {};
      model = data;
      // this.viewModel = model;

      if (model.Status) {
        this.backToLogin();
      }
      else {
        this.spinner.hide();
        this.toastr.error(model.Message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
      }
    }, err => {
      this.spinner.hide();
      this.toastr.error(err.message, 'แจ้งเตือนระบบ', { timeOut: 5000 });
    });
  }

  backToLogin() {
    // this.model = {};
    this.isChangePassword = false;
  }

  permission(param) {

    if (param != undefined) {
      let filter = param.filter(c => c.isShow);

      return filter;
    }

    return param;

  }

  listCompany: any = [
    { value: 'SINO', display: 'SINO' },
  ];
  readCompany() {

    // this.criteriaModel.permission = this.permission;
    // this.serviceProviderService.post('news/category/read', this.criteriaModel).subscribe(data => {
    //   let model: any = {};
    //   model = data;
    //   this.listCategory = [{ value: '', display: 'ทั้งหมด' }];
    //   model.objectData.forEach(element => {
    //     this.listCategory.push({ value: element.code, display: element.title });
    //   });
    // }, err => { });
  }
}

