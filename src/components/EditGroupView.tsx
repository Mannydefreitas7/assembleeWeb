import { Icon, IconButton, PrimaryButton, Spinner, TextField } from '@fluentui/react'
import React, { useContext, useEffect } from 'react'
import { GlobalContext } from '../store/GlobalState';
import { CONG_ID } from '../constants';
import { Group } from '../models/group';
import { useAlert } from 'react-alert';
import { useDocumentOnce } from 'react-firebase-hooks/firestore';

export default function EditGroupView({ id }: {id: string}) {
    const { dismissModal, firestore } = useContext(GlobalContext);
    const [group, setGroup] = React.useState<Group>();
    const alert = useAlert();
    const groupDocumentQuery = firestore.doc(
        `congregations/${CONG_ID}/groups/${id}`
    );
    const [groupDocument, groupLoading] = useDocumentOnce(groupDocumentQuery);
           
    useEffect(() => {
       
        if (!groupLoading) {
            let _group : Group = {
                ...groupDocument?.data()
            }
            setGroup(_group)
        }
    }, [groupLoading, groupDocument])

    const editGroup = async () => {
        try {
            if (!groupLoading && group) {
               await firestore
                .doc(`congregations/${CONG_ID}/groups/${id}`)
                .update(group)
                dismissModal()
                alert.success('Group changes saved successfully')
            }
        } catch (error) { alert.error(`${error}`) }     
    }
      
    return (
        <div>
            <div className="flex items-center justify-between pl-4 pr-2 py-2 bg-gray-50">   
               <div className="inline-flex items-center">
                   <Icon iconName="Group" className="mr-2 text-lg"/>
                   <span className="font-bold text-lg">Edit Group</span>
               </div>
               <IconButton
               onClick={dismissModal}
               iconProps={{
                   iconName: "ChromeClose"
               }}
               />
           </div>
           <div className="px-4 pb-2" style={{ minWidth: 500 }}>
               
               {
                   group ? <>
                         <TextField 
                    onKeyUp={(e) => { 
                        setGroup({ 
                            ...group,
                            name: e.currentTarget.value
                        })
                     }}
                    placeholder="Salle Du Royaume" 
                    label="Name"
                    defaultValue={group?.name}
                    required />

                    <TextField 
                    onKeyUp={(e) => { 
                        setGroup({ 
                            ...group,
                            address: e.currentTarget.value
                        })
                    }}
                    placeholder="Kings Drive" 
                    label="Addresse" 
                    defaultValue={group?.address}
                    required />
                    <TextField 
                    onKeyUp={(e) => { 
                        setGroup({ 
                            ...group,
                            description: e.currentTarget.value
                        })
                    }}
                    multiline
                    defaultValue={group?.description}
                    label="Description" 
                     />
                    </> : <div className='flex justify-center items-center' style={{ minHeight: 220 }}><Spinner /></div>
               }

                   
  
               <div className="flex py-4 justify-center">
                    <PrimaryButton
                    onClick={editGroup}
                    disabled={!group?.name}
                    className="w-full" 
                    iconProps={{iconName: 'Save'}}
                    text='Save' />
            </div> 
           </div>
        </div>
    )
}
