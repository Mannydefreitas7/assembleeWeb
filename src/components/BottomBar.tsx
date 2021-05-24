import { Icon} from '@fluentui/react'

import { NavLink, useRouteMatch } from 'react-router-dom'



export default function BottomBar() {
    let { url } = useRouteMatch();
    const links = [
        {
            path: `${url}`,
            text: 'Home',
            icon: 'Home'
        },
        {
            path: `${url}/programs`,
            text: 'Programs',
            icon: 'ScheduleEventAction'
        },
        {
            path: `${url}/publishers`,
            text: 'Publishers',
            icon: 'People'
        },
        {
            path: `${url}/speakers`,
            text: 'Speakers',
            icon: 'PublishCourse'
        }
    ]


    return (
        <div className="w-full flex justify-between items-center bg-white bottom-0 fixed z-10 px-5 py-3 shadow">
                {
                    links.map((link, index) => {
                        return (
                            <NavLink 
                                key={index}
                                exact
                                activeClassName="text-green-400"
                                className="text-gray-700 text-center flex flex-col"
                                to={link.path}>
                                    <Icon className="text-xl" iconName={link.icon}/>
                                    <span className="text-xs">{link.text}</span>
                                </NavLink>
                        )
                    })
                }
        </div>
    )
}
