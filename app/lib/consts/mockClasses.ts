import { CharacterClass } from "../models/classmodel";

export const mockClasses: CharacterClass[] = [
  {
    name: "Warrior",
    description: "A fierce combatant with exceptional strength and combat prowess. Masters of weapons and armor.",
    backstory: "Raised on the frontier, the Warrior learned to fight to protect their home from raiders and beasts. Years of battle have forged them into a disciplined soldier seeking honor, challenge, and a place in legend.",
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
    backstory: "Born with an innate spark of arcane talent, the Mage spent their youth buried in ancient tomes under the guidance of eccentric mentors. A catastrophic magical accident forced them to leave the academy, now roaming the world to master the powers that once nearly consumed them.",
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
    backstory: "Growing up in the shadows of a bustling city, the Rogue survived through wit, stealth, and nimble hands. After crossing the wrong syndicate, they fled their old life and now use their talents to uncover secrets—and outrun their past.",
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
    backstory: "Once saved from death by a divine vision, the Cleric devoted their life to serving their deity. They travel the world as a healer and protector, seeking to dispel corruption and test the limits of their faith.",
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
    backstory: "Raised deep within untamed wilderness, the Ranger learned to track, hunt, and survive long before speaking their first words. After their homeland fell to encroaching darkness, they set out to scout the world for answers—and vengeance.",
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
    backstory: "Sworn into a sacred order, the Paladin once served as a humble squire until an oathbound calling revealed their destiny. Armed with unwavering conviction, they now wander as a beacon of hope and judgment.",
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