import Link from "next/link";

export default function CharactersPage() {
  return (
    <div className="p-8">
      <Link href="/characters/builder" className="p-8">Go to Character Builder</Link>
    </div>
    
    );
}