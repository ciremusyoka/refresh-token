import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './auth-services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'refresh-token';
  signinForm: FormGroup;
  error: any;
  loggedInObservable: Observable<boolean>;

  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
    this.loggedInObservable = authService.loggedInObservable();

    this.signinForm = formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required
      ])),
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit(): void {
    const data = {
      email: this.signinForm.value.email,
      password: this.signinForm.value.password
    };
    // this.authService.loggedInSubject.next(true);
    this.Signin(data);
  }

  logout() {
    this.authService.logout()
      .subscribe(
        res => {
          console.log(res);
        },
        error => {
          console.log(error);
        }
      );
  }

  Signin(data): void {
    // tslint:disable-next-line:max-line-length
    const body = `username=${data.email}&password=${data.password}&grant_type=${'password'}&client_id=${this.authService.clientId}`;
    console.log(body);
    this.authService.get_token(body)
      .subscribe(
        res => {
          console.log(res);
          this.signinForm.reset();
          localStorage.setItem('user_token', JSON.stringify(res));
          // this.authService.userAuthenticated = true;
          this.authService.loggedInSubject.next(true);
        },
        error => {
          this.error = error.statusText;
          console.log(error); }
      ); }

  profile() {
    this.authService.get_profile()
      .subscribe(
        res => {
          console.log(res);
          localStorage.setItem('user_profile', JSON.stringify(res));
        },
        error => {
          console.log(error);
        }
    ); }

  personalities() {
    this.authService.getpersonalities()
      .subscribe(
        res => {
          console.log(res);
        },
        error => {
          console.log(error);
        }
      ); }

}
