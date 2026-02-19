import { IsNumber } from "class-validator";

export class ShowMetricsDto {

  @IsNumber()
  cumulative_feed: number;

  @IsNumber()
  cumulative_mortality: number;

  @IsNumber()
  mortality_percentage: number;

  @IsNumber()
  current_pig_balance: number;

  @IsNumber()
  fcr: number;

  constructor(cumulative_feed, cumulative_mortality, mortality_percentage, current_pig_balance, fcr){
    this.cumulative_feed = cumulative_feed;
    this.cumulative_mortality = cumulative_mortality;
    this.mortality_percentage = mortality_percentage;
    this.current_pig_balance = current_pig_balance;
    this.fcr = fcr;
  }

}
