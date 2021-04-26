import { InitialState } from "../models/initialState";
import * as actionTypes from "./ActionTypes";

type GlobalAction = {
   type: String,
   payload: any
}

const reducer = (
   state: InitialState,
   action: GlobalAction
): InitialState => {
   switch(action.type) {
     
      case actionTypes.LOAD_WEEKS:
      return {
         ...state,
         weeks: action.payload.weeks,
         week: action.payload.week,
         parts: action.payload.parts
      };
      case actionTypes.LOAD_PARTS:
      return {
         ...state,
         parts: action.payload
      };
      case actionTypes.CHANGE_WEEK:
      return {
         ...state,
         parts: action.payload.parts,
         week: action.payload.week
      };
     
       
   }
   return state
}

export default reducer;
