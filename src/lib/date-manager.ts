import { startOfMonth, endOfMonth, subMonths, addMonths } from "date-fns";

export class DateManager {
  constructor(private date: Date = new Date()) { }

  static create(date?: Date) {
    return new DateManager(date);
  }

  get value() {
    return this.date;
  }

  get month() {
    return {
      start: startOfMonth(this.date),
      end: endOfMonth(this.date),
      prev: {
        start: startOfMonth(subMonths(this.date, 1)),
        end: endOfMonth(subMonths(this.date, 1))
      },
      next: {
        start: startOfMonth(addMonths(this.date, 1)),
        end: endOfMonth(addMonths(this.date, 1))
      },
    };
  }
}

