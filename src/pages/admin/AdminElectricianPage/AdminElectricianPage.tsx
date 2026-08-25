import {
  Users,
  Wrench,
  Clock3,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getElectricians,
  updateElectrician,
  type Electrician,
  type ElectricianStatus,
} from "../../../services/electricianService";
import { useNavigate } from "react-router-dom";
import ElectricianAvatar from "./ElectricianAvatar";
import { SecondaryButton } from "../../../atoms";

const AdminElectricianPage = () => {
  const navigate = useNavigate();
  const [electricians, setElectricians] = useState<Electrician[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchElectricians();
  }, []);

  const fetchElectricians = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getElectricians();

      setElectricians(data);
    } catch (error) {
      console.error("Failed to fetch electricians:", error);
      setError("Failed to load electricians.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: ElectricianStatus) => {
    try {
      setUpdatingId(id);

      const updatedElectrician = await updateElectrician(id, {
        status,
      });

      setElectricians((current) =>
        current.map((electrician) =>
          electrician.id === id ? updatedElectrician : electrician,
        ),
      );
    } catch (error) {
      console.error("Failed to update status:", error);

      alert("Failed to update electrician status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const totalElectricians = electricians.length;

  const approvedElectricians = electricians.filter(
    (electrician) => electrician.status === "approved",
  ).length;

  const pendingElectricians = electricians.filter(
    (electrician) => electrician.status === "pending",
  ).length;

  const rejectedElectricians = electricians.filter(
    (electrician) => electrician.status === "rejected",
  ).length;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "approved":
        return "border-green-200 bg-green-50 text-green-700";

      case "rejected":
        return "border-red-200 bg-red-50 text-red-700";

      default:
        return "border-yellow-200 bg-yellow-50 text-yellow-700";
    }
  };

  return (
    <div className="min-h-dvh bg-background text-primary">
      <main className="mx-auto max-w-5xl px-5 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-row gap-2 items-center justify-center">
              <div
                className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-xl
                bg-primary
                text-white
              "
              >
                <Wrench className="h-10 w-10" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-ink md:text-3xl">
                  Electricians
                </h1>

                <p className="mt-1 text-sm text-muted">
                  Manage electrician accounts and their status.
                </p>
              </div>
            </div>
            <SecondaryButton
              icon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => navigate("/admin/dashboard")}
            >
              Back to Dashboard
            </SecondaryButton>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total */}
          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Total Electricians</p>

                <p className="mt-2 text-2xl font-bold text-ink">
                  {totalElectricians}
                </p>
              </div>

              <Users className="h-5 w-5 text-primary" />
            </div>
          </div>

          {/* Approved */}
          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Approved</p>

                <p className="mt-2 text-2xl font-bold text-green-600">
                  {approvedElectricians}
                </p>
              </div>

              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </div>

          {/* Pending */}
          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Pending</p>

                <p className="mt-2 text-2xl font-bold text-yellow-600">
                  {pendingElectricians}
                </p>
              </div>

              <Clock3 className="h-5 w-5 text-yellow-600" />
            </div>
          </div>

          {/* Rejected */}
          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Rejected</p>

                <p className="mt-2 text-2xl font-bold text-red-600">
                  {rejectedElectricians}
                </p>
              </div>

              <XCircle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>

        {/* Electrician Table */}
        <div
          className="
            mt-6
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-sm
          "
        >
          <div className="border-b border-slate-200 p-5">
            <h2 className="font-semibold text-ink">All Electricians</h2>

            <p className="mt-1 text-xs text-muted">
              Update electrician status from the table.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="p-10 text-center">
              <p className="text-sm text-muted">Loading electricians...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="p-5">
              <div className="rounded-xl bg-red-50 p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && electricians.length === 0 && (
            <div className="p-10 text-center">
              <Wrench className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-3 text-sm font-medium text-ink">
                No electricians found
              </p>
            </div>
          )}

          {/* Table */}
          {!loading && !error && electricians.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                      Name
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                      Mobile
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {electricians.map((electrician) => (
                    <tr
                      key={electrician.id}
                      onClick={() =>
                        navigate(`/admin/electricians/${electrician.id}`, {
                          replace: true,
                        })
                      }
                      className="
                          border-b
                          border-slate-100
                          last:border-0
                          hover:bg-slate-50
                        "
                    >
                      {/* Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="
                              flex
                              h-20
                              w-20
                              shrink-0
                              items-center
                              justify-center
                              overflow-hidden
                              rounded-lg
                              bg-primary/10
                            "
                          >
                            <ElectricianAvatar
                              photoUrl={electrician.profile_photo_url}
                              name={electrician.name}
                            />
                          </div>

                          <p className="text-sm font-semibold text-ink">
                            {electrician.name}
                          </p>
                        </div>
                      </td>

                      {/* Mobile */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-ink">
                          {electrician.mobile_number}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <select
                          value={electrician.status}
                          disabled={updatingId === electrician.id}
                          onClick={(event) => {
                            event.stopPropagation();
                          }}
                          onChange={(event) => {
                            event.stopPropagation();

                            handleStatusChange(
                              electrician.id,
                              event.target.value as ElectricianStatus,
                            );
                          }}
                          className={`
                              rounded-lg
                              border
                              px-3
                              py-2
                              text-sm
                              font-medium
                              capitalize
                              outline-none
                              transition
                              focus:ring-2
                              focus:ring-primary/20
                              disabled:cursor-not-allowed
                              disabled:opacity-60
                              ${getStatusStyle(electrician.status)}
                            `}
                        >
                          <option value="pending">Pending</option>

                          <option value="approved">Approved</option>

                          <option value="rejected">Rejected</option>
                        </select>

                        {updatingId === electrician.id && (
                          <span className="ml-2 text-xs text-muted">
                            Updating...
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminElectricianPage;
