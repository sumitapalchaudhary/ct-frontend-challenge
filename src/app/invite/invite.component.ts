import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InviteResponse } from '../dto/invite-response.dto';
import { InviteService, User } from '../service/invite.service';
import { NavigationExtras, Router } from '@angular/router';

const users: User[] = [
  { email: 'user0@comtravo.com' },
  { email: 'user1@comtravo.com' },
  { email: 'user2@comtravo.com' },
  { email: 'user3@comtravo.com' },
  { email: 'user4@comtravo.com' },
  { email: 'user5@comtravo.com' },
  { email: 'user6@comtravo.com' },
  { email: 'user7@comtravo.com' },
  { email: 'user8@comtravo.com' },
  { email: 'user9@comtravo.com' },
  { email: 'user10@comtravo.com' }
];

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {
  constructor(
    private inviteService: InviteService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {

    this.getInviteResponses().subscribe(responses => {
      let inviteResponses: InviteResponse[] = [];
      responses.forEach((response: any, idx: number) => {
        if (response instanceof HttpErrorResponse) {
          inviteResponses.push(new InviteResponse(users[idx].email, this.getErrorMessage(response.status)));
        }
        else {
          inviteResponses.push(new InviteResponse(users[idx].email, "success"));
        }
      });

      const navigationExtras: NavigationExtras = {
        state: {
          response: inviteResponses
        }
      };
      
      this.router.navigate(['list'], navigationExtras);
  });
}

  getInviteResponses(): Observable<any> {
    let responses = users.map((user) => {
      return this.inviteService.invite(user).pipe(catchError(this.errorHandler))
    });
    return forkJoin(responses);
  };
  errorHandler(error: HttpErrorResponse) {
    return of(error);
  }

  getErrorMessage(statusCode: number): string {
    if (statusCode == 409) {
      return " already exists";
    }
    return "internal server error"
  }

}
