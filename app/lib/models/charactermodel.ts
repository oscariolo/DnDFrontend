import { Attributes } from "./classmodel";


interface CustomCharacter{
    name: string;
    class: string;
    currentAttributes: Attributes;
    race: string;
    description: string;
    skills: string[];
    imgsrc?: string;
    startItems?: string[];
}