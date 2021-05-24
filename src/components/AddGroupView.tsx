import { Icon, IconButton, PrimaryButton, TextField } from '@fluentui/react'
import React, { useContext } from 'react'
import { GlobalContext } from '../store/GlobalState';
import { v4 } from 'uuid'
import { CONG_ID } from '../constants';
import { Group } from '../models/group';
import { useAlert } from 'react-alert';
import { useCollectionOnce } from 'react-firebase-hooks/firestore';

export default function AddGroupView() {
    const { dismissModal, firestore } = useContext(GlobalContext);
    const [group, setGroup] = React.useState<Group>();
    const alert = useAlert();
    const groupCollectionQuery = firestore.collection(
        `congregations/${CONG_ID}/groups`
    );
    const [groupCollection, groupLoading] = useCollectionOnce(groupCollectionQuery);
             

    const addGroup = async () => {
        try {
            if (!groupLoading && group && group.name && group.address) {
                let _group : Group = {
                    ...group,
                    id: v4(),
                    number: groupCollection?.docs.length
                }
               await firestore
                .doc(`congregations/${CONG_ID}/groups/${_group.id}`)
                .set(_group)
                dismissModal()
                alert.success('Group added successfully')
            }
        } catch (error) { alert.error(`${error}`) }     
    }
      
    return (
        <div>
            <div className="flex items-center justify-between pl-4 pr-2 py-2 bg-gray-50">
               
               <div className="inline-flex items-center">
                   <Icon iconName="Group" className="mr-2 text-lg"/>
                   <span className="font-bold text-lg">Add Group</span>
               </div>
               <IconButton
               onClick={dismissModal}
               iconProps={{
                   iconName: "ChromeClose"
               }}
               />
           </div>
           <div className="px-4 pb-2" style={{ minWidth: 500 }}>
 
                    <TextField 
                    onKeyUp={(e) => { 
                        setGroup({ 
                            ...group,
                            name: e.currentTarget.value
                        })
                     }}
                    placeholder="Salle Du Royaume" 
                    label="Name" 
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
                    required />
                    <TextField 
                    onKeyUp={(e) => { 
                        setGroup({ 
                            ...group,
                            description: e.currentTarget.value
                        })
                    }}
                    multiline
                    label="Description" 
                     />
  
               <div className="flex py-4 justify-center">
                    <PrimaryButton
                    onClick={addGroup}
                    disabled={!group?.name}
                    className="w-full" 
                    iconProps={{iconName: 'Add'}}
                    text='Add Group' />
            </div> 
           </div>
        </div>
    )
}
