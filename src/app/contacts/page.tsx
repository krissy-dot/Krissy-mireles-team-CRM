import PageHeader from "@/components/PageHeader";
import ContactsView from "@/components/ContactsView";
import { contacts } from "@/lib/mock-data";

export default function ContactsPage() {
  return (
    <div>
      <PageHeader title="Contacts" subtitle={`${contacts.length} people in your pipeline`} />
      <div className="px-8 pb-8">
        <ContactsView contacts={contacts} />
      </div>
    </div>
  );
}
