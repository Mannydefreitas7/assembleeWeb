import { Address } from "./address";
import { Publisher } from "./publisher";

export interface Group {
    id?: string;
    name?: string;
    number?: number;
    address?: string;
    overseer?: Publisher;
    description?: string;
    assistant?: Publisher;
}