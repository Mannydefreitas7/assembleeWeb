import { Publisher } from "../../models/publisher";
import exportFromJSON from 'export-from-json'
import { Congregation } from "../../models/congregation";

export const exportPublishers = (publishers: Publisher[], congregation: Congregation) => {
        const fileName: string = `${congregation.properties?.orgName}-publishers.json`;
        const exportType = exportFromJSON.types.json;
        exportFromJSON({data: publishers, fileName, exportType})
}

export const importPublishers = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
        const binaryString = reader.result?.toString();
        if (binaryString) {
            const publishers: Publisher[] = JSON.parse(binaryString);
            return publishers;
        } 
    }
    return reader.readAsArrayBuffer(file);
}
