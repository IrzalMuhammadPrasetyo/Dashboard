import { Dashboard } from "@/components/dashboard/dashboard";

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <Dashboard />
      </div>
    </main>
  );
}
