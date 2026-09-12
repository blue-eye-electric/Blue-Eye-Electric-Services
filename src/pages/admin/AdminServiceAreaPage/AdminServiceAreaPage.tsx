import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Pencil, Plus, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { PrimaryButton, SecondaryButton } from "../../../atoms";
import PageLoader from "../../../atoms/PageLoader";
import { showSnackbar } from "../../../atoms/AppSnackBar";
import {
  createServiceArea,
  getServiceAreas,
  updateServiceArea,
} from "../../../services/serviceAreaService";
import type { ServiceArea } from "../../../types/serviceArea";

const AdminServiceAreaPage = () => {
  const navigate = useNavigate();
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [newServiceArea, setNewServiceArea] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadServiceAreas = async () => {
    try {
      setIsLoading(true);
      setServiceAreas(await getServiceAreas());
    } catch (error) {
      showSnackbar.error(
        error instanceof Error
          ? error.message
          : "Failed to load service areas.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServiceAreas();
  }, []);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = newServiceArea.trim();

    if (!value) {
      showSnackbar.error("Service area is required.");
      return;
    }

    try {
      setIsSaving(true);
      const serviceArea = await createServiceArea(value);
      setServiceAreas((current) => [...current, serviceArea]);
      setNewServiceArea("");
      showSnackbar.success("Service area added successfully.");
    } catch (error) {
      showSnackbar.error(
        error instanceof Error
          ? error.message
          : "Failed to create service area.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = (serviceArea: ServiceArea) => {
    setEditingId(serviceArea.id);
    setEditingValue(serviceArea.area_name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const handleUpdate = async (id: string) => {
    const value = editingValue.trim();

    if (!value) {
      showSnackbar.error("Service area is required.");
      return;
    }

    try {
      setIsSaving(true);
      const updatedServiceArea = await updateServiceArea(id, value);
      setServiceAreas((current) =>
        current.map((serviceArea) =>
          serviceArea.id === id ? updatedServiceArea : serviceArea,
        ),
      );
      cancelEditing();
      showSnackbar.success("Service area updated successfully.");
    } catch (error) {
      showSnackbar.error(
        error instanceof Error
          ? error.message
          : "Failed to update service area.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-dvh bg-background text-primary">
      <main className="mx-auto max-w-5xl px-5 py-8 md:py-12">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SecondaryButton
              onClick={() => navigate("/admin/dashboard")}
              title="Back to dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </SecondaryButton>

            <div>
              <h1 className="text-2xl font-bold text-ink md:text-3xl">
                Service Areas
              </h1>
              <p className="mt-1 text-sm text-muted">
                Add and manage areas available for electrician registration.
              </p>
            </div>
          </div>

          <div className="hidden h-12 w-12 items-center justify-center rounded-xl bg-primary text-white sm:flex">
            <MapPin className="h-6 w-6" />
          </div>
        </div>

        <form
          onSubmit={handleCreate}
          className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row"
        >
          <input
            value={newServiceArea}
            onChange={(event) => setNewServiceArea(event.target.value)}
            placeholder="Enter a new service area"
            aria-label="New service area"
            className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            Add Area
          </button>
        </form>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-ink">
              All Service Areas ({serviceAreas.length})
            </h2>
          </div>

          {serviceAreas.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted">
              No service areas found.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {serviceAreas.map((serviceArea, index) => (
                <div
                  key={serviceArea.id}
                  className="flex flex-row gap-3 px-5 py-4 sm:flex-row sm:items-center justify-between"
                >
                  {editingId === serviceArea.id ? (
                    <input
                      value={editingValue}
                      onChange={(event) => setEditingValue(event.target.value)}
                      aria-label="Edit service area"
                      className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <span>{index + 1}</span>
                      <span className="text-sm font-medium text-ink">
                        {serviceArea.area_name}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {editingId === serviceArea.id ? (
                      <>
                        <PrimaryButton
                          onClick={() => handleUpdate(serviceArea.id)}
                          disabled={isSaving}
                          title="Save service area"
                        >
                          <Save className="h-3.5 w-3.5" />
                        </PrimaryButton>
                        <SecondaryButton
                          onClick={cancelEditing}
                          title="Cancel editing"
                        >
                          <X className="h-3.5 w-3.5" />
                        </SecondaryButton>
                      </>
                    ) : (
                      <SecondaryButton
                        onClick={() => startEditing(serviceArea)}
                        title="Edit service area"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </SecondaryButton>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminServiceAreaPage;
