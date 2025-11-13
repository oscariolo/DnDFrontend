import { ApolloClient, InMemoryCache, gql, HttpLink } from '@apollo/client';

const GRAPHQL_URL = "https://www.dnd5eapi.co/graphql/2014"; // Replace with your GraphQL endpoint

// Create Apollo Client instance
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

export interface RaceResponse {
  name: string;
  size_description: string;
  alignment?: string;
  age?: string;
  traits?: {name:string; desc:string}[];

}

// GraphQL query for races
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

// GraphQL query for skills
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
    throw new Error("Failed to fetch races");
  }
}

export async function getFullRaceData(): Promise<RaceResponse[]> {
  try {
    const { data } = await client.query<{
      races: RaceResponse[];
    }>({
      query: GET_RACES,
    });
    if (!data || !data.races) {
      return [];
    }
    return data.races;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch races");
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
    throw new Error("Failed to fetch skills");
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
        throw new Error("Failed to fetch tools");
    } 
}