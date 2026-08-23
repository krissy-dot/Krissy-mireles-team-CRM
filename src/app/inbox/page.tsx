import PageHeader from "@/components/PageHeader";
import InboxView from "@/components/InboxView";
import { contacts, messages } from "@/lib/mock-data";

export default function InboxPage() {
  return (
    <div>
      <PageHeader title="Inbox" subtitle="Every text and email, in one thread per contact" />
      <div className="px-8 pb-8">
        <InboxView contacts={contacts} messages={messages} />
      </div>
    </div>
  );
}
