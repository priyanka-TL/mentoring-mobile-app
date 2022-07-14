import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { localKeys } from 'src/app/core/constants/localStorage.keys';
import { LocalStorageService, ToastService } from 'src/app/core/services';
import { SessionService } from 'src/app/core/services/session/session.service';

@Component({
  selector: 'app-session-card',
  templateUrl: './session-card.component.html',
  styleUrls: ['./session-card.component.scss'],
})
export class SessionCardComponent implements OnInit {
  @Input() data: any;
  @Output() onClickEvent = new EventEmitter();
  startDate: string;
  isCreator: boolean;
  buttonConfig;
  
  constructor(private router: Router, private sessionService: SessionService, private toast: ToastService, private localStorage: LocalStorageService) { }
  
  async ngOnInit() {
    this.isCreator = await this.checkIfCreator();
    this.setButtonConfig(this.isCreator);
    if(this.data.startDate>0){//check later
      this.startDate = moment.unix(this.data.startDate).toLocaleString();
    }
  }
 
  setButtonConfig(isCreator: boolean) {
    if(isCreator){
      this.buttonConfig={label:"START",type:"startAction"};
    } else if(!isCreator&&this.data.isEnrolled || !isCreator&&this.data.sessionId){
      this.buttonConfig={label:"JOIN",type:"joinAction"};
    } else {
      this.buttonConfig={label:"ENROLL",type:"enrollAction"};
    }
  }

  async checkIfCreator() {
    let userData = await this.localStorage.getLocalData(localKeys.USER_DETAILS)
    return (this.data.userId == userData._id) ?true : false;
  }
 
  onCardClick(data) {
    let value = {
      data: data,
      type: 'cardSelect',
    }
    this.onClickEvent.emit(value)
  }

  onButtonClick(data,type){
    let value = {
      data: data,
      type:type
    }
    this.onClickEvent.emit(value);
  }
}
