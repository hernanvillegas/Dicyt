import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserInterface } from '../Models/User';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private http: HttpClient) { }

  private api_url: string = "http://localhost:3000/api/users";

  private headers: HttpHeaders = new HttpHeaders({
    "Content-type": "aplication/json",
    Authorization: this.getToken()
  });

  loginUser(username: string, password: string): any{
    const url = `${this.api_url}/login?include=user`;
    return this.http.post<any>(url,{username: username, password: password});
  }

  logoutUser(){
    let accessToken = localStorage.getItem('accessToken');
    const url_api = `${this.api_url}/logout?access_token=${accessToken}`;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    return this.http.post<UserInterface>(url_api, {headers: this.headers});
  }

  setUser(user: UserInterface):void {
    let user_string = JSON.stringify(user);
    localStorage.setItem("currentUser", user_string);
  }

  setToken(token):void {
    localStorage.setItem('accessToken', token);
  }

  getToken():string {
    return localStorage.getItem("accessToken");
  }

  getCurrentUser():UserInterface {
    let user_string = localStorage.getItem('currentUser');
    if(!isNullOrUndefined(user_string)){
      let user: UserInterface = JSON.parse(user_string);
      return user;
    }else{
      return null;
    }
  }

  getUsers(){
    return this.http.get<UserInterface[]>(this.api_url, {headers:this.headers});
  }

}
