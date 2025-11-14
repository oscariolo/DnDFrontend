export interface Attributes{
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface CharacterClass{
  name: string;
  description: string;
  backstory: string;
  attributes: Attributes;
}
