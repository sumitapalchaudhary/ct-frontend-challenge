import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { InviteResponse } from '../dto/invite-response.dto';
import { InviteService, User } from '../service/invite.service';

@Component({
  selector: 'app-invite-list',
  templateUrl: './invite-list.component.html',
  styleUrls: ['./invite-list.component.css']
})
export class InviteListComponent implements OnInit {
  users$: Observable<User[]>;
  state: any;
  display: string[] = [];
  showUsers: boolean = true;
  showInviteStatus: boolean = false;
  
  constructor(
    private inviteService: InviteService,
    private router: Router
    ) {
      this.users$ = this.inviteService.get();
      let navigation: any;
      navigation = this.router.getCurrentNavigation();
      this.state = navigation.extras.state as {
        response: InviteResponse[]
    };
    if(this.state != null){
      this.showInviteStatus = true;
      this.showUsers = false;
    }
  }

  ngOnInit(): void {
    if(this.state != null){
      this.displayInviteStatus();
    }    
  }

  displayInviteStatus(){
    let inviteResponse: InviteResponse[] = this.state.response;
    let success = inviteResponse.filter(i => i.message == "success");
    if(success.length > 0){
      this.display.push(success.length + ' users invited successfully');
    }
    
    inviteResponse.forEach(ir => {
      if(ir.message.includes("already exists")){
        this.display.push(ir.email + ir.message);
      }
      else if(ir.message.includes("internal server error")){
        this.display.push('Error occured while inviting ' + ir.email);
      }
    });
  }
}