import Link from 'next/link';

export default function CampaignPage() {
  return (
    <div>
       <Link href="/campaign/builder" className="p-8">Go to Campaign Builder</Link>
    </div>
  );
}