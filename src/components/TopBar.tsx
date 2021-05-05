import { Icon, Persona, PersonaSize, Spinner } from '@fluentui/react'
import React, { useContext, useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link, NavLink, useRouteMatch } from 'react-router-dom'
import { User } from '../models/user';
import { GlobalContext } from '../store/GlobalState';
import logo from './../assets/logo.jpg'

export default function TopBar() {
    let { url } = useRouteMatch();
    const { auth, user, firestore } = useContext(GlobalContext);
    const [userState, loading] = useAuthState(auth);
    const [userInfo, setUserInfo] = useState<User>();
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
        },
        {
            path: '/',
            text: 'Board',
            icon: 'Questionnaire'
        }
    ]
    // @ts-ignore
    useEffect(() => {
        loadUser()
      }, [])

    const loadUser = async () => {
        if (!loading) {
            let _res = await firestore.doc(`users/${userState?.uid}`).get();
            let _user = _res.exists ? _res.data() : {}
            setUserInfo(_user)
        }
    }

    return (
        <div className="w-full flex justify-between items-center bg-gray-800 fixed z-10 pr-5">
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
            {
                user === null ? <Spinner /> :
                <> 
                    <Link to={url + '/me'}>
                    <Persona
                        size={PersonaSize.size32}
                        hidePersonaDetails={true}
                        imageUrl={userInfo?.photoURL}
                        text={`${userInfo?.firstName} ${userInfo?.lastName}`}
                    />
                    </Link>
                </>
            }
            
        </div>
    )
}
