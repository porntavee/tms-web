import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  menu: any = []
  category: any = {
    userRolePage: false,
    memberMobilePage: false,
    memberMobileNotConfirmPage: false,
    setAnswerQuestionsPage: false,
    questionsFromUsersPage: false,
    timelinePage: false,
    notifyMembersPage: false,
    sendNewMemberPage: false,
    sendMessageMemberPage: false,
    frequentlyQuestionsAndAnswersPage: false,
    replyChatMembersPage: false,
    autoReplyPage: false,
  };


  constructor() {
    if (localStorage.getItem('token_epod_20221006') != null) {
      this.category = JSON.parse(localStorage.getItem('category'));
    }
    this.menu = [
      {
        name: 'งานขนส่ง',
        // isActive: true,
        items: [
          { 'name': 'อนุมัติงาน', 'routing': '/order-approve', 'data': '', 'type': 'N', 'isActive': false, 'isShow': this.category?.orderApprove },
          { 'name': 'สร้างงานขนส่ง', 'routing': '/news', 'data': '', 'type': 'N', 'isActive': false, 'isShow': true },
          { 'name': 'สร้างใบคุมรถ', 'routing': '/line-member-confirm', 'data': '', 'type': 'N', 'isActive': false, 'isShow': true },
          { 'name': 'ติดตามสถานะ', 'routing': '/line-tag', 'data': '', 'type': 'N', 'isActive': false, 'isShow': true },
          { 'name': 'นำเข้าคำสั่งส่ง', 'routing': '/line-tag', 'data': '', 'type': 'N', 'isActive': false, 'isShow': true },
        ]
      },
      {
        name: 'ทะเบียน',
        items: [
          { 'name': 'สถานที่รับ/ส่งสินค้า', 'routing': '/line-quest-and-answer-form', 'data': '', 'type': 'N', 'isActive': false, 'isShow': true },
          { 'name': 'ผู้ใช้งาน', 'routing': '/auto-reply', 'data': '', 'type': 'N', 'isActive': false, 'isShow': true },
          { 'name': 'วันหยุด', 'routing': '/auto-reply', 'data': '', 'type': 'N', 'isActive': false, 'isShow': true }
        ]
      },
      {
        name: 'รายงาน',
        items: [
          { 'name': 'Dashboard', 'routing': '/news', 'data': '', 'type': 'N', 'isActive': false, 'isShow': true },
          { 'name': 'Report A', 'routing': '/warning', 'data': '', 'type': 'N', 'isActive': false, 'isShow': true },
          { 'name': 'Report B', 'routing': '/knowledge', 'data': '', 'type': 'N', 'isActive': false, 'isShow': true },
          { 'name': 'Report C', 'routing': '/knowledge-tool', 'data': '', 'type': 'N', 'isActive': false, 'isShow': true },
        ]
      },
      {
        name: 'คืนเอกสาร',
        items: [
          { 'name': 'คืนเอกสาร', 'routing': '/line-message-text-form', 'data': '', 'type': 'N', 'isActive': false, 'isShow': true },
        ]
      },
    ];
  }


  clearActive() {
    this.menu.forEach(c => {
      c.items.forEach(cc => {
        cc.isActive = false;
      })
    });
  }
}
