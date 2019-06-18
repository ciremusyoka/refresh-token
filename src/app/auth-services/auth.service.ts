import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map, mergeMap, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedInSubject: BehaviorSubject<boolean>;
  userAuthenticated = false;
  public apiURL = 'http://127.0.0.1:8000/';
  public tokenHeaders = new HttpHeaders({ 'Content-type': 'application/x-www-form-urlencoded' });
  public headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  public clientId = 'TdMSDhCkOze7kQmJe3EkWcbjwe225aowhkPCKcNn';

  constructor(private http: HttpClient) {
    this.loggedInSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  }

  loggedInObservable(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  isAuthenticated(): boolean {
    const auth = JSON.parse(localStorage.getItem('user_token'));
    auth ? this.userAuthenticated = true : this.userAuthenticated = false;
    return this.userAuthenticated;
  }


  get_token(data): any {
    const newurl = `${this.apiURL}o/token/`;
    const httpOptions = { headers: this.tokenHeaders };
    return this.http
      .post<any>(newurl, data, httpOptions);
  }

  get_profile(): any {
    // const auth = JSON.parse(localStorage.getItem('user_token'));
    const newurl = `${this.apiURL}api/v1/users/me/profile/`;
    return this.http
      .get(newurl)
      .pipe(
      map(res => {
        console.log(res);
        return res;
      }),
      catchError(this.handleError()));
  }

  getpersonalities(): any {
    const newurl = `${this.apiURL}api/v1/personalities/`;
    return this.http
      .get(newurl, { headers: this.headers });
  }

  token_refresh(): any {
    const auth = JSON.parse(localStorage.getItem('user_token'));
    // tslint:disable-next-line:max-line-length
    const data = `grant_type=${'refresh_token'}&refresh_token=${auth.refresh_token}&client_id=${this.clientId}`;
    const newurl = `${this.apiURL}o/token/`;
    const httpOptions = { headers: this.tokenHeaders };
    return this.http
      .post(newurl, data, httpOptions)
      .pipe((map(res => {
        console.log(res);
        localStorage.setItem('user_token', JSON.stringify(res));
        return res;
      })));
  }

  logout(): any {
    const auth = JSON.parse(localStorage.getItem('user_token'));
    const data = `token=${auth.access_token}&client_id=${this.clientId}`;
    const newurl = `${this.apiURL}o/revoke_token/`;
    const httpOptions = { headers: this.tokenHeaders };
    return this.http
      .post(newurl, data, httpOptions)
      .pipe(
        map(res => {
          localStorage.clear();
          this.loggedInSubject.next(false);
          return res;
        })
      );
  }

  public handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      return of(error as T);
    };
  }
}
