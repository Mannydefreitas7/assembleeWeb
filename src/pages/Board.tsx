import React from 'react'
import { Label, Pivot, PivotItem } from '@fluentui/react';
import MeetingView from '../components/MeetingView';
import { NeutralColors } from '@fluentui/theme';
export default function Board() {
    
      const PivotTabs = () => (
        <div className="container mx-auto pb-10 pt-4 px-4">
          <h1 className="leading-5 my-5 font-semibold text-gray-400">
            Tableau d'Affichage <br/>
            <span className="text-2xl text-black">West Hudson French - Airmont NY (USA)</span>
          </h1>
          <Pivot 
          styles={{
              linkIsSelected: {
                fontWeight: 'bold'
              },
              link: {
                  fontWeight: 'bold',
                  backgroundColor: NeutralColors.gray10
              }
          }}
          linkFormat="links">
            <PivotItem headerText="Réunions">
              <MeetingView />
            </PivotItem>
            <PivotItem headerText="Prédication">
              <Label>Pivot #2</Label>
            </PivotItem>
            <PivotItem headerText="Groupes">
              <Label>Pivot #3</Label>
            </PivotItem>
            <PivotItem headerText="Info">
              <Label>Pivot #4</Label>
            </PivotItem>
          </Pivot>
        </div>
      );

    return PivotTabs()
}
