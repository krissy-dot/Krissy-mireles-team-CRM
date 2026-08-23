import { Stage } from "@/lib/types";

const STYLES: Record<Stage, string> = {
  "New Lead": "bg-blue-50 text-blue-700 border-blue-200",
  Contacted: "bg-purple-50 text-purple-700 border-purple-200",
  Showing: "bg-amber-50 text-amber-700 border-amber-200",
  "Under Contract": "bg-orange-50 text-orange-700 border-orange-200",
  Closed: "bg-green-50 text-green-700 border-green-200",
  "Past Client": "bg-gray-100 text-gray-600 border-gray-200",
};

export default function StageBadge({ stage }: { stage: Stage }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${STYLES[stage]}`}
    >
      {stage}
    </span>
  );
}
