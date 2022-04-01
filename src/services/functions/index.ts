import { 
    getFunctions, 
    httpsCallable 
} from 'firebase/functions';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { FireLanguage } from '../../models/congregation';
import { 
    DownloadWeekProgram, 
    FetchCongregationsFromGeolocation, 
    GeoLocationList
} from '../../models/functions';

const functions = getFunctions();

    //  // ADD NEW LANGUAGE LIBRARY //
    //  const addLanguage = async (languageCode: 'F'): Promise<FireLanguage> => {
    //     const res = await addNewLanguage(languageCode);
    //     return res.data;
    //  }
 export const addNewLanguage = httpsCallable<string, FireLanguage>(functions, 'addNewLanguage');

    //  const addWeekSchedule = async () => {
    //     const language: FireLanguage = await addLanguage('F');;
    //     const date = new Date()
    //     await downloadWeekProgram({
    //        date,
    //        language
    //     })
    //  }
    
export const downloadWeekProgram = httpsCallable<DownloadWeekProgram, void>(functions, 'downloadWeekProgram');

    //  const getCongregations = async (languageCode: string, res: Response) => {
    //     const _geolocation: Location = {
    //         latitude: 41.159184,
    //         longitude: -74.254738
    //     }
    //     const result = await getCongregationsFromGeolocation({ languageCode: languageCode, location: _geolocation })
    //     const congregations: GeoLocationList[] =  result.data;
    //  }
export const getCongregationsFromGeolocation = httpsCallable<FetchCongregationsFromGeolocation, GeoLocationList[]>(functions, 'fetchCongregationsFromGeolocation');

export const sendEmail = httpsCallable<Mail.Options, SMTPTransport.SentMessageInfo>(functions, 'emailData')