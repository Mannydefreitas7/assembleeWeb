import { DateRangeType } from '@fluentui/date-time-utilities/lib/dateValues/dateValues'
import { Calendar, DayOfWeek, Icon, IconButton, PrimaryButton, Spinner } from '@fluentui/react';
import { addMonths  } from '@fluentui/date-time-utilities';
import { useConst } from '@fluentui/react-hooks';
import moment from 'moment';
import React, { useContext } from 'react'
import { ProgramsService } from '../services/programs';
import { GlobalContext } from '../store/GlobalState';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
import { CONG_ID } from '../constants';
import { Congregation } from '../models/congregation';

export default function AddProgramView() {
    const programService = new ProgramsService();
    const { dismissModal, firestore } = useContext(GlobalContext)
    const [ value ] = useDocumentOnce(firestore.doc(`congregations/${CONG_ID}`));
    const [isLoading, setLoading] = React.useState(false)
    const today = useConst(new Date());
    const [selectedDate, setSelectedDate] = React.useState<Date[]>();
    const maxDate = useConst(addMonths(today, 3));
    const minDate = useConst(addMonths(today, -3));

    const onSelectDate = React.useCallback((date: Date, selectedDateRangeArray: Date[] | undefined): void => {
        console.log(selectedDateRangeArray)
        setSelectedDate(selectedDateRangeArray);
      }, []);
    
    return (
        <div>
            <div className="flex items-center justify-between pl-4 pr-2 py-2 bg-gray-50">
               
                <div className="inline-flex items-center">
                    <Icon iconName="ScheduleEventAction" className="mr-2 text-lg"/>
                    <span className="font-bold text-lg">Add Program</span>
                </div>
                <IconButton 
                onClick={dismissModal}
                iconProps={{
                    iconName: "ChromeClose"
                }}
                />
            </div>

            <div className="px-4 pb-4 flex items-center justify-center">
                <Calendar
                    dateRangeType={DateRangeType.Week}
                    showGoToToday={false}
                    isMonthPickerVisible={false}
                    firstDayOfWeek={DayOfWeek.Monday}
                  //  isDayPickerVisible={false}
                    minDate={minDate}
                    maxDate={maxDate}
                    onSelectDate={onSelectDate}
                    value={selectedDate ? selectedDate[0] : new Date()}
                />
            </div>
            <div className="flex px-4 pb-4 justify-center">
                {   
                    isLoading ?
                    <Spinner label="Downloading Schedule..." labelPosition="right" /> :
                    <PrimaryButton  
                    onClick={() => {

                        if (value?.exists && selectedDate && selectedDate.length > 0) {
                            setLoading(true)
                            let congegation: Congregation = {
                                ...value.data()
                            }
                            let promise = programService.addProgram(selectedDate[0], congegation, firestore)
                            promise.then(_ => {
                                setLoading(false)
                                dismissModal()
                            })
                        }
                    }}
                    className="w-full" 
                    iconProps={{
                        iconName: 'CloudDownload'
                    }}
                    text={`Download ${moment(selectedDate ? selectedDate[0] : new Date()).format('D')} - ${moment(selectedDate ? selectedDate[selectedDate.length - 1] : new Date()).locale('fr').format('D MMMM')}`} />
                }
            </div>
        </div>
    )
}
