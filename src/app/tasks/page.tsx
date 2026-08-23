import PageHeader from "@/components/PageHeader";
import TasksView from "@/components/TasksView";
import { contacts, tasks } from "@/lib/mock-data";

export default function TasksPage() {
  return (
    <div>
      <PageHeader title="Follow-Ups" subtitle="Everything on your plate, ranked by priority" />
      <div className="px-8 pb-8">
        <TasksView contacts={contacts} tasks={tasks} />
      </div>
    </div>
  );
}
