import { CharacterClass } from "@/app/lib/classmodel";

// mock classes for testing
const mockClasses: CharacterClass[] = [
  {
    name: "Warrior",
    description: "A fierce combatant with exceptional strength and combat prowess. Masters of weapons and armor.",
    attributes: {
      strength: 16,
      dexterity: 12,
      constitution: 14,
      intelligence: 8,
      wisdom: 10,
      charisma: 10,
    },
  },
  {
    name: "Mage",
    description: "A wielder of arcane magic with vast knowledge. Commands the elements and reality itself.",
    attributes: {
      strength: 8,
      dexterity: 12,
      constitution: 10,
      intelligence: 16,
      wisdom: 14,
      charisma: 10,
    },
  },
  {
    name: "Rogue",
    description: "A cunning and agile character skilled in stealth and precision. Expert in ambush tactics.",
    attributes: {
      strength: 10,
      dexterity: 16,
      constitution: 12,
      intelligence: 12,
      wisdom: 10,
      charisma: 12,
    },
  },
  {
    name: "Cleric",
    description: "A divine spellcaster devoted to a deity. Heals allies and smites enemies with holy power.",
    attributes: {
      strength: 12,
      dexterity: 10,
      constitution: 12,
      intelligence: 10,
      wisdom: 16,
      charisma: 12,
    },
  },
  {
    name: "Ranger",
    description: "A skilled hunter and tracker, master of ranged combat and nature magic.",
    attributes: {
      strength: 12,
      dexterity: 14,
      constitution: 12,
      intelligence: 10,
      wisdom: 14,
      charisma: 10,
    },
  },
  {
    name: "Paladin",
    description: "A holy warrior bound by sacred oaths. Combines martial prowess with divine magic.",
    attributes: {
      strength: 14,
      dexterity: 10,
      constitution: 14,
      intelligence: 10,
      wisdom: 12,
      charisma: 14,
    },
  },
];


export default function CharacterBuilderClassPage() {
  return (
    <div className="min-h-screen flex bg-linear-to-br from-amber-50 to-orange-100 p-7">
      <div className="text-2xl">
        Escoge tu clase
      </div>      
    </div>
  );
}