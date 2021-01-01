import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Congregation } from '../models/congregation.model';
import { Parent, Part, WeekProgram } from '../models/wol.model';
import { FireStoreService } from './fire-store.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {  QueryDocumentSnapshot, QuerySnapshot } from '@angular/fire/firestore';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmailService } from './email.service';
import { Gender, Publisher } from '../models/publisher.model';
import { EmailMessage } from '../models/user.model';
import { NgForage } from 'ngforage';
import { map, take } from 'rxjs/operators';

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
      public spinner: NgxSpinnerService,
      public emailService: EmailService,
      public forage: NgForage
  ) {
    this.docDefinition.styles = {
        header: {
          fontSize: 18,
          bold: true,
          color: '#000000',
        },
        subheader: {
          fontSize: 12,
          bold: false,
          color: '#9e9e9e'
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


   filterPart(parts: Part[]) {
   let part = {
    treasures: parts.filter(part => part.parent == Parent.treasures).sort((a, b) => a.index - b.index),
    apply: parts.filter(part => part.parent == Parent.apply).sort((a, b) => a.index - b.index),
    life: parts.filter(part => part.parent == Parent.life).sort((a, b) => a.index - b.index),
    talk: parts.filter(part => part.parent == Parent.talk).sort((a, b) => a.index - b.index),
    wt: parts.filter(part => part.parent == Parent.wt).sort((a, b) => a.index - b.index),
    chairmans: parts.filter(part => part.parent == Parent.chairman).sort((a, b) => a.index - b.index),
    prayers: parts.filter(part => part.parent == Parent.prayer).sort((a, b) => a.index - b.index)
    }
    return part;
   }


   pagebreak(weekProgram: WeekProgram, weeks: WeekProgram[]) : boolean {
    return weekProgram.range != weeks[weeks.length - 1].range;
   }


  parseSinglePage(congInfo: Congregation, weekProgram: WeekProgram, parts: Part[], weeks: WeekProgram[]) {
    let filteredParts = this.filterPart(parts)

      this.docDefinition.content.push({
        columns: [
          [
            {
              text: congInfo.properties.orgName,
              style: 'subheader'
            },
            {
              text: 'Programme de la Réunion',
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
        ],
        margin: [0, 20, 0, 0]
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
              text: 'Président',
              style: 'label'
            },
            {
              text: filteredParts.chairmans[0] && filteredParts.chairmans[0].assignee ? `${filteredParts.chairmans[0].assignee.firstName} ${filteredParts.chairmans[0].assignee.lastName}` : '',
              style: 'value'
            }
          ],
          [
            {
              text: 'Priere',
              style: 'label'
            },
            {
              text:filteredParts.prayers[0] && filteredParts.prayers[0].assignee ? `${filteredParts.prayers[0].assignee.firstName} ${filteredParts.prayers[0].assignee.lastName}` : '',
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

                text: part.title,
                style: "part",
              },
              {
                text: part && part.assignee ? `${part.assignee.firstName} ${part.assignee.lastName}` : '',
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
              [
                {

                  text: `${part.title.split(')')[0]})`,
                  style: "part",
                },
                {
                  text: part && part.assistant ? `Interlocuteur` : '',
                  style: 'part'
                }
              ],
              [
                {

                  text: part && part.assignee ? `${part.assignee.firstName} ${part.assignee.lastName}` : '',
                  style: "partValue",
                },
                {
                  text: part && part.assistant ? `${part.assistant.firstName} ${part.assistant.lastName}` : '',
                  style: 'partValue'
                }
              ]
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
              [
                {
                  text: `${part.title.split(')')[0]})`,
                  style: "part",
                },
                {
                  text: part && part.assistant ? `Lecteur` : '',
                  style: 'part'
                }
              ],
              [
                {

                  text: part && part.assignee ? `${part.assignee.firstName} ${part.assignee.lastName}` : '',
                  style: "partValue",
                },
                {
                  text: part && part.assistant ? `${part.assistant.firstName} ${part.assistant.lastName}` : '',
                  style: 'partValue'
                }
              ]
            ],
            margin: [0, 10, 0, 0]
          }
        }),
      },
      {
        text: 'Priere',
        style: 'label',
        margin: [0, 10, 0, 0]
      },
      {
        text: filteredParts.prayers[1] && filteredParts.prayers[1].assignee ? `${filteredParts.prayers[1].assignee.firstName} ${filteredParts.prayers[1].assignee.lastName}` : '',
        style: 'value'
      },
      // {
      //   svg: '<svg xmlns="http://www.w3.org/2000/svg" width="1166" height="1" viewBox="0 0 1166 1"><line id="Line_13" data-name="Line 13" x2="1166" transform="translate(0 0.5)" fill="none" stroke="#707070" stroke-width="1"/></svg>',
      //   width: 520,
      //   margin: [0, 10, 0, 1],
      // },
      // {
      //   columns: [
      //     [
      //       {
      //         text: 'Président',
      //         style: 'label'
      //       },
      //       {
      //         text:filteredParts.chairmans[1] && filteredParts.chairmans[1].assignee ? `${filteredParts.chairmans[1].assignee.firstName} ${filteredParts.chairmans[1].assignee.lastName}` : '',
      //         style: 'value'
      //       }
      //     ],
      //     [
      //       {
      //         text: 'Priere',
      //         style: 'label'
      //       },
      //       {
      //         text:filteredParts.prayers[2] && filteredParts.prayers[2].assignee ? `${filteredParts.prayers[2].assignee.firstName} ${filteredParts.prayers[2].assignee.lastName}` : '',
      //         style: 'value'
      //       }
      //     ]
      //   ],
      //   margin: [0, 20, 0, 1]
      // },
      // {
      //   text:filteredParts.talk[0] && filteredParts.talk[0].title.length > 0 ? filteredParts.talk[0].title : 'Plan Du Discours',
      //   style: "weekend",
      //   margin: [0, 15]
      // },
      // {
      //   columns: [
      //       [
      //         {
      //           text: 'Orateur',
      //           style: "label"
      //         },
      //         {
      //           text:filteredParts.talk[0] && filteredParts.talk[0].assignee ? `${filteredParts.talk[0].assignee.firstName} ${filteredParts.
      //             talk[0].assignee.lastName}` : '',
      //           style: "value",
      //         }
      //       ],
      //       [
      //         {
      //           text: 'Congrégation',
      //           style: "label",
      //         },
      //         {
      //           text: '',
      //           style: "value",
      //         }
      //       ]
      //   ]
      // },
      // {
      //   text: 'Etude de la Tour de Garde',
      //   style: "weekend",
      //   margin: [0, 15]
      // },
      // {
      //   columns: [
      //       [
      //         {
      //           text: 'Conducteur',
      //           style: "label"
      //         },
      //         {
      //           text:filteredParts.wt[0] && filteredParts.wt[0].assignee ? `${filteredParts.wt[0].assignee.firstName} ${filteredParts.wt[1].assignee.lastName}` : '',
      //           style: "value",
      //         }
      //       ],
      //       [
      //         {
      //           text: 'Lecteur',
      //           style: "label",
      //         },
      //         {
      //           text:filteredParts.wt[0] && filteredParts.wt[0].assistant ? `${filteredParts.wt[0].assistant.firstName} ${filteredParts.wt[0].assistant.lastName}` : '',
      //           style: "value",
      //         }
      //       ],
      //   ]
      // },
      // [
      //   {
      //     text: 'Priere',
      //     style: 'label'
      //   },
      //   {
      //     text:filteredParts.prayers[3] && filteredParts.prayers[3].assignee ? `${filteredParts.prayers[3].assignee.firstName} ${filteredParts.prayers[3].assignee.lastName}` : "",
      //     style: 'value',

      //   },
      // ],
      {
        text: '',
        pageBreak: weekProgram.id == weeks[weeks.length - 1].id ? '' : 'after',
        margin: [0, 0, 0, 50]
      })
  }

  downloadMonthPDF(weeks: WeekProgram[]) : Promise<boolean> {
    this.docDefinition.content = []
    return new Promise((resolve, reject) => {


    this.docDefinition.info.title = `Schedule - ${moment(weeks[0].date.toDate()).format('MMMM yyyy')}.pdf`;

    this.forage.getItem('congregationRef').then(path => {
      this.forage.getItem('congregation').then(congregation => {

      weeks.forEach(week => {
        this.fireStore.fireStore.collection<Part>(`${path}/parts`)
        .valueChanges()
        .pipe(
          map(data => data.filter(p => p.week == week.id)),
          take(1))
        .subscribe(parts => {
          if (parts) {
             this.parseSinglePage(congregation, week, parts, weeks)
          }
        })
       })

      setTimeout(() => {
        pdfMake.createPdf(this.docDefinition).download(`Schedule - ${moment(weeks[0].date.toDate()).format('MMMM yyyy')}.pdf`)
        resolve(true)
      }, 3000)
    })
  })
})

  }

  emailMonthPDF(weeks: WeekProgram[]) {
    this.docDefinition.content = []
    this.docDefinition.info.title = `Schedule - ${moment(weeks[0].date.toDate()).format('MMMM yyyy')}.pdf`;
    this.forage.getItem('congregationRef').then(path => {
      this.forage.getItem<Congregation>('congregation').then(congregation => {
    weeks.forEach(week => {
      this.fireStore.fireStore.collection<Part>(`${path}/parts`)
      .valueChanges()
      .pipe(
        map(data => data.filter(p => p.week == week.id)),
        take(1))
      .subscribe(parts => {
        if (parts) {
           this.parseSinglePage(congregation, week, parts, weeks)
        }
      })
    })
    const pdfDocGenerator = pdfMake.createPdf(this.docDefinition);
    this.fireStore.fireStore.collection<Publisher>(`${path}/publishers`, ref => ref.where('gender', '==', Gender.brother)).get().toPromise().then(publishers => {

      setTimeout(() => {

        pdfDocGenerator.getBase64((data) => {
          publishers.docs.forEach(pub => {
            if (pub.exists) {
              let _pub: Publisher = pub.data()
              if (_pub.email) {

                let msg: EmailMessage = {
                    to: _pub.email,
                    from: `${congregation.properties.orgName} <assemblee.app@gmail.com>`,
                    subject: this.docDefinition.info.title,
                    html: `<p>Hello ${_pub.lastName} ${_pub.firstName},</p><p>Please find attached the meeting schedule for <strong>${moment(weeks[0].date.toDate()).format('MMMM yyyy')}</strong>.</p><p>Sincerely,<br>${congregation.properties.orgName}</p>`,
                    attachments: [
                      {
                        content: data,
                        type: 'application/pdf',
                        filename: this.docDefinition.info.title
                      }
                    ]
                }
                this.emailService.sendEmail(msg)
              }
            }
          })
        })
      }, 3000)
    })
  })
  })
  }
}
