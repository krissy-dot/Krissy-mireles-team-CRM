import { TaskPriority } from "@/lib/types";

const STYLES: Record<TaskPriority, string> = {
  urgent: "bg-red-50 text-red-600 border-red-200",
  high: "bg-orange-50 text-orange-600 border-orange-200",
  normal: "bg-gray-50 text-gray-500 border-gray-200",
};

const LABEL: Record<TaskPriority, string> = {
  urgent: "Urgent",
  high: "High",
  normal: "Normal",
};

export default function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border whitespace-nowrap ${STYLES[priority]}`}
    >
      {LABEL[priority]}
    </span>
  );
}
