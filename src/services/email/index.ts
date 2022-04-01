import moment from "moment";
import Mail from "nodemailer/lib/mailer";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { Congregation } from "../../models/congregation";
import { Part, WeekProgram } from '../../models/wol';
import { sendEmail } from "../functions";
import { docStyles } from "../pdf/styles";

export const emailPartPDF = async (
    part: Part,
    sending: Mail.Address,
    cc: Mail.Address,
    bcc: Mail.Address,
    congregation: Congregation,
    attachment: Mail.Attachment,
  ): Promise<string | undefined> => {
      
    // eslint-disable-next-line
    const btn: string = `<a style="padding: 5px 10px; color: #ffffff; background-color: #198754; text-decoration: none; border-radius: 5px;" href="https://assemblee.web.app/confirm?cong=${congregation.id}&week=${part.week}&part=${part.id}">Confirm</a>`;

    const html: string = `<p>Hello ${part?.assignee?.lastName} ${part?.assignee?.firstName
    },</p><p>Please find attached your meeting assignment for <strong>${moment(part.date.toDate()).format('MMMM DD yyyy')}</strong>.</p><p>Please confirm if date works for you.</p><p>Sincerely,<br>${congregation?.properties?.orgName ?? ""}</p>`

    if (part.assignee && part.assignee.email) {

        try {
            const to: Mail.Address = {
                name: `${part.assignee.firstName} ${part.assignee.lastName}`,
                address: part.assignee.email,
            };
             
            let cc: Mail.Address = {
                name: '',
                address: ''
            }

            if (part.assistant && part.assistant.email) {
                cc.address = part.assistant.email
                cc.name = `${part.assistant.firstName} ${part.assistant.lastName}`
            }
            const message: Mail.Options = {
                from: sending,
                cc,
                bcc,
                subject: `Meeting Assignment`,
                to,
                html,
                attachments: [attachment]
            };
            const result = await sendEmail(message);
            return result.data.messageId;
        } catch (error) {  throw error }
    }
}

export const emailSchedulePDF = async (emails: Mail.Address[], sending: Mail.Address, attachments: Mail.Attachment[], congregation: Congregation, date: Date, week?: WeekProgram): Promise<string> => {
    const filename: string = `Meeting Schedule - ${week ?
        week.range :
        moment(date).format('MMMM yyyy')}.pdf`;

    const docDefinition: TDocumentDefinitions = {
        content: [],
        info: { title: filename },
        styles: docStyles,
    };

    try {

        const message: Mail.Options = {
            from: sending,
            subject: docDefinition.info?.title,
            to: emails,
            attachments,
            html: `<p>Hello,</p><p>Please find attached the meeting schedule <strong></strong>.</p><p>Sincerely,<br>${congregation.properties?.orgName}</p>`,
        };

        const result = await sendEmail(message);
        return result.data.messageId;
      } catch (error) { throw error }
  }
