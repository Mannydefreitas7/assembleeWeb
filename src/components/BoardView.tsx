import React from 'react'
import  { FirestoreCollection, FirestoreProvider  } from '@react-firebase/firestore';
import { CONG_ID } from '../constants';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { IStackProps, Stack } from '@fluentui/react/lib/Stack';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { WeekProgram } from '../models/wol.model';

export default function BoardView() {
    const rowProps: IStackProps = { horizontal: true, verticalAlign: 'center' };
    const tokens = {
        sectionStack: {
          childrenGap: 10,
        },
        spinnerStack: {
          childrenGap: 20,
        },
      };
      const dropdownStyles: Partial<IDropdownStyles> = {
        dropdown: { width: 300 },
        dropdownItems: {}
      };
    return (
        <FirestoreCollection where={{ field: 'isSent', operator: '==', value: true}} path={`congregations/${CONG_ID}/weeks`} limit={8}>
            {d => {
                return d && d.isLoading ? 
                <Stack tokens={tokens.sectionStack}>
                    <Stack {...rowProps} tokens={tokens.spinnerStack}>
                    <Spinner size={SpinnerSize.large} />
                    </Stack> 
                </Stack> : 
                <Stack>
                    <Dropdown
                     placeholder="Select an option"
                     label="Select week range"
                     options={
                         d.value.map((week: WeekProgram) => {
                             let option : IDropdownOption = {
                                 key: week.id ?? "",
                                 text: week.range ?? ""
                             }
                             return option
                         })
                    }
                     styles={dropdownStyles}
                   />
                </Stack>
                     
            }}
        </FirestoreCollection>
    )
}
