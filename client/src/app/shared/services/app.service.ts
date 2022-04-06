import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  getData(limit = 200, offset = 0) {
    let url = `/api/data?limit=${limit}&offset=${offset}`;
    return this.http.get(url);
  }

  getFilteredData(limit = 200, offset = 0, filterItems) {
    let url = `/api/data/getFilteredData?limit=${limit}&offset=${offset}`;
    return this.http.get(url, { params: filterItems });
  }

  getFilterAccounts(searchQuery) {
    let url = `/api/data/getaccounts?searchQuery=${searchQuery}`;
    return this.http.get(url);
  }

  getFilterSku(searchQuery) {
    let url = `/api/data/getsku?searchQuery=${searchQuery}`;
    return this.http.get(url);
  }

  getFilterSbu(searchQuery) {
    let url = `/api/data/getsbu?searchQuery=${searchQuery}`;
    return this.http.get(url);
  }

  addUser(body, password) {
    let url = `/api/user/adduser?password=${password}`;
    return this.http.post(url, body);
  }

  getUser() {
    let url = `/api/user/getuser`;
    return this.http.get(url);
  }

  deleteUser(id, email) {
    let url = `/api/user/deleteuser?id=${id}&email=${email}`;
    return this.http.delete(url);
  }

  // passwordReset(body) {
  //   let url = `/api/passwordReset`;
  //   return this.http.post(url, body);
  // }

  addRole(body) {
    let url = `/api/user/addrole`;
    return this.http.post(url, body);
  }

  getRole() {
    let url = `/api/user/getrole`;
    return this.http.get(url);
  }

  deleteRole(id) {
    let url = `/api/user/deleterole?id=${id}`;
    return this.http.delete(url);
  }

  getAccounts() {
    let url = `/api/user/getaccounts`;
    return this.http.get(url);
  }

  getAccountDates() {
    let url = `/api/data/dates`;
    return this.http.get(url);
  }

  getExportData(limit = 200, offset = 0, filterItems) {
    let url = `/api/data/export?limit=${limit}&offset=${offset}`;
    return this.http.get(url, { params: filterItems });
  }

  downloadExportedFile() {
    let url = `/api/data/downloadExportedFile`;
    return this.http.get(url);
  }

  getexportStatus() {
    let url = `/api/data/exportStatus`;
    return this.http.get(url);
  }

  updatePOSData(body) {
    let url = "/api/data";
    return this.http.patch(url, body);
  }
}
