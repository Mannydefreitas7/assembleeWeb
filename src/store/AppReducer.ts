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
     
      case actionTypes.INITIAL_LOAD:
      return {
         ...state,
         weeks: action.payload.weeks,
         week: action.payload.week,
         congregation: action.payload.congregation,
         parts: action.payload.parts,
         user: action.payload.user,
         listener: action.payload.listener
      };
      case actionTypes.LOAD_PARTS:
      return {
         ...state,
         parts: action.payload
      };
      case actionTypes.LOAD_TALKS:
         return {
            ...state,
            talks: action.payload
         };
      case actionTypes.SELECT_PUBLISHER:
      return {
         ...state,
         publisher: action.payload.publisher,
         part: action.payload.part,
         type: action.payload.type,
         week: action.payload.week
      };
      case actionTypes.VIEW_PUBLISHER_PARTS:
      return {
         ...state,
         modalChildren: action.payload
      };
      case actionTypes.CHANGE_WEEK:
      return {
         ...state,
         parts: action.payload.parts,
         week: action.payload.week
      };
      case actionTypes.RELOAD_WEEKS:
      return {
         ...state,
         weeks: action.payload.weeks,
         week: action.payload.week
      };
      case actionTypes.ADD_PROGRAM:
         return {
            ...state,
            modalChildren: action.payload
      };
      case actionTypes.OPEN_PUBLISHER_MODAL:
         return {
            ...state,
            modalChildren: action.payload
      };
      case actionTypes.OPEN_SPEAKER_MODAL:
         return {
            ...state,
            modalChildren: action.payload
      };
      case actionTypes.OPEN_GROUP_MODAL:
         return {
            ...state,
            modalChildren: action.payload
      }; 
      case actionTypes.EDIT_GROUP_MODAL:
         return {
            ...state,
            modalChildren: action.payload
      }; 
      case actionTypes.OPEN_EXPORT_MODAL:
         return {
            ...state,
            modalChildren: action.payload
      };
      case actionTypes.OPEN_RENAME_MODAL:
         return {
            ...state,
            modalChildren: action.payload
      };
   }
   return state
}

export default reducer;
