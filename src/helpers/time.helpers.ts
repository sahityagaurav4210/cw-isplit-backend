class TimeHelper {
  private currentTime: number;

  constructor() {
    this.currentTime = Date.now();
  }

  public plusMinutes(minutes: number): number {
    return this.currentTime + minutes * 60 * 1000;
  }

  public plusHours(hours: number): number {
    return this.currentTime + hours * 60 * 60 * 1000;
  }

  public plusDays(days: number): number {
    return this.currentTime + days * 24 * 60 * 60 * 1000;
  }

  public plusWeeks(weeks: number): number {
    return this.currentTime + weeks * 7 * 24 * 60 * 60 * 1000;
  }

  public plusMonths(months: number): number {
    return this.currentTime + months * 30 * 24 * 60 * 60 * 1000;
  }

  public plusYears(years: number): number {
    return this.currentTime + years * 365 * 24 * 60 * 60 * 1000;
  }

  public getCurrentTime(): number {
    return this.currentTime;
  }
}

export default TimeHelper;
