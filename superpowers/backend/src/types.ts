export interface Powerstats {
  intelligence: string;
  strength: string;
  speed: string;
  durability: string;
  power: string;
  combat: string;
}

export interface Appearance {
  gender: string;
  race: string | null;
  height: string[];
  weight: string[];
}

export interface Biography {
  fullName: string;
  alterEgos: string;
  aliases: string[];
  placeOfBirth: string;
  firstAppearance: string;
  publisher: string | null;
  alignment: string;
}

export interface Work {
  occupation: string;
  base: string;
}

export interface Connections {
  groupAffiliation: string;
  relatives: string;
}

export interface Image {
  url: string;
}

export interface Character {
  id: string;
  name: string;
  slug: string;
  powerstats: Powerstats;
  biography: Biography;
  appearance: Appearance;
  work: Work;
  connections: Connections;
  image: Image;
}

export interface CharacterData {
  characters: Character[];
  metadata: {
    totalCount: number;
    seededAt: string;
    source: string;
  };
}
