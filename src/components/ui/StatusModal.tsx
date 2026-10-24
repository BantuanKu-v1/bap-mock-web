import { useEffect, useState } from "react";
import type {
  Application,
  ApplicationStatus,
} from "../../types/applications";
import {
  allowedStatusTransitions,
  applicationStatusLabels,
  programLabels,
} from "../../types/applications";
import StatusBadge from "./StatusBadge";

type StatusModalProps = {
  application: Application;
  onClose: () => void;
  onUpdateStatus: (
      applicationId: string,
      newStatus: ApplicationStatus
  ) => Promise<void>;
};

function parseApplicationData(data: string): Record<string, unknown> {
  try {
    const parsed: unknown = JSON.parse(data);

    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }

    return { value: parsed };
  } catch {
    return { raw_data: data };
  }
}

function formatFieldName(field: string): string {
  return field
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (character) => character.toUpperCase())
      .trim();
}

function formatFieldValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

export default function StatusModal({
  application,
  onClose,
  onUpdateStatus,
}: StatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | "">("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  const availableStatuses = allowedStatusTransitions[application.status];
  const applicationData = parseApplicationData(application.application_data);

  const handleUpdate = async () => {
    if (!selectedStatus || isUpdating) return;

    setIsUpdating(true);
    setError("");

    try {
      await onUpdateStatus(application.id, selectedStatus);
      onClose();
    } catch (error) {
      setError(
          error instanceof Error
              ? error.message
              : "Failed to update application status"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isUpdating) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, isUpdating]);

  return (
      <div
          className="status-modal"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isUpdating) {
              onClose();
            }
          }}
      >
        <div
            className="status-modal__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="status-modal-title"
        >
          <div className="status-modal__header">
            <div>
              <h2 id="status-modal-title">
                Application Details
              </h2>

              <p>
                {application.reference_no || application.id}
              </p>
            </div>

            <button
                type="button"
                className="status-modal__close"
                onClick={onClose}
                disabled={isUpdating}
                aria-label="Close modal"
            >
              ×
            </button>
          </div>

          <div className="status-modal__body">
            <section className="status-modal__section">
              <h3>Application Information</h3>

              <div className="status-modal__details">
                <div>
                  <span>Applicant Name</span>
                  <strong>{application.applicant_name}</strong>
                </div>

                <div>
                  <span>Identification No.</span>
                  <strong>
                    {application.applicant_identification_no || "-"}
                  </strong>
                </div>

                <div>
                  <span>Program</span>
                  <strong>
                    {programLabels[application.program_id] ||
                        application.program_id}
                  </strong>
                </div>

                <div>
                  <span>Source System</span>
                  <strong>{application.source_system}</strong>
                </div>

                <div>
                  <span>External Reference</span>
                  <strong>{application.external_reference}</strong>
                </div>

                <div>
                  <span>Current Status</span>
                  <StatusBadge status={application.status} />
                </div>
              </div>
            </section>

            <section className="status-modal__section">
              <h3>Submitted Information</h3>

              {Object.keys(applicationData).length === 0 ? (
                  <p className="status-modal__empty">
                    No additional application information provided.
                  </p>
              ) : (
                  <div className="status-modal__submitted-data">
                    {Object.entries(applicationData).map(([key, value]) => (
                        <div
                            key={key}
                            className="status-modal__data-row"
                        >
                          <span>{formatFieldName(key)}</span>

                          <pre>{formatFieldValue(value)}</pre>
                        </div>
                    ))}
                  </div>
              )}
            </section>

            <section className="status-modal__section">
              <h3>Update Application Status</h3>

              {availableStatuses.length === 0 ? (
                  <p className="status-modal__empty">
                    This application has reached a final status and
                    cannot be updated.
                  </p>
              ) : (
                  <div className="status-modal__update">
                    <label htmlFor="new-status">
                      New Status
                    </label>

                    <select
                        id="new-status"
                        value={selectedStatus}
                        onChange={(event) =>
                            setSelectedStatus(
                                event.target.value as ApplicationStatus | ""
                            )
                        }
                        disabled={isUpdating}
                    >
                      <option value="">
                        Select a status
                      </option>

                      {availableStatuses.map((status) => (
                          <option key={status} value={status}>
                            {applicationStatusLabels[status]}
                          </option>
                      ))}
                    </select>
                  </div>
              )}

              {error && (
                  <div className="status-modal__error" role="alert">
                    {error}
                  </div>
              )}
            </section>
          </div>

          <div className="status-modal__footer">
            <button
                type="button"
                className="status-modal__cancel"
                onClick={onClose}
                disabled={isUpdating}
            >
              Close
            </button>

            {availableStatuses.length > 0 && (
                <button
                    type="button"
                    className="status-modal__submit"
                    onClick={handleUpdate}
                    disabled={!selectedStatus || isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Status"}
                </button>
            )}
          </div>
        </div>
      </div>
  );
}
