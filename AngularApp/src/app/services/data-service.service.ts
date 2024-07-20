// data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private numberSource = new BehaviorSubject<number>(0);
  currentNumber = this.numberSource.asObservable();

  constructor() { }

  changeNumber(number: number) {
    this.numberSource.next(number);
  }
}
