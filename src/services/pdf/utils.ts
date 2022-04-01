import moment from "moment";
import { Content } from "pdfmake/interfaces";
import { Congregation } from "../../models/congregation";
import { Part, WeekProgram } from '../../models/wol';
import { apply, chairmans, life, prayers, talk, treasures, wt } from "../../shared/methods";

export const parsePart = (part: Part):Content => {
    let content : Content = [
      {
        text: 'Our Christian Life and Ministry\nMeeting Assignment\n'.toUpperCase(),
      //  text: title.toUpperCase(),
        style: 'title',
        margin: [0, 0, 0, 20],
      },
      {
        text: [
          {
            text: `Name: `,
            style: 'label',
          },
          {
            text: `${
              part.assignee
                ? part?.assignee?.firstName +
                  ' ' +
                  part.assignee.lastName
                : ''
            }`,
            style: 'value',
          },
        ],
        margin: [0, 0, 0, 5],
      },
      {
        text: [
          {
            text: `Assistant: `,
            style: 'label',
          },
          {
            text: `${part.assistant ?
              part.assistant?.firstName?.slice(0, 1).toUpperCase() +
              '. ' +
              part?.assistant?.lastName : ''
            }`,
            style: 'value',
          },
        ],
        margin: [0, 0, 0, 5],
      },
      {
        text: [
          {
            text: `Date: `,
            style: 'label',
          },
          {
            text: `${moment(part.date.toDate()).format('MMMM DD YYYY')}`,
            style: 'value',
          },
        ],
        margin: [0, 0, 0, 10],
      },
      {
        text: 'Assignment',
        style: 'label',
        margin: [0, 10, 0, 5],
      },
      {
        text: part.title ?? '',
        style: 'value',
        margin: [10, 0, 0, 10],
      },
      {
        text: 'To be given:',
        style: 'label',
        margin: [0, 0, 0, 5],
      },
      {
        text: 'Main Hall',
        style: 'value',
        margin: [10, 0, 0, 20],
      },
      {
        text: [
          {
            text: 'Note to student: ',
            style: 'noteLabel',
          },
          {
            text:
              'The source material and study point for your assignment can be found in the Life and Ministry Meeting Workbook. Please work on the listed study point, which is discussed in the Teaching brochure.',
            style: 'note',
          },
        ],
      },
    ]; 
    return content
}

