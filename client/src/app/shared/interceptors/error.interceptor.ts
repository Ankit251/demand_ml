import { Injectable, ErrorHandler } from '@angular/core';
import firebase from 'firebase/app';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErroInterceptor implements HttpInterceptor {

  constructor(
    public errorHandler: ErrorHandler,
    private router: Router,
    private authService: AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403 || error.status === 400) {

          // firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
          // .then( (idToken) => {
          //   console.log(idToken);

          // }).catch( (error) => {
          //   console.log(error);
          // });

          localStorage.clear()
          window.location.reload();
          //this.router.navigateByUrl("/login")
          // localStorage.setItem('isLoggedIn', 'null');
          // 401 handled in auth.interceptor
        }
        return throwError(error);
      })
    );
  }
}