const BASER_URL = "https://www.dnd5eapi.co/api/2014";

interface Race{
    name: string;
}

export async function getListOfRaces(): Promise<Race[]> {
    // In a real application, this data might come from a database or external API
    const response = await fetch(BASER_URL + "/races",{cache:'force-cache',next:{revalidate:false}});
    if (!response.ok) {
        throw new Error("Failed to fetch races");
    }
    const races: Race[] = await response.json().then(data => data.results);
    return races;
}