import { ApolloClient, InMemoryCache, gql, HttpLink } from '@apollo/client';
import { RaceDetails } from '../models/charactermodel';

const GRAPHQL_URL = "https://www.dnd5eapi.co/graphql/2014";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
const client = new ApolloClient({
  link: new HttpLink({
    uri: GRAPHQL_URL,
    headers: {
      "Content-Type": "application/json",
    },
  }),
  cache: new InMemoryCache(),
});

interface queryResponse {
  name: string;
  description: string;
}
const GET_RACES = gql`
  query Races {
    races {
      name
      alignment
      age
      size_description
      traits{
        name
        desc
      }
    }
  }
`;
const GET_SKILLS = gql`
  query Skills {
    skills {
      name
      desc
    }
  }
`;

const GET_TOOLS = gql`query Features {
  equipments {
    ... on Tool {
      name
      desc
    }
  }
}
`;

export async function getListOfRaces(): Promise<queryResponse[]> {
  try {
    const { data } = await client.query<{
      races: {
        name: string;
        size_description: string;
        alignment?: string;
        age?: string;
        traits?: { name: string; desc: string }[];
      }[];
    }>({
      query: GET_RACES,
    });
    if (!data || !data.races) {
      return [];
    }
    const parsedData: queryResponse[] = data.races.map((race) => ({
      name: race.name,
      description: race.size_description,
    }));
    return parsedData;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener razas");
  }
}

export async function getFullRaceData(): Promise<RaceDetails[]> {
  try {
    const { data } = await client.query<{
      races: RaceDetails[];
    }>({
      query: GET_RACES,
    });
    if (!data || !data.races) {
      return [];
    }
    return data.races;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener razas");
  }
}

export async function getListOfSkills(): Promise<queryResponse[]> {
  try {
    const { data } = await client.query<{ skills: { name: string; desc: string[] }[] }>({
      query: GET_SKILLS,
    });
    

    if(!data || !data.skills) {
      return [];
    }
    const parsedData: queryResponse[] = data.skills.map((skill) => ({
      name: skill.name,
      description: Array.isArray(skill.desc) ? skill.desc.join(" ") : String(skill.desc || ""),
    }));
    return parsedData;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener habilidades");
  }
}

export async function getListOfTools(): Promise<queryResponse[]> {
    try {
        const { data } = await client.query<{ equipments: { name: string; desc: string[] }[] }>({
            query: GET_TOOLS,
        });
        if(!data || !data.equipments) {
            return [];
        }
        const parsedData: queryResponse[] = data.equipments.filter((tool)=>tool.name).
            map((tool) => (
            {
            name: tool.name,
            description: Array.isArray(tool.desc) ? tool.desc.join(" ") : String(tool.desc || ""),
            }));
        return parsedData;
    } catch (error) {
        console.error(error);
        throw new Error("Error al obtener herramientas");
    } 
}

export async function createCharacter(characterData: any, accessToken?: string) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/characters`, {
      method: 'POST',
      headers,
      body: JSON.stringify(characterData),
    });
    
    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Unknown error');
      throw new Error(`Error ${res.status}: ${errorText}`);
    }
    
    return res.json();
  } catch (error) {
    console.error('Error creating character:', error);
    throw error;
  }
}

export async function getAllCharacters() {
  const res = await fetch(`${BACKEND_URL}/api/characters`, {
  });
  if (!res.ok) throw new Error('Error al obtener personajes');
  return res.json();
}

export async function getAllPlayableCharacters(accessToken: string) {
  const res = await fetch(`${BACKEND_URL}/api/characters/playable`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) throw new Error('Error al obtener personajes jugables');
  return res.json();
}

export async function getAllCharactersByUserId(userId: string, accessToken: string) {
  const res = await fetch(`${BACKEND_URL}/api/characters/user/${userId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) throw new Error('Error al obtener personajes del usuario');
  return res.json();
}
