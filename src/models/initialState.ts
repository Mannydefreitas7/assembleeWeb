import { Part, WeekProgram } from "./wol";

export interface InitialState {
  week: WeekProgram;
  weeks: WeekProgram[];
  parts: Part[];
  loading: boolean;
  changeWeek: any;
}
