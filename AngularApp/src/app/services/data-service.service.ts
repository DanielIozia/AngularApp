import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private numberSource = new BehaviorSubject<number>(0);
  currentNumber = this.numberSource.asObservable();

  private usersLengthSource = new BehaviorSubject<number>(0);
  currentUsersLength = this.usersLengthSource.asObservable();

  constructor() { }

  changeNumber(number: number) {
    this.numberSource.next(number);
  }

  changeUsersLength(length: number) {
    this.usersLengthSource.next(length);
  }
}
