import { Gender, Privilege, Publisher, SafePublisher } from "./publisher";
import { Parent, Part } from "./wol";

export interface PartSafe {
    date: any;
    id: string;
    privilege: SafePublisher[] | string[];
    assignee: Publisher;
    gender: Gender[],
    hasAssistant: boolean;
    assistant: SafePublisher;
    length: string;
    lengthTime: number;
    hasDiscussion: boolean;
    title: string;
    subTitle: string;
    isConfirmed: boolean;
    isEmailed: boolean;
    index: number;
    parent: Parent;
    path: string;
    week: string;
    isCalendarAdded: boolean;
    isSymposium: boolean;
    talkNumber: string;
    songNumber: number;
    parts: PartSafe[];
 }