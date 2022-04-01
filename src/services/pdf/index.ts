import { Congregation } from '../../models/congregation';
import { Parent, Part, WeekProgram } from '../../models/wol';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions, Content } from 'pdfmake/interfaces';
import moment from 'moment';
import { docStyles, partStyles } from './styles';
import { parsePart, parsePDFPage } from './utils';
import { DocumentData, Firestore, QuerySnapshot, collection, query, getDocs } from 'firebase/firestore';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
export let partDefinition: TDocumentDefinitions = {
    pageSize: 'B7',
    info: {
      title: 'Our Christian Life and Ministry Meeting Assignment',
    },
    content: [],
    pageMargins: [15, 10, 15, 10],
    styles: {},
};

export const downloadPartPDF = (part: Part) => {
    return new Promise((resolve, reject) => {
      if (part.assignee) {
        const content: Content = parsePart(part);
        const filename: string = `Meeting-Assignment-${moment(part.date.toDate()).format('MMM-DD-YY')}-${
            part?.assignee?.firstName?.slice(0, 1) + '-' + part?.assignee?.lastName}.pdf`;
        partDefinition.content = content;
        partDefinition.styles = partStyles;

        setTimeout(() => {
          pdfMake.createPdf(partDefinition).download(filename);
          resolve(true);
        }, 1000);
      }
    });
  }

export const downloadPDF = async (weeks: WeekProgram[], congregation: Congregation, db: Firestore):Promise<boolean> => {

    return new Promise(async (resolve, reject) => {

        const docDefinition : TDocumentDefinitions = {
            content : [],
            styles: docStyles
        }
        const promises : Promise<QuerySnapshot<DocumentData>>[] = weeks.map(week => {
                const collectionRef = collection(db,`congregations/${congregation.id}/weeks/${week.id}/parts`)
                const collectionQuery = query(collectionRef);
                const docsRef = getDocs(collectionQuery);
            return docsRef;
        })

        const allPromises = Promise.all(promises);
        const data = await allPromises;

        const arrayOfContent = data.map(a => {
            let parts : Part[] = a.docs.map(d => d.data());
            let week : WeekProgram = weeks.filter(w => w.id === parts[0].week)[0]
            return parsePDFPage(congregation, week, parts)
        });

        if (arrayOfContent.length > 0) {

            docDefinition.content = weeks.length > 1 ? 
            arrayOfContent.map(array => [
                array, {
                    text: '',
                    pageBreak: 'after'
                }]) : arrayOfContent;
                const filename: string = `Meeting Schedule - ${weeks.length > 1 ? 
                    moment(weeks[0].date.toDate()).format('MMMM yyyy') : 
                    weeks[0].range}.pdf`;
                pdfMake.createPdf(docDefinition).download(filename)
            return resolve(true);
          }
          return reject('There was an error fetching the content')
    });
  }
