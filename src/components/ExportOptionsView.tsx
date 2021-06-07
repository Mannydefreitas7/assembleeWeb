import { Dropdown, Icon, IconButton, IDropdownOption, PrimaryButton, Spinner } from '@fluentui/react'
import moment from 'moment';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { CONG_ID } from '../constants';

import { WeekProgram } from '../models/wol';
import { ExportService } from '../services/export';
import { GlobalContext } from '../store/GlobalState';


export default function ExportOptionsView() {
    const { firestore, dismissModal, congregation } = useContext(GlobalContext);
    const [months, setMonths] = useState<IDropdownOption[]>()

    const [month, setMonth] = useState<IDropdownOption>()
    const [weeks, setWeeks] = useState<WeekProgram[]>([])
    const [loading, setLoading] = useState(false);
    const exportService = new ExportService()
    const load = useCallback(
        async () => {
            try {
                let weeks = await firestore.collection(`congregations/${CONG_ID}/weeks`)
                .orderBy('date')
                .get();
                let _weeks : WeekProgram[] = weeks.docs.map(w => w.data())
                setWeeks(_weeks)
                let _months : IDropdownOption[] = []
                _weeks.forEach(w => {
                    if (!_months.find(m => moment(m.data).month() === moment(w.date.toDate()).month())) {
                        _months.push({
                            key: `${w.id}`,
                            data: w.date.toDate(),
                            text: moment(w.date.toDate()).format('MMMM')
                        })
                    }
                })
               setMonths(_months)  
            } catch (err) { console.log(err) }
        },
        [firestore],
    ) 

    
    useEffect(() => {
        load()
    // @ts-ignore
    }, [load])

    const exportSchedule = async () => {
        setLoading(true)
        let _weeks: WeekProgram[] = weeks.filter(w => moment(w.date.toDate()).month() === moment(month ? month.data : weeks[0].date.toDate()).month());
        let result = await exportService.downloadPDF(_weeks, congregation, firestore)
        if (result) {  setLoading(false) }
    }

    return (
        <div className="h-160 w-80">
            <div className="flex items-center justify-between pl-4 pr-2 py-2 bg-gray-50">
                <div className="inline-flex items-center">
                    <Icon iconName="Generate" className="mr-2 text-lg" />
                    <span className="font-bold text-lg">Export Schedule</span>
                </div>
                <IconButton
                    onClick={dismissModal}
                    iconProps={{
                        iconName: "ChromeClose"
                    }}
                />
            </div>
            <div className="p-4">
                {
                    months && months.length > 0 ?
                        <Dropdown
                            label="Select Month"
                            options={months}
                            onChange={(e, o) => setMonth(o)}
                            selectedKey={month?.key ?? months[0].key}
                        /> : <Spinner />
                }        
                <div className="flex items-center justify-center mt-4">
                {
                    loading ? 
                    <Spinner label="Please Wait..." labelPosition="right" /> : 
                    <PrimaryButton className="w-full" text="Submit" onClick={exportSchedule} />
                }
                </div>
            </div>
        </div>
    )
}