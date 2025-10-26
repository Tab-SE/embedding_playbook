import { TMobileTransactions } from '@/components/Mockups/TMobileTransactions';

export default function SupportPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
            <p className="text-muted-foreground">
              Manage customer support tickets and inquiries
            </p>
          </div>
        </div>
        <TMobileTransactions title="All Support Tickets" />
      </main>
    </div>
  );
}
