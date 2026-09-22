import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Gift,
  LogOut,
  RefreshCw,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { AppInput, SecondaryButton } from "../../../atoms";
import {
  getReferrals,
  updateReferral,
} from "../../../services/referralService";
import type { Referral } from "../../../types/referral";
import PageLoader from "../../../atoms/PageLoader";

const AdminReferralPage = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Admin";
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [editingRow, setEditingRow] = useState<Referral | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1); // Reset to page 1 on new search query
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch referrals with search & pagination parameters
  const loadReferrals = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getReferrals({
        page: currentPage,
        search: debouncedSearch,
      });

      setReferrals(data.referrals || []);
      setTotalPages(data.pagination.totalPages || 1);
      setTotalCount(data.pagination.total || 0);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load referrals.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    loadReferrals();
  }, [loadReferrals]);

  const handleEditClick = (referral: Referral) => {
    setEditingRow({
      phone: referral.phone,
      name: referral.name,
      commission: referral.commission || 0,
      referralCode: referral.referralCode,
    });
  };

  const handleCancel = () => {
    setEditingRow(null);
  };

  const handleSave = async (phone: string) => {
    if (!editingRow) return;

    try {
      setIsSubmitting(true);

      const updatedReferral = await updateReferral(phone, {
        name: editingRow.name,
        commission: Number(editingRow.commission),
      });

      setReferrals((prevReferrals) =>
        prevReferrals.map((item) =>
          item.phone === phone ? { ...item, ...updatedReferral } : item,
        ),
      );

      setEditingRow(null);
    } catch (error) {
      console.error("Error updating referral:", error);
      alert(
        error instanceof Error ? error.message : "Failed to update referral",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-dvh bg-background text-primary">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <SecondaryButton
              onClick={() => navigate("/admin/dashboard")}
              title="Back to dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </SecondaryButton>

            <div>
              <h1 className="text-lg font-bold text-ink">Referrals</h1>
              <p className="text-xs text-muted">Blue Eye Electric Services</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-ink">{name}</p>
              <p className="text-xs text-muted">Admin</p>
            </div>

            <SecondaryButton onClick={handleLogout} title="Logout">
              <LogOut className="h-4 w-4" />
            </SecondaryButton>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-white">
                <Gift className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-ink md:text-3xl">
                  Referral partners
                </h2>
                <p className="mt-1 text-sm text-muted">
                  View referral codes, contact details, and commission earned.
                </p>
              </div>
            </div>
          </div>

          <SecondaryButton onClick={loadReferrals} disabled={isLoading}>
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </SecondaryButton>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Total referrals
            </p>
            <p className="mt-2 text-3xl font-bold text-ink">{totalCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Matching results
            </p>
            <p className="mt-2 text-3xl font-bold text-ink">
              {referrals.length}
            </p>
          </div>
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-bold text-ink">All referrals</h3>
              <p className="mt-1 text-xs text-muted">
                Search by name, phone number or referral code.
              </p>
            </div>

            <label className="relative block md:w-72">
              <span className="sr-only">Search referrals</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search referrals"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-ink outline-none focus:border-primary focus:bg-white"
              />
            </label>
          </div>

          {isLoading ? (
            <PageLoader />
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-sm font-medium text-red-600">{error}</p>
              <button
                type="button"
                onClick={loadReferrals}
                className="mt-3 text-sm font-semibold text-primary underline"
              >
                Try again
              </button>
            </div>
          ) : referrals.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted">
              {search ? "No referrals match your search." : "No referrals yet."}
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-muted">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Name</th>
                      <th className="px-5 py-3 font-semibold">Phone</th>
                      <th className="px-5 py-3 font-semibold">Referral code</th>
                      <th className="px-5 py-3 font-semibold">Commission</th>
                      <th className="px-5 py-3 font-semibold">Created</th>
                      <th className="px-5 py-3 font-semibold text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {referrals.map((referral) => {
                      const isEditing = editingRow?.phone === referral.phone;

                      return (
                        <tr
                          key={referral.phone}
                          className="hover:bg-slate-50/50"
                        >
                          {/* Name Field */}
                          <td className="px-5 py-4 font-semibold text-ink">
                            {isEditing ? (
                              <AppInput
                                label=""
                                type="text"
                                value={editingRow.name}
                                onChange={(e) =>
                                  setEditingRow({
                                    ...editingRow,
                                    name: e.target.value,
                                  })
                                }
                                className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm font-normal focus:border-primary focus:outline-none"
                              />
                            ) : (
                              referral.name
                            )}
                          </td>

                          {/* Phone Field */}
                          <td className="px-5 py-4 text-muted">
                            {referral.phone}
                          </td>

                          {/* Referral Code Field */}
                          <td className="px-5 py-4">
                            <span className="rounded-lg bg-primary/10 px-3 py-1.5 font-bold tracking-widest text-primary">
                              {referral.referralCode}
                            </span>
                          </td>

                          {/* Commission Field */}
                          <td className="px-5 py-4 font-semibold text-ink">
                            {isEditing ? (
                              <div className="flex items-center gap-1">
                                <AppInput
                                  label=""
                                  type="text"
                                  inputMode="decimal"
                                  value={editingRow.commission}
                                  onChange={(e) => {
                                    let raw = e.target.value;

                                    if (!/^\d*\.?\d*$/.test(raw)) return;

                                    if (
                                      raw.length > 1 &&
                                      raw.startsWith("0") &&
                                      raw[1] !== "."
                                    ) {
                                      raw = raw.replace(/^0+/, "");
                                    }

                                    const num = Number(raw);
                                    if (num > 100) {
                                      raw = "99";
                                    }

                                    setEditingRow({
                                      ...editingRow,
                                      commission: Number(raw),
                                    });
                                  }}
                                  className="w-16"
                                />
                                <span>%</span>
                              </div>
                            ) : (
                              `${referral.commission || 0}%`
                            )}
                          </td>

                          {/* Created Field */}
                          <td className="px-5 py-4 text-muted">
                            {referral.createdAt
                              ? new Date(referral.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    timeZone: "Asia/Kolkata",
                                  },
                                )
                              : "-"}
                          </td>

                          {/* Actions Column */}
                          <td className="px-5 py-4 text-right">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleSave(referral.phone)}
                                  disabled={isSubmitting}
                                  className="rounded-md bg-primary px-3 py-1 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                                >
                                  {isSubmitting ? "Saving..." : "Save"}
                                </button>
                                <button
                                  onClick={handleCancel}
                                  disabled={isSubmitting}
                                  className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleEditClick(referral)}
                                className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                              >
                                Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4 text-xs text-muted">
                <p>
                  Page{" "}
                  <span className="font-semibold text-ink">{currentPage}</span>{" "}
                  of{" "}
                  <span className="font-semibold text-ink">{totalPages}</span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1 || isLoading}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage >= totalPages || isLoading}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminReferralPage;
