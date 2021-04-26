import React from 'react'
import { Label, Pivot, PivotItem } from '@fluentui/react';
import BoardView from '../components/BoardView';

export default function Board() {
    
      const PivotTabsExample = () => (
        <div className="container mx-auto py-10">
          <Pivot styles={{
              root: {
                  
              }
          }}
          linkFormat="tabs">
            <PivotItem headerText="Réunions">
              <BoardView />
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

    return PivotTabsExample()
}
