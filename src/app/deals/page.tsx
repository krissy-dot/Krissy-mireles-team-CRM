import PageHeader from "@/components/PageHeader";
import DealsView from "@/components/DealsView";
import { contacts, deals } from "@/lib/mock-data";

export default function DealsPage() {
  return (
    <div>
      <PageHeader title="Deals" subtitle="Every transaction, by stage and value" />
      <div className="px-8 pb-8">
        <DealsView contacts={contacts} deals={deals} />
      </div>
    </div>
  );
}
