import { CORS_URI, WOL_API_URI, WOL_LIB_SEGMENT } from "../../constants";
import { WOLLanguage, WOLLanguages } from "../../models/congregation";


export const getAllLibraries = async (): Promise<WOLLanguage[]> => {
    try {
       const response: Response = await fetch(CORS_URI + WOL_API_URI + WOL_LIB_SEGMENT);
       const json: WOLLanguages = await response.json();
       const data: WOLLanguage[] = json.items ?? [];
       return data;
    } catch (error) {
       throw error;
    }
 }