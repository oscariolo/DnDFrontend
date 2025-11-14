import { Attributes } from "./classmodel";


export interface CustomCharacter{
    name: string;
    class: string;
    currentAttributes: Attributes;
    race: string;
    description: DescriptionContent;
    skills: StarterItem[];
    imgsrc?: string;
    startItems?: StarterItem[];
}

export interface DescriptionContent{
    alignment: string;
    physicalDescription: string;
    personalityTraits: string;
    backstory: string;
}

export interface RaceDetails{
    name: string;
    size_description: string;
    alignment?: string;
    age?: string;
    traits?: {name:string; desc:string}[];
}

export interface StarterItem{
    name: string;
    description: string;
}