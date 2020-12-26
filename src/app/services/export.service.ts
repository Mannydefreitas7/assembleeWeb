import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { LocalStorageService } from 'ngx-webstorage';
import { Congregation } from '../models/congregation.model';
import { Parent, Part, WeekProgram } from '../models/wol.model';
import { FireStoreService } from './fire-store.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import  moment from 'moment';
import { from } from 'rxjs';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class ExportService {

treasures: Part[];
apply: Part[];
life: Part[];
weekend: Part[];
chairmans: Part[];
prayers: Part[];

  constructor(
      private storage: LocalStorageService,
      private fireStore: FireStoreService
  ) {

   }

   filterParts(parts: Part[]) {
    this.treasures = parts.filter(part => part.parent == Parent.treasures).sort((a, b) => a.index - b.index)
    this.apply = parts.filter(part => part.parent == Parent.apply).sort((a, b) => a.index - b.index)
    this.life = parts.filter(part => part.parent == Parent.life).sort((a, b) => a.index - b.index)
    this.weekend = parts.filter(part => part.parent == Parent.weekend).sort((a, b) => a.index - b.index)
    this.chairmans = parts.filter(part => part.parent == Parent.chairman).sort((a, b) => a.index - b.index)
    this.prayers = parts.filter(part => part.parent == Parent.prayer).sort((a, b) => a.index - b.index)
   }




  createSinglePDF(weekProgram: WeekProgram, parts: Part[]) {
    this.filterParts(parts)
    let congregation = this.storage.retrieve('congregationref')
    this.fireStore.fireStore.doc<Congregation>(congregation).get().subscribe(data => {
      if (data.exists) {
        let congInfo = data.data();
        var docDefinition = {
          content: [
            {
              columns: [
                [
                  {
                    text: congInfo.properties.orgName,
                    style: 'subheader'
                  },
                  {
                    text: 'Midweek Meeting Schedule',
                    style: 'header'
                  }
                ],
                {
                  text: weekProgram.range,
                  alignment: 'right',
                  margin: [0, 7],
                  fontSize: 22,
                  bold: true
                }
              ]
            },
            {
              svg: '<svg xmlns="http://www.w3.org/2000/svg" width="1166" height="1" viewBox="0 0 1166 1"><line id="Line_13" data-name="Line 13" x2="1166" transform="translate(0 0.5)" fill="none" stroke="#707070" stroke-width="1"/></svg>',
              width: 520,
              margin: [0, 3],
            },
            {
              style: 'tableExample',
              table: {
                widths: ['*', '*'],
                body: [
                  [{
                    text: congInfo.properties.orgName,
                    bold: true
                  }, {
                    text: 'Midweek Meeting Schedule',
                    alignment: 'right',
                    bold: true,
                    fontSize: 18,
                  }]
                ]
              },
              layout: "noBorders"
            }


          ],
	styles: {
		header: {
			fontSize: 18,
      bold: true,
      color: '#000000'
		},
		subheader: {
			fontSize: 12,
      bold: false,
      color: '#C0C0C0'
		},
		quote: {
			italics: true
		},
		small: {
			fontSize: 8
		}
	}
        };
        pdfMake.createPdf(docDefinition).open();
      }
    })


    // horizontal line



  }
}
