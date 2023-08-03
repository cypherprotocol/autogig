import { PendingGigs } from "@/components/pending-gigs";

export default function Home() {
  return (
    <div className="flex w-full max-w-7xl flex-col pt-8">
      {/* @ts-expect-error */}
      <PendingGigs />
    </div>
  );
}
