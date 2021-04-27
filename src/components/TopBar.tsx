import { Icon } from '@fluentui/react'
import React from 'react'
import { NavLink, useRouteMatch } from 'react-router-dom'
import logo from './../assets/logo.jpg'

export default function TopBar() {
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
        <div className="w-full flex justify-between items-center bg-gray-800 fixed z-10">
            <div className="inline-flex">
                <img src={logo} className="mr-6 w-14" alt="West Hudson French" />
                {
                    links.map((link, index) => {
                        return (
                            <NavLink 
                                key={index}
                                exact
                                activeClassName="text-green-400"
                                className="text-white mx-2 align-middle items-center inline-flex"
                                to={link.path}>
                                      <Icon iconName={link.icon} className="mr-1"/>
                                    {link.text}
                                </NavLink>
                        )
                    })
                }
            </div>
        </div>
    )
}
