import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { InitialState } from '../models/initialState';
import reducer from './AppReducer';
import firebase from 'firebase/app';
import {
    LOAD_WEEKS,
    CHANGE_WEEK
} from './ActionTypes';
import { Part, WeekProgram } from '../models/wol.model';
import { CONG_ID } from '../constants';
import { IDropdownOption } from '@fluentui/react';


type GlobalProps = {
    children: ReactNode
}

const initialState: InitialState = {
    parts: [],
    weeks: [],
    week: {},
    loading: true,
    changeWeek: null
}

export const GlobalContext = createContext(initialState)

export const GlobalProvider = (props: GlobalProps) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if (state.weeks.length === 0) {
            loadWeeks()
        }
    }, [state.weeks.length])

    const loadWeeks = async () => {
        try {
            let weeks: WeekProgram[] = await firebase.firestore()
                .collection(`congregations/${CONG_ID}/weeks`)
                .limit(8)
                .orderBy('date')
                .where('isSent', '==', true)
                .get()
                .then(data => data.docs && data.docs.map(d => d.data()));
            if (weeks && weeks.length > 0) {
                let parts: Part[] = await firebase.firestore()
                    .collection(`congregations/${CONG_ID}/weeks/${weeks[0].id}/parts`)
                    .orderBy('index')
                    .get()
                    .then(_ => _.docs.map(d => d.data()))
                if (parts && parts.length > 0) {
                    dispatch({
                        type: LOAD_WEEKS,
                        payload: {
                            weeks,
                            parts,
                            week: weeks[0]
                        }
                    })
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const loadWeekParts = async (option: IDropdownOption) => {
        try {
                let parts: Part[] = await firebase.firestore()
                    .collection(`congregations/${CONG_ID}/weeks/${option.key}/parts`)
                    .orderBy('index')
                    .get()
                    .then(_ => _.docs.map(d => d.data()))
                if (parts && parts.length > 0) {
                    dispatch({
                        type: CHANGE_WEEK,
                        payload: {
                            parts,
                            week: state.weeks.filter(w => w.id === option.key)[0]
                        }
                    })
                }
        } catch (error) {
            console.log(error)
        }
    }

    const changeWeek = (option: IDropdownOption) => {
        loadWeekParts(option); 
    }



    return (
        <GlobalContext.Provider value={{
            parts: state.parts,
            weeks: state.weeks,
            week: state.week,
            loading: state.loading,
            changeWeek
        }}>
            {props.children}
        </GlobalContext.Provider>
    )
}
