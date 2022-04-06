import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = new BehaviorSubject(this.auth.authState);
  user$: Observable<firebase.User | null> = this.user.pipe( 
    switchMap( (user) => user )
  );

  loginStatus;
  constructor(private readonly auth: AngularFireAuth, private http: HttpClient, private router: Router) {
  }
  
  // Sign in with email/password using firebase
  firebaseSignIn(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password)
  }

  // Sign In with express server
  signIn(body):Observable<any> {
    let url = `/api/login`;
    return this.http.post(url, body,{
      observe:'body'
    });
  }

  // Function returns true/false based on token present inside the localstorage
  loggedIn () {
    return !!localStorage.getItem('token');
  }

  logout(): Observable<void> {
    return from( this.auth.signOut());
 }

  
}



