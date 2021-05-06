import { Icon } from '@fluentui/react'
import moment from 'moment'
import React from 'react'
import { Parent, Part } from '../models/wol';
import { SharedColors } from '@fluentui/theme';

export default function SmallPartTile({ part } : { part: Part }) {
    return (
        <div className="p-4 flex justify-start items-center bg-gray-100 my-2 rounded">
            <Icon iconName="FileComment" className="mr-6 text-lg"/>
            <div className="block">
                <span className="text-gray-600 text-xs">{moment(part?.date?.toDate()).format('Do MMMM YYYY')}</span> <br/>
                <span className="text-sm font-semibold">{part.title}</span> 
                <div className="flex items-center py-1">
                    <span 
                    className="text-white px-2 py-1 text-xs border font-semibold rounded-full"
                    style={{
                        color: part.parent === Parent.apply ? 
                        SharedColors.orangeYellow10 :
                        part.parent === Parent.life ?
                        SharedColors.pinkRed10 :
                        part.parent === Parent.treasures ?
                        SharedColors.gray40 :
                        SharedColors.gray20,
                        borderColor: part.parent === Parent.apply ? 
                        SharedColors.orangeYellow10 :
                        part.parent === Parent.life ?
                        SharedColors.pinkRed10 :
                        part.parent === Parent.treasures ?
                        SharedColors.gray40 :
                        SharedColors.gray20
                    }}
                    >{part?.parent}</span>
                </div>

            </div>
        </div>
    )
}
