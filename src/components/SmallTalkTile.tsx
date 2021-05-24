import { Icon } from '@fluentui/react'
import { Talk } from '../models/publisher';

export default function SmallTalkTile({ talk } : { talk: Talk }) {
    return (
        <div className="p-4 flex justify-start items-center bg-gray-100 my-2 rounded">
            <Icon iconName="FileComment" className="mr-6 text-lg"/>
            <div className="block">
                <span className="text-gray-600 text-xs">Number {talk.number}</span> <br/>
                <span className="text-sm font-semibold">{talk.title}</span> 
            </div>
        </div>
    )
}
