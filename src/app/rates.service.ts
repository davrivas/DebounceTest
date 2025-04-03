import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import moment from 'moment';
import { Rate } from './rate.model';

@Injectable({ providedIn: 'root' })
export class RatesService {
  private readonly rates: Map<string, number> = new Map<string, number>();

  constructor() {
    this.rates.set(
      moment().toDate().toDateString(),
      this.getRandomNumber(3500, 4750)
    );

    for (let i = 1; i <= 365; i++) {
      this.rates.set(
        moment().add(i, 'day').toDate().toDateString(),
        this.getRandomNumber(3500, 4750)
      );
      this.rates.set(
        moment().subtract(i, 'day').toDate().toDateString(),
        this.getRandomNumber(3500, 4750)
      );
    }
  }

  getRate(date: Date): Observable<Rate> {
    const value = this.rates.get(date.toDateString()) ?? 0;
    const returnValue: Rate = {
      date: date,
      rate: value,
    };
    return of(returnValue).pipe(delay(750));
  }

  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
