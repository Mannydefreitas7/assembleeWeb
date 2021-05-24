import { Congregation } from '../models/congregation';
import { Part, WeekProgram } from '../models/wol';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {
  TDocumentDefinitions,
  Content,
} from 'pdfmake/interfaces';
import { ExportService } from './export';
import firebase from 'firebase/app';
import moment from 'moment';
import Mail from 'nodemailer/lib/mailer';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export class EmailService {
  emailPartPDF(
    part: Part,
    sending: Mail.Address,
    congregation: Congregation,
    functions: firebase.functions.Functions
  ): Promise<firebase.functions.HttpsCallableResult> {
    const exportService = new ExportService();
    const send = functions.httpsCallable('emailData');
    // eslint-disable-next-line
    const btn = `<a style="padding: 5px 10px; color: #ffffff; background-color: #198754; text-decoration: none; border-radius: 5px;" href="https://assemblee.web.app/confirm?cong=${congregation.id}&week=${part.week}&part=${part.id}">Confirm</a>`;

    return new Promise(async (resolve, reject) => {
      if (part.assignee) {
        let content: Content = exportService.parsePart(part);
        exportService.partDefinition.content = content;
        exportService.partDefinition.styles = exportService.partStyles;
        const pdfDocGenerator = pdfMake.createPdf(exportService.partDefinition);

        pdfDocGenerator.getBase64((data) => {
          if (part?.assignee?.email) {
            try {
             
              let email: Mail.Address = {
                name: `${part?.assignee?.firstName} ${part?.assignee?.lastName}`,
                address: part.assignee.email,
              };
              let message: Mail.Options = {
                from: sending,
                cc: sending,
                subject: exportService.partDefinition.info?.title,
                to: email,
                html: `<p>Hello ${part.assignee.lastName} ${part.assignee.firstName
                },</p><p>Please find attached your meeting assignment for <strong>${moment(part.date.toDate()).format('MMMM DD yyyy')}</strong>.</p><p>Please confirm if date works for you.</p><p>Sincerely,<br>${congregation?.properties?.orgName ?? ""}</p>`,
                attachments: [
                  {
                    content: data,
                    encoding: 'base64',
                    filename: exportService.partDefinition.info?.title,
                    contentType: 'application/pdf',
                  },
                ],
              };
              let res = send(message);
              resolve(res);
            } catch (error) {
              reject(error);
            }
          }
        });
      }
    });
  }

  async emailSchedulePDF(
    weeks: WeekProgram[],
    emails: Mail.Address[],
    sending: Mail.Address,
    congregation: Congregation,
    fireStore: firebase.firestore.Firestore,
    functions: firebase.functions.Functions
  ): Promise<firebase.functions.HttpsCallableResult> {
    const exportService = new ExportService();
    const send = functions.httpsCallable('emailData');
    return new Promise(async (resolve, reject) => {
      const docDefinition: TDocumentDefinitions = {
        content: [],
        info: {
          title: `Meeting Schedule - ${
            weeks.length > 1
              ? moment(weeks[0].date.toDate()).format('MMMM yyyy')
              : weeks[0].range
          }.pdf`,
        },
        styles: exportService.docStyles,
      };
      try {
        const promises: Promise<
          firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
        >[] = weeks.map((week) => {
          let docs = fireStore
            .collection(
              `congregations/${congregation.id}/weeks/${week.id}/parts`
            )
            .get();
          return docs;
        });

        let all = await Promise.all(promises);
        let arrayOfContent = all.map((a) => {
          let parts: Part[] = a.docs.map((d) => d.data());
          let week: WeekProgram = weeks.filter(
            (w) => w.id === parts[0].week
          )[0];
          return exportService.parsePDFPage(congregation, week, parts);
        });

        if (arrayOfContent.length > 0) {
          docDefinition.content =
            weeks.length > 1
              ? arrayOfContent.map((array) => [
                  array,
                  {
                    text: '',
                    pageBreak: 'after',
                  },
                ])
              : arrayOfContent;

          let message: Mail.Options = {
            from: sending,
            subject: docDefinition.info?.title,
            to: emails,
            html: `<p>Hello everyone,</p><p>Please find attached the meeting schedule for <strong>${moment(
              weeks[0].date.toDate()
            ).format('MMMM yyyy')}</strong>.</p><p>Sincerely,<br>${
              congregation.properties?.orgName
            }</p>`,
          };

          return setTimeout(() => {
            const pdfDocGenerator = pdfMake.createPdf(docDefinition);
            pdfDocGenerator.getBase64((data) => {
              if (data) {
                let attachment: Mail.Attachment = {
                  content: data,
                  contentType: 'application/pdf',
                  encoding: 'base64',
                  filename: docDefinition.info?.title,
                };
                message.attachments = [attachment];
                const res = send(message);
                resolve(res);
              }
            });
          }, 3000);
        }
        return reject('There was an error fetching the content');
      } catch (err) {
        console.log(err);
      }
    });
  }
}
