import PageHeader from "@/components/PageHeader";
import PipelineView from "@/components/PipelineView";
import { contacts } from "@/lib/mock-data";

export default function PipelinePage() {
  return (
    <div>
      <PageHeader title="Pipeline" subtitle="Every contact, by stage — drag a card to move it" />
      <div className="px-8 pb-8">
        <PipelineView contacts={contacts} />
      </div>
    </div>
  );
}
