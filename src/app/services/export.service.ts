import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Congregation } from '../models/congregation.model';
import { Parent, Part, WeekProgram } from '../models/wol.model';
import { FireStoreService } from './fire-store.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {  QuerySnapshot } from '@angular/fire/firestore';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';

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
congregation: Congregation;
congregationRef: string;
docDefinition = {
  info: {
    title: '',
    author: '',
    subject: '',
    keywords: '',
  },
  content: [],
  styles: {}
}
  constructor(
      private storage: LocalStorageService,
      private fireStore: FireStoreService,
      public spinner: NgxSpinnerService
  ) {
    this.congregation = this.storage.retrieve('congregation')
    this.congregationRef = this.storage.retrieve('congregationref')
    this.docDefinition.styles = {
        header: {
          fontSize: 18,
          bold: true,
          color: '#000000',
        },
        subheader: {
          fontSize: 12,
          bold: false,
          color: '#C0C0C0'
        },
        treasures: {
          fontSize: 16,
          bold: true,
          color: '#656164'
        },
        apply: {
          fontSize: 16,
          bold: true,
          color: '#a56803'
        },
        life: {
          fontSize: 16,
          bold: true,
          color: '#99131e'
        },
        weekend: {
          fontSize: 16,
          bold: true,
          color: '#808080'
        },
        label: {
          fontSize: 12,
          bold: false,
          color: '#808080'
        },
        part: {
          fontSize: 12,
          bold: false,
          color: '#000000'
        },
        partValue: {
          fontSize: 12,
          bold: true,
          color: '#000000',
          alignment: 'right'
        },
        value: {
          fontSize: 12,
          bold: true,
          color: '#000000',
          margin: [0, 2]
        }
        }

   }

   filterParts(parts: Part[]) {
    this.treasures = parts.filter(part => part.parent == Parent.treasures).sort((a, b) => a.index - b.index)
    this.apply = parts.filter(part => part.parent == Parent.apply).sort((a, b) => a.index - b.index)
    this.life = parts.filter(part => part.parent == Parent.life).sort((a, b) => a.index - b.index)
    this.weekend = parts.filter(part => part.parent == Parent.weekend).sort((a, b) => a.index - b.index)
    this.chairmans = parts.filter(part => part.parent == Parent.chairman).sort((a, b) => a.index - b.index)
    this.prayers = parts.filter(part => part.parent == Parent.prayer).sort((a, b) => a.index - b.index)
   }

   filterPart(parts: QuerySnapshot<Part>) {
   let part = {
    treasures: parts.docs.filter(part => part.data().parent == Parent.treasures).sort((a, b) => a.data().index - b.data().index),
    apply: parts.docs.filter(part => part.data().parent == Parent.apply).sort((a, b) => a.data().index - b.data().index),
    life: parts.docs.filter(part => part.data().parent == Parent.life).sort((a, b) => a.data().index - b.data().index),
    weekend: parts.docs.filter(part => part.data().parent == Parent.weekend).sort((a, b) => a.data().index - b.data().index),
    chairmans: parts.docs.filter(part => part.data().parent == Parent.chairman).sort((a, b) => a.data().index - b.data().index),
    prayers: parts.docs.filter(part => part.data().parent == Parent.prayer).sort((a, b) => a.data().index - b.data().index)
    }
    return part;
   }


   pagebreak(weekProgram: WeekProgram, weeks: WeekProgram[]) : boolean {
    return weekProgram.range != weeks[weeks.length - 1].range;
   }


  parseSinglePage(congInfo: Congregation, weekProgram: WeekProgram, parts: QuerySnapshot<Part>, weeks: WeekProgram[]) {
    let filteredParts = this.filterPart(parts)
    this.docDefinition.content.push({
      columns: [
        [
          {
            text: congInfo.properties.orgName,
            style: 'subheader'
          },
          {
            text: 'Meeting Schedule',
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
      margin: [0, 3, 0, 10],
    },
    {
      columns: [
        [
          {
            text: 'Chairman',
            style: 'label'
          },
          {
            text: filteredParts.chairmans[0].data().assignee ? `${filteredParts.chairmans[0].data().assignee.firstName} ${filteredParts.chairmans[0].data().assignee.lastName}` : '',
            style: 'value'
          }
        ],
        [
          {
            text: 'Prayer',
            style: 'label'
          },
          {
            text: filteredParts.prayers[0].data().assignee ? `${filteredParts.prayers[0].data().assignee.firstName} ${filteredParts.prayers[0].data().assignee.lastName}` : '',
            style: 'value'
          }
        ]
      ]
    },
    {
      text: "JOYAUX DE LA PAROLE DE DIEU",
      style: "treasures",
      margin: [0, 15, 0 , 0]
    },
    {
      markerColor: '#808080',
      ul: filteredParts.treasures.map(part => {
        return {
          columns: [
            {

              text: part.data().title,
              style: "part",
            },
            {
              text: part.data().assignee ? `${part.data().assignee.firstName} ${part.data().assignee.lastName}` : '',
              style: 'partValue'
            }
          ],
          margin: [0, 10, 0, 0]
        }
      }),
    },
    {
      text: "APPLIQUE-TOI AU MINISTÈRE",
      style: "apply",
      margin: [0, 15, 0 , 0]
    },
    {
      markerColor: '#808080',
      ul: filteredParts.apply.map(part => {
        return {
          columns: [
            {

              text: `${part.data().title.split(')')[0]})`,
              style: "part",
            },
            {
              text:part.data().assignee ? `${part.data().assignee.firstName} ${part.data().assignee.lastName}` : '',
              style: 'partValue'
            }
          ],
          margin: [0, 10, 0, 0]
        }
      }),
    },
    {
      text: "VIE CHRÉTIENNE",
      style: "life",
      margin: [0, 15, 0 , 0]
    },
    {
      markerColor: '#808080',
      ul: filteredParts.life.map(part => {
        return {
          columns: [
            {

              text: `${part.data().title.split(')')[0]})`,
              style: "part",
            },
            {
              text:part.data().assignee ? `${part.data().assignee.firstName} ${part.data().assignee.lastName}` : '',
              style: 'partValue'
            }
          ],
          margin: [0, 10, 0, 0]
        }
      }),
    },
    {
      text: 'Prayer',
      style: 'label',
      margin: [0, 10, 0, 0]
    },
    {
      text:filteredParts.prayers[1].data().assignee ? `${filteredParts.prayers[1].data().assignee.firstName} ${filteredParts.prayers[1].data().assignee.lastName}` : '',
      style: 'value'
    },
    {
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="1166" height="1" viewBox="0 0 1166 1"><line id="Line_13" data-name="Line 13" x2="1166" transform="translate(0 0.5)" fill="none" stroke="#707070" stroke-width="1"/></svg>',
      width: 520,
      margin: [0, 10, 0, 1],
    },
    {
      columns: [
        [
          {
            text: 'Chairman',
            style: 'label'
          },
          {
            text:filteredParts.chairmans[1].data().assignee ? `${filteredParts.chairmans[1].data().assignee.firstName} ${filteredParts.chairmans[1].data().assignee.lastName}` : '',
            style: 'value'
          }
        ],
        [
          {
            text: 'Prayer',
            style: 'label'
          },
          {
            text:filteredParts.prayers[2].data().assignee ? `${filteredParts.prayers[2].data().assignee.firstName} ${filteredParts.prayers[2].data().assignee.lastName}` : '',
            style: 'value'
          }
        ]
      ],
      margin: [0, 20, 0, 1]
    },
    {
      text: filteredParts.weekend[0].data().title.length > 0 ? filteredParts.weekend[0].data().title : 'TALK OUTLINE',
      style: "weekend",
      margin: [0, 15]
    },
    {
      columns: [
          [
            {
              text: 'Speaker',
              style: "label"
            },
            {
              text: filteredParts.weekend[0].data().assignee ? `${filteredParts.weekend[0].data().assignee.firstName} ${filteredParts.weekend[0].data().assignee.lastName}` : 'John Doe',
              style: "value",
            }
          ],
          [
            {
              text: 'Congregation',
              style: "label",
            },
            {
              text: 'Burbank French',
              style: "value",
            }
          ]
      ]
    },
    {
      text: 'WATCHTOWER STUDY',
      style: "weekend",
      margin: [0, 15]
    },
    {
      columns: [
          [
            {
              text: 'Conductor',
              style: "label"
            },
            {
              text: filteredParts.weekend[1].data().assignee ? `${filteredParts.weekend[1].data().assignee.firstName} ${filteredParts.weekend[1].data().assignee.lastName}` : '',
              style: "value",
            }
          ],
          [
            {
              text: 'Reader',
              style: "label",
            },
            {
              text: filteredParts.weekend[1].data().assistant ? `${filteredParts.weekend[1].data().assistant.firstName} ${filteredParts.weekend[1].data().assistant.lastName}` : '',
              style: "value",
            }
          ],
      ]
    },
    [
      {
        text: 'Prayer',
        style: 'label'
      },
      {
        text: filteredParts.prayers[3].data().assignee ? `${filteredParts.prayers[3].data().assignee.firstName} ${filteredParts.prayers[3].data().assignee.lastName}` : "",
        style: 'value',

      },
    ],{
      text: '',
      pageBreak: weekProgram.id == weeks[weeks.length - 1].id ? '' : 'after',
      margin: [0, 0, 0, 50]
    })


  }

  createMonthPDF(weeks: WeekProgram[]) {
    this.docDefinition.content = []
    this.docDefinition.info.title = `Programme Vie et Ministere - ${moment(weeks[0].date.toDate()).format('MMMM yyyy')}.pdf`;
    weeks.forEach(week => {
     this.fireStore.fireStore.collection<Part>(`${this.congregationRef}/weeks/${week.id}/parts`).get().toPromise().then(parts => {
       if (parts) {
          this.parseSinglePage(this.congregation, week, parts, weeks)
         //  pdfMake.createPdf(this.docDefinition).open();


       }
     })
    })
    this.spinner.show()
      setTimeout(() => {
        this.spinner.hide()
        pdfMake.createPdf(this.docDefinition).open()

      }, 3000)


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
                    text: 'Meeting Schedule',
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
              margin: [0, 3, 0, 10],
            },
            {
              columns: [
                [
                  {
                    text: 'Chairman',
                    style: 'label'
                  },
                  {
                    text: this.chairmans[0].assignee ? `${this.chairmans[0].assignee.firstName} ${this.chairmans[0].assignee.lastName}` : '',
                    style: 'value'
                  }
                ],
                [
                  {
                    text: 'Prayer',
                    style: 'label'
                  },
                  {
                    text: this.prayers[0].assignee ? `${this.prayers[0].assignee.firstName} ${this.prayers[0].assignee.lastName}` : '',
                    style: 'value'
                  }
                ]
              ]
            },
            {
              text: "JOYAUX DE LA PAROLE DE DIEU",
              style: "treasures",
              margin: [0, 15, 0 , 0]
            },
            {
              markerColor: '#808080',
              ul: this.treasures.map(part => {
                return {
                  columns: [
                    {

                      text: part.title,
                      style: "part",
                    },
                    {
                      text: part.assignee ? `${part.assignee.firstName} ${part.assignee.lastName}` : '',
                      style: 'partValue'
                    }
                  ],
                  margin: [0, 10, 0, 0]
                }
              }),
            },
            {
              text: "APPLIQUE-TOI AU MINISTÈRE",
              style: "apply",
              margin: [0, 15, 0 , 0]
            },
            {
              markerColor: '#808080',
              ul: this.apply.map(part => {
                return {
                  columns: [
                    {

                      text: `${part.title.split(')')[0]})`,
                      style: "part",
                    },
                    {
                      text:part.assignee ? `${part.assignee.firstName} ${part.assignee.lastName}` : '',
                      style: 'partValue'
                    }
                  ],
                  margin: [0, 10, 0, 0]
                }
              }),
            },
            {
              text: "VIE CHRÉTIENNE",
              style: "life",
              margin: [0, 15, 0 , 0]
            },
            {
              markerColor: '#808080',
              ul: this.life.map(part => {
                return {
                  columns: [
                    {

                      text: `${part.title.split(')')[0]})`,
                      style: "part",
                    },
                    {
                      text:part.assignee ? `${part.assignee.firstName} ${part.assignee.lastName}` : '',
                      style: 'partValue'
                    }
                  ],
                  margin: [0, 10, 0, 0]
                }
              }),
            },
            {
              text: 'Prayer',
              style: 'label',
              margin: [0, 10, 0, 0]
            },
            {
              text:this.prayers[1].assignee ? `${this.prayers[1].assignee.firstName} ${this.prayers[1].assignee.lastName}` : '',
              style: 'value'
            },
            {
              svg: '<svg xmlns="http://www.w3.org/2000/svg" width="1166" height="1" viewBox="0 0 1166 1"><line id="Line_13" data-name="Line 13" x2="1166" transform="translate(0 0.5)" fill="none" stroke="#707070" stroke-width="1"/></svg>',
              width: 520,
              margin: [0, 10, 0, 1],
            },
            {
              columns: [
                [
                  {
                    text: 'Chairman',
                    style: 'label'
                  },
                  {
                    text:this.chairmans[1].assignee ? `${this.chairmans[1].assignee.firstName} ${this.chairmans[1].assignee.lastName}` : '',
                    style: 'value'
                  }
                ],
                [
                  {
                    text: 'Prayer',
                    style: 'label'
                  },
                  {
                    text:this.prayers[2].assignee ? `${this.prayers[2].assignee.firstName} ${this.prayers[2].assignee.lastName}` : '',
                    style: 'value'
                  }
                ]
              ],
              margin: [0, 10, 0, 1]
            },
            {
              text: this.weekend[0].title.length > 0 ? this.weekend[0].title : 'TALK OUTLINE',
              style: "weekend",
              margin: [0, 15]
            },
            {
              columns: [
                  [
                    {
                      text: 'Speaker',
                      style: "label"
                    },
                    {
                      text: this.weekend[0].assignee ? `${this.weekend[0].assignee.firstName} ${this.weekend[0].assignee.lastName}` : 'John Doe',
                      style: "value",
                    }
                  ],
                  [
                    {
                      text: 'Congregation',
                      style: "label",
                    },
                    {
                      text: 'Burbank French',
                      style: "value",
                    }
                  ]
              ]
            },
            {
              text: 'WATCHTOWER STUDY',
              style: "weekend",
              margin: [0, 15]
            },
            {
              columns: [
                  [
                    {
                      text: 'Conductor',
                      style: "label"
                    },
                    {
                      text: this.weekend[1].assignee ? `${this.weekend[1].assignee.firstName} ${this.weekend[1].assignee.lastName}` : '',
                      style: "value",
                    }
                  ],
                  [
                    {
                      text: 'Reader',
                      style: "label",
                    },
                    {
                      text: this.weekend[1].assistant ? `${this.weekend[1].assistant.firstName} ${this.weekend[1].assistant.lastName}` : '',
                      style: "value",
                    }
                  ],
              ]
            },
            [
              {
                text: 'Prayer',
                style: 'label'
              },
              {
                text: this.prayers[3].assignee ? `${this.prayers[3].assignee.firstName} ${this.prayers[3].assignee.lastName}` : "",
                style: 'value'
              }
            ]
          ],
	styles: {
		header: {
			fontSize: 18,
      bold: true,
      color: '#000000',
		},
		subheader: {
			fontSize: 12,
      bold: false,
      color: '#C0C0C0'
    },
    treasures: {
			fontSize: 16,
      bold: true,
      color: '#656164'
    },
    apply: {
			fontSize: 16,
      bold: true,
      color: '#a56803'
    },
    life: {
			fontSize: 16,
      bold: true,
      color: '#99131e'
    },
    weekend: {
      fontSize: 16,
      bold: true,
      color: '#808080'
    },
    label: {
      fontSize: 12,
      bold: false,
      color: '#808080'
    },
    part: {
      fontSize: 12,
      bold: false,
      color: '#000000'
    },
    partValue: {
      fontSize: 12,
      bold: true,
      color: '#000000',
      alignment: 'right'
    },
    value: {
      fontSize: 12,
      bold: true,
      color: '#000000',
      margin: [0, 2]
    }
	}
        };

        pdfMake.createPdf(docDefinition).open();
      }
    })


    // horizontal line



  }
}
