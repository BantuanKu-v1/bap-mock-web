import { useState } from "react";
import ApplicationTable from "../components/ui/ApplicationTable";
import StatCard from "../components/ui/StatCard";
import StatusModal from "../components/ui/StatusModal";
import type {
  Application,
  ApplicationStatus,
} from "../types/applications";

type ApplicationsPageProps = {
  applications: Application[];
  onUpdateStatus: (
      applicationId: string,
      newStatus: ApplicationStatus
  ) => Promise<void>;
};

const ITEMS_PER_PAGE = 10;

export default function ApplicationsPage({
    applications,
    onUpdateStatus
}: ApplicationsPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");

  const totalApplications = applications.length;

  // Filter applications by search query and status
  const filteredApplications = applications.filter((application) => {
    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
        !query ||
        (application.reference_no || "").toLowerCase().includes(query) ||
        application.applicant_name.toLowerCase().includes(query) ||
        (application.applicant_identification_no || "").toLowerCase().includes(query);

    const matchesStatus =
        statusFilter === "all" ||
        application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalFilteredApplications = filteredApplications.length;

  // Pagination
  const totalPages = Math.max(
      1,
      Math.ceil(totalFilteredApplications / ITEMS_PER_PAGE)
  );

  const activePage = Math.min(currentPage, totalPages);

  const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const paginatedApplications = filteredApplications.slice(startIndex, endIndex);

  // Application statistics
  const submittedCount = applications.filter(
      (application) => application.status === "submitted"
  ).length;

  const reviewingCount = applications.filter(
      (application) => application.status === "under_review"
  ).length;

  const approvedCount = applications.filter(
      (application) => application.status === "approved"
  ).length;

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
  };

  const handleCloseModal = () => {
    setSelectedApplication(null);
  };

  const handleUpdateApplicationStatus = async (
      applicationId: string,
      newStatus: ApplicationStatus
  ) => {
    await onUpdateStatus(applicationId, newStatus);
  };

  return (
      <div className="applications-page">
        <div className="applications-page__heading">
          <h1>Applications</h1>
          <p>View and manage submitted JKM applications.</p>
        </div>

        <div className="applications-page__stats">
          <StatCard
              label="Total Applications"
              value={totalApplications}
          />

          <StatCard
              label="Submitted"
              value={submittedCount}
              variant="submitted"
          />

          <StatCard
              label="Under Review"
              value={reviewingCount}
              variant="review"
          />

          <StatCard
              label="Approved"
              value={approvedCount}
              variant="approved"
          />
        </div>

        <div className="applications-page__content">
          <div className="applications-page__content-header">
            <div>
              <h2>All Applications</h2>
              <p>
                Showing {totalFilteredApplications === 0 ? 0 : startIndex + 1}–
                {Math.min(endIndex, totalFilteredApplications)} of{" "}
                {totalFilteredApplications} applications
              </p>
            </div>

            <div className="applications-page__filters">
              <input
                  type="search"
                  placeholder="Search reference or applicant..."
                  aria-label="Search applications"
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setCurrentPage(1);
                  }}
              />

              <select
                  aria-label="Filter applications by status"
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value as ApplicationStatus | "all");
                    setCurrentPage(1);
                  }}
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="additional_information_required">
                  Additional Information Required
                </option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <ApplicationTable
              applications={paginatedApplications}
              onViewApplication={handleViewApplication}
          />

          {totalPages > 1 && (
              <div className="applications-page__pagination">
                <button
                    type="button"
                    disabled={activePage === 1}
                    onClick={() => setCurrentPage(activePage - 1)}
                >
                  Previous
                </button>

                <div className="applications-page__page-numbers">
                  {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                  ).map((page) => (
                      <button
                          key={page}
                          type="button"
                          className={
                            page === activePage
                                ? "applications-page__page--active"
                                : ""
                          }
                          onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                  ))}
                </div>

                <button
                    type="button"
                    disabled={activePage === totalPages}
                    onClick={() => setCurrentPage(activePage + 1)}
                >
                  Next
                </button>
              </div>
          )}
        </div>

        {selectedApplication && (
            <StatusModal
                key={`${selectedApplication.id}-${selectedApplication.status}`}
                application={selectedApplication}
                onClose={handleCloseModal}
                onUpdateStatus={handleUpdateApplicationStatus}
            />
        )}
      </div>
  );
}
