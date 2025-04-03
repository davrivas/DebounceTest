import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import moment from 'moment';
import { RatesService } from './rates.service';
import { Rate } from './rate.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  private dateSubject = new Subject<Date>();
  private readonly debounceTimeMs = 500; // Set the debounce time (in milliseconds)
  rate: Rate | null = null;
  date: Date = moment().toDate();
  isLoading: boolean = false;

  constructor(private readonly ratesService: RatesService) {}

  ngOnInit() {
    this.dateSubject
      .pipe(debounceTime(this.debounceTimeMs), distinctUntilChanged())
      .subscribe((date) => {
        this.changeDate(date);
      });
    this.isLoading = true;
    this.changeDate(this.date);
  }

  ngOnDestroy() {
    this.dateSubject.complete();
  }

  changeDate(date: Date) {
    console.log('changing date...', date.toDateString());
    this.isLoading = true;
    this.rate = null;
    this.ratesService.getRate(date).subscribe((data) => {
      this.rate = data;
      this.isLoading = false;
    });
  }

  today() {
    this.isLoading = true;
    this.date = moment().toDate();
    this.dateSubject.next(this.date);
  }

  prev() {
    this.isLoading = true;
    this.date = moment(this.date).subtract(1, 'day').toDate();
    this.dateSubject.next(this.date);
  }

  next() {
    this.isLoading = true;
    this.date = moment(this.date).add(1, 'day').toDate();
    this.dateSubject.next(this.date);
  }
}
