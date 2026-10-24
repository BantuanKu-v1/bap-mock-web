import type { ApplicationStatus } from "../../types/applications";
import { applicationStatusLabels } from "../../types/applications";

type StatusBadgeProps = {
  status: ApplicationStatus;
};

export default function StatusBadge({
    status
}: StatusBadgeProps) {
  return (
      <span className={`status-badge status-badge--${status}`}>
        {applicationStatusLabels[status]}
      </span>
  );
}