export const parsePDFPage = (congInfo: Congregation, weekProgram: WeekProgram, parts: Part[]):Content => {
    const filteredParts = {
        prayers: prayers(parts),
        chairmans: chairmans(parts),
        treasures: treasures(parts),
        life: life(parts),
        apply: apply(parts),
        talk: talk(parts),
        wt: wt(parts)
    }
    const content: Content = 
        [{
          columns: [
            [
              {
                text: congInfo?.properties?.orgName ?? '',
                style: 'subheader',
              },
              {
                text: 'Programme de la Réunion',
                style: 'header',
              },
            ],
            {
              text: weekProgram?.range ?? '',
              alignment: 'right',
              margin: [0, 7],
              fontSize: 22,
              bold: true,
            },
          ],
          margin: [0, 20, 0, 0],
        },
        {
          svg:
            '<svg xmlns="http://www.w3.org/2000/svg" width="1166" height="1" viewBox="0 0 1166 1"><line id="Line_13" data-name="Line 13" x2="1166" transform="translate(0 0.5)" fill="none" stroke="#707070" stroke-width="1"/></svg>',
          width: 520,
          margin: [0, 3, 0, 10],
        },
        {
          columns: [
            [
              {
                text: 'Président',
                style: 'label',
              },
              {
                text: `${
                  filteredParts.chairmans[0]?.assignee?.firstName ?? ''
                } ${filteredParts.chairmans[0]?.assignee?.lastName ?? ''}`,
                style: 'value',
              },
            ],
            [
              {
                text: 'Priere',
                style: 'label',
              },
              {
                text:
                  filteredParts.prayers[0] && filteredParts.prayers[0].assignee
                    ? `${filteredParts.prayers[0].assignee.firstName} ${filteredParts.prayers[0].assignee.lastName}`
                    : '',
                style: 'value',
              },
            ],
          ],
        },
        {
          text: 'JOYAUX DE LA PAROLE DE DIEU',
          style: 'treasures',
          margin: [0, 15, 0, 0],
        },
        {
          markerColor: '#808080',
          ul: filteredParts.treasures.map((part) => {
            return {
              columns: [
                {
                  text: part.title ?? '',
                  style: 'part',
                },
                {
                  text:
                    part && part.assignee
                      ? `${part.assignee.firstName} ${part.assignee.lastName}`
                      : '',
                  style: 'partValue',
                },
              ],
              margin: [0, 10, 0, 0],
            };
          }),
        },
        {
          text: 'APPLIQUE-TOI AU MINISTÈRE',
          style: 'apply',
          margin: [0, 15, 0, 0],
        },
        {
          markerColor: '#808080',
          ul: filteredParts.apply.map((part) => {
            return {
              columns: [
                [
                  {
                    text: `${part?.title?.split(')')[0]})`,
                    style: 'part',
                  },
                  {
                    text: part && part.assistant ? `Interlocuteur` : '',
                    style: 'part',
                  },
                ],
                [
                  {
                    text:
                      part && part.assignee
                        ? `${part.assignee.firstName} ${part.assignee.lastName}`
                        : '',
                    style: 'partValue',
                  },
                  {
                    text:
                      part && part.assistant
                        ? `${part.assistant.firstName} ${part.assistant.lastName}`
                        : '',
                    style: 'partValue',
                  },
                ],
              ],
              margin: [0, 10, 0, 0],
            };
          }),
        },
        {
          text: 'VIE CHRÉTIENNE',
          style: 'life',
          margin: [0, 15, 0, 0],
        },
        {
          markerColor: '#808080',
          ul: filteredParts.life.map((part) => {
            return {
              columns: [
                [
                  {
                    text: `${part.title?.split(')')[0]})`,
                    style: 'part',
                  },
                  {
                    text: part && part.assistant ? `Lecteur` : '',
                    style: 'part',
                  },
                ],
                [
                  {
                    text:
                      part && part.assignee
                        ? `${part.assignee.firstName} ${part.assignee.lastName}`
                        : '',
                    style: 'partValue',
                  },
                  {
                    text:
                      part && part.assistant
                        ? `${part.assistant.firstName} ${part.assistant.lastName}`
                        : '',
                    style: 'partValue',
                  },
                ],
              ],
              margin: [0, 10, 0, 0],
            };
          }),
        },
        {
          text: 'Priere',
          style: 'label',
          margin: [0, 10, 0, 0],
        },
        {
          text:
            filteredParts.prayers[1] && filteredParts.prayers[1].assignee
              ? `${filteredParts.prayers[1].assignee.firstName} ${filteredParts.prayers[1].assignee.lastName}`
              : '',
          style: 'value',
        },
        {
          svg:
            '<svg xmlns="http://www.w3.org/2000/svg" width="1166" height="1" viewBox="0 0 1166 1"><line id="Line_13" data-name="Line 13" x2="1166" transform="translate(0 0.5)" fill="none" stroke="#707070" stroke-width="1"/></svg>',
          width: 520,
          margin: [0, 10, 0, 1],
        },
        {
          columns: [
            [
              {
                text: 'Président',
                style: 'label',
              },
              {
                text: `${
                  filteredParts?.chairmans[1]?.assignee?.firstName ?? ''
                } ${filteredParts?.chairmans[1]?.assignee?.lastName ?? ''}`,
                style: 'value',
              },
            ],
          ],
          margin: [0, 10, 0, 1],
        },
        {
          text: `Frère ${filteredParts.talk[0]?.assignee?.firstName ?? ""} ${filteredParts?.talk[0]?.assignee?.lastName ?? ""} - ${filteredParts?.talk[0]?.assignee?.speaker?.congregation?.properties?.orgName ?? ""}`,
          style: 'label',
          margin: [0, 10, 0, 0],
        },
        {
          text: filteredParts.talk[0]?.title ?? '',
          style: 'value',
        },
        {
          text: 'Etude de la Tour de Garde',
          style: 'weekend',
          margin: [0, 10, 0, 0],
        },
        {
          columns: [
            [
              {
                text: 'Conducteur',
                style: 'label',
              },
              {
                text: `${filteredParts?.wt[0]?.assignee?.firstName ?? ''} ${filteredParts?.wt[0]?.assignee?.lastName ?? ''}`,
                style: 'value',
              },
            ],
            [
              {
                text: 'Lecteur',
                style: 'label',
              },
              {
                text: `${filteredParts?.wt[0]?.assistant?.firstName ?? ""} ${filteredParts?.wt[0]?.assistant?.lastName ?? ''}`,
                style: 'value',
              },
            ],
          ],
          margin: [0, 5, 0, 0],
        }
      ];
      return content
  }