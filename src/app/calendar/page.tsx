import PageHeader from "@/components/PageHeader";
import CalendarView from "@/components/CalendarView";
import { contacts, events } from "@/lib/mock-data";

export default function CalendarPage() {
  return (
    <div>
      <PageHeader title="Calendar" subtitle="Showings, closings, and appointments" />
      <div className="px-8 pb-8">
        <CalendarView contacts={contacts} events={events} />
      </div>
    </div>
  );
}
