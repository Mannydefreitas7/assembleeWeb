import { Icon, SharedColors } from '@fluentui/react'
import React from 'react'
import { Parent, Part } from '../models/wol'

export default function PartTile({ part } : { part: Part }) {
    return (
        <div className="p-4 flex items-center bg-gray-50 border-l-2 border-green-700">
            <Icon iconName="FileComment" className="mr-6 text-2xl"/>
            <div className="flex flex-1 justify-between items-center">
            <div className="block">
                <span className="text-gray-600 text-sm">Part Title</span> <br/>
                <span className="text-lg font-semibold">{part.title}</span>
            </div>
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
                    >{part.parent}</span>
                </div>
        </div>
    )
}
