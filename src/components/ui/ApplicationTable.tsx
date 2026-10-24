import type { Application } from "../../types/applications";
import { programLabels } from "../../types/applications";
import StatusBadge from "./StatusBadge";

type ApplicationTableProps = {
  applications: Application[];
  onViewApplication: (application: Application) => void;
};

function formatDate(dateString: string): string {
  if (!dateString) return "-";

  const normalizedDate = dateString.includes("T")
      ? dateString
      : dateString.replace(" ", "T") + "Z";

  const date = new Date(normalizedDate);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleString("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ApplicationTable({
  applications,
  onViewApplication,
}: ApplicationTableProps) {
  return (
      <div className="application-table">
        <table>
          <thead>
          <tr>
            <th>Reference No.</th>
            <th>Applicant</th>
            <th>Program</th>
            <th>Submitted At</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
          </thead>

          <tbody>
          {applications.length === 0 ? (
              <tr>
                <td colSpan={6} className="application-table__empty">
                  No applications found.
                </td>
              </tr>
          ) : (
              applications.map((application) => (
                  <tr key={application.id}>
                    <td className="application-table__reference">
                      {application.reference_no || "-"}
                    </td>

                    <td>
                      <div className="application-table__applicant">
                        <strong>{application.applicant_name}</strong>

                        <span>
                            {application.applicant_identification_no || "-"}
                          </span>
                      </div>
                    </td>

                    <td>
                      {programLabels[application.program_id] ||
                          application.program_id}
                    </td>

                    <td>
                      {formatDate(application.submitted_at)}
                    </td>

                    <td>
                      <StatusBadge status={application.status} />
                    </td>

                    <td>
                      <button
                          type="button"
                          className="application-table__action"
                          onClick={() => onViewApplication(application)}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
              ))
          )}
          </tbody>
        </table>
      </div>
  );
}
