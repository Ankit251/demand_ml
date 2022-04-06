import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  unSavedData = {};
  excelFilters = {
    account: [],
    sku: [],
    sbu: [],
    measure: []
  }

  userData;
  constructor() { }
}
