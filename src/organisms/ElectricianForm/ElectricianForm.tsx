import { useEffect, useState } from "react";
import {
  CheckCircle2,
  FileText,
  MapPin,
  UserRound,
  LockKeyhole,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
  AppInput,
  AppTextarea,
  AppSelect,
  PrimaryButton,
  SecondaryButton,
} from "../../atoms";

import DocumentUpload from "../../atoms/DocumentUpload";
import LocationPicker from "../../molecules/LocationPicker";

import {
  createElectrician,
  getElectricianById,
  updateElectrician,
} from "../../services/electricianService";

import { ID_TYPES } from "../../constants/idTypeConstants";
import { showSnackbar } from "../../atoms/AppSnackBar";
import { isValidEmail } from "../../helpers/validEmail";
import PageLoader from "../../atoms/PageLoader";
import {
  allowedDocTypes,
  allowedImageTypes,
} from "../../constants/allowedDocTypes";
import type {
  CreateElectricianRequest,
  Electrician,
} from "../../types/electrician";

type ElectricianFormMode = "register" | "admin";

type ElectricianFormProps = {
  mode?: ElectricianFormMode;
};

const ElectricianForm = ({ mode = "register" }: ElectricianFormProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isAdmin = mode === "admin";

  const [electrician, setElectrician] = useState<Electrician | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    address: "",
    mapAddress: "",
    latitude: "",
    longitude: "",
    validIdNumber: "",
    validIdType: "aadhar_card",
    password: "",
    status: "pending",
  });

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  const [validId, setValidId] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(isAdmin);

  const [isSubmitting, setIsSubmitting] = useState(false);

  /*
   * ADMIN:
   * Load existing electrician
   */
  useEffect(() => {
    if (!isAdmin || !id) return;

    const loadElectrician = async () => {
      try {
        setIsLoading(true);

        const data = await getElectricianById(id);

        setElectrician(data);

        setFormData({
          name: data.name || "",
          email: data.email || "",
          mobileNumber: data.mobile_number || "",
          address: data.current_address || "",
          mapAddress: data.current_address || "",
          latitude: data.latitude !== null ? String(data.latitude) : "",
          longitude: data.longitude !== null ? String(data.longitude) : "",
          validIdNumber: data.valid_id_number || "",
          validIdType: data.valid_id_type || "aadhar_card",
          password: "",
          status: data.status || "pending",
        });
      } catch (error) {
        console.error(error);

        showSnackbar.error(
          error instanceof Error
            ? error.message
            : "Failed to load electrician.",
        );

        navigate("/admin/electricians");
      } finally {
        setIsLoading(false);
      }
    };

    loadElectrician();
  }, [id, isAdmin, navigate]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
   * Profile photo validation
   */
  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setProfilePhoto(null);
      return;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    if (file.size > MAX_FILE_SIZE) {
      showSnackbar.error("Profile photo must be less than 5 MB.");

      setProfilePhoto(null);
      e.target.value = "";

      return;
    }

    if (!allowedImageTypes.includes(file.type)) {
      showSnackbar.error(
        "Only PNG, JPG, JPEG, HEIC and HEIF files are allowed.",
      );

      setProfilePhoto(null);
      e.target.value = "";

      return;
    }

    setProfilePhoto(file);
  };

  /*
   * Valid ID validation
   */
  const handleValidIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setValidId(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showSnackbar.error("File size must be less than 10 MB.");

      setValidId(null);
      e.target.value = "";

      return;
    }

    if (!allowedDocTypes.includes(file.type)) {
      showSnackbar.error(
        "Only PNG, JPG, JPEG, HEIC, HEIF and PDF files are allowed.",
      );

      setValidId(null);
      e.target.value = "";

      return;
    }

    setValidId(file);
  };

  /*
   * Submit
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    /*
     * ADMIN UPDATE
     */
    if (isAdmin) {
      if (!id) return;

      try {
        setIsSubmitting(true);

        const updateData: Record<string, unknown> = {
          name: formData.name.trim(),
          current_address: (formData.address || formData.mapAddress).trim(),
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
          valid_id_number: formData.validIdNumber.trim(),
          valid_id_type: formData.validIdType,
          status: formData.status,
        };

        /*
         * Only update password if admin entered one.
         */
        if (formData.password.trim()) {
          updateData.password = formData.password.trim();
        }

        /*
         * Only send profile photo if replaced.
         */
        if (profilePhoto) {
          updateData.profilePhoto = profilePhoto;
        }

        /*
         * Only send valid ID if replaced.
         */
        if (validId) {
          updateData.validId = validId;
        }

        await updateElectrician(id, updateData);

        showSnackbar.success("Electrician updated successfully.");
        navigate("/admin/electricians", { replace: true });
      } catch (error) {
        console.error(error);

        showSnackbar.error(
          error instanceof Error
            ? error.message
            : "Failed to update electrician.",
        );
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    /*
     * ELECTRICIAN REGISTRATION
     */

    if (!profilePhoto) {
      showSnackbar.error("Please upload your profile photo.");

      return;
    }

    if (!formData.latitude || !formData.longitude) {
      showSnackbar.loading("Please select your home location on the map.");

      return;
    }

    if (!validId) {
      showSnackbar.error("Please upload your valid ID.");

      return;
    }

    if (!isValidEmail(formData.email)) {
      showSnackbar.error("Please enter valid email.");

      return;
    }

    try {
      setIsSubmitting(true);

      const payload: CreateElectricianRequest = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        currentAddress: (formData.address || formData.mapAddress).trim(),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        profilePhoto,
        validId,
        validIdNumber: formData.validIdNumber.trim(),
        validIdType: formData.validIdType,
        password: formData.password,
      };

      await createElectrician(payload);

      showSnackbar.success("Registration submitted successfully!");
      navigate("/electrician/login");
    } catch (error) {
      showSnackbar.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isSubmitting) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-dvh bg-background text-primary">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 md:px-8">
          <div>
            <h1 className="text-lg font-bold md:text-xl">
              {isAdmin ? "Edit Electrician" : "Join Blue Eye Electric Services"}
            </h1>

            <p className="text-xs text-muted">
              {isAdmin
                ? "Manage electrician information"
                : "Electrician Registration"}
            </p>
          </div>

          {isAdmin ? (
            <SecondaryButton
              onClick={() => navigate("/admin/electricians", { replace: true })}
            >
              Back
            </SecondaryButton>
          ) : (
            <PrimaryButton onClick={() => navigate("/electrician/login")}>
              Login
            </PrimaryButton>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="px-5 py-8 md:py-12">
        <div className="mx-auto max-w-3xl">
          {/* Intro */}
          <div className="mb-8 text-center">
            <div
              className="
                mx-auto mb-4
                flex h-14 w-14
                items-center justify-center
                rounded-2xl
                bg-primary/10
                text-primary
              "
            >
              <UserRound className="h-7 w-7" />
            </div>

            <h2 className="text-2xl font-bold text-ink md:text-3xl">
              {isAdmin
                ? electrician?.name || "Electrician Details"
                : "Become a Blue Eye Electrician"}
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500 md:text-base">
              {isAdmin
                ? "Update electrician information and account details."
                : "Register with us and connect with customers looking for trusted electrical professionals."}
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="
              rounded-3xl
              border border-slate-200
              bg-primary/10
              p-5
              shadow-sm
              md:p-8
            "
          >
            {/* Personal Information */}
            <div className="mb-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UserRound className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="font-bold text-ink">Personal Information</h3>

                  <p className="text-xs text-slate-500">
                    {isAdmin
                      ? "Update personal information"
                      : "Tell us about yourself"}
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {/* Profile Photo */}
                <div className="md:col-span-2">
                  {isAdmin && electrician?.profile_photo_url && (
                    <div className="mb-4">
                      <p className="mb-2 text-sm font-medium text-ink">
                        Current Profile Photo
                      </p>

                      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
                        <img
                          src={electrician.profile_photo_url}
                          alt={electrician.name}
                          className="h-24 w-24 rounded-xl object-cover border border-slate-200"
                        />

                        <div>
                          <p className="text-xs text-muted">
                            Current profile photo
                          </p>

                          <a
                            href={electrician.profile_photo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-block text-xs font-medium text-primary hover:underline"
                          >
                            View Full Image
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  <DocumentUpload
                    label="Profile Photo"
                    file={profilePhoto}
                    onChange={handleProfilePhotoChange}
                  />

                  {isAdmin && electrician?.profile_photo_url && (
                    <a
                      href={electrician.profile_photo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
                    >
                      View Current Profile Photo
                    </a>
                  )}

                  <p className="mt-2 text-xs text-slate-500">
                    PNG, JPG or JPEG. Maximum 5 MB.
                  </p>
                </div>

                {/* Name */}
                <AppInput
                  label="Full Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Mahesh Joshi"
                  required
                />

                {/* Email - NEVER EDITABLE */}
                <AppInput
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  disabled={isAdmin}
                  readOnly={isAdmin}
                  onChange={handleChange}
                  placeholder="e.g. mahesh@example.com"
                  autoComplete="email"
                  required
                />

                {/* Mobile - NEVER EDITABLE */}
                <AppInput
                  label="Mobile Number"
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  disabled={isAdmin}
                  readOnly={isAdmin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");

                    setFormData((prev) => ({
                      ...prev,
                      mobileNumber: value.slice(0, 10),
                    }));
                  }}
                  placeholder="10 digit mobile number"
                  inputMode="numeric"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="mb-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="font-bold text-ink">Home Location</h3>

                  <p className="text-xs text-slate-500">
                    {isAdmin
                      ? "Update address and location"
                      : "Enter your address and select your location"}
                  </p>
                </div>
              </div>

              <div className="grid gap-5">
                <AppTextarea
                  label="Home Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House No. 12, Sector 21, Patna, Bihar"
                  rows={3}
                  required
                />

                <LocationPicker
                  address={formData.mapAddress}
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  onChange={(location) => {
                    setFormData((prev) => ({
                      ...prev,
                      mapAddress: location.address,
                      latitude: location.latitude,
                      longitude: location.longitude,
                    }));
                  }}
                />
              </div>
            </div>

            {/* Identity Document */}
            <div className="mb-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileText className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="font-bold text-ink">Identity Document</h3>

                  <p className="text-xs text-slate-500">
                    {isAdmin
                      ? "Update identity information"
                      : "Upload a clear image or PDF of your valid ID"}
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <AppSelect
                  label="ID Type"
                  name="validIdType"
                  value={formData.validIdType}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select ID type
                  </option>

                  {ID_TYPES.map((idData) => (
                    <option key={idData.value} value={idData.value}>
                      {idData.label}
                    </option>
                  ))}
                </AppSelect>

                <AppInput
                  label="ID Number"
                  type="text"
                  name="validIdNumber"
                  value={formData.validIdNumber}
                  onChange={handleChange}
                  placeholder="Enter ID number"
                  required
                />
              </div>

              <div className="mt-5">
                {isAdmin && electrician?.valid_id_url && (
                  <div className="mb-4">
                    <p className="mb-2 text-sm font-medium text-ink">
                      Current Valid ID
                    </p>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      {electrician.valid_id_url
                        .toLowerCase()
                        .match(/\.(jpg|jpeg|png)(\?|$)/) ? (
                        <img
                          src={electrician.valid_id_url}
                          alt="Valid ID"
                          className="max-h-64 w-auto rounded-lg border border-slate-200 object-contain"
                        />
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <FileText className="h-5 w-5" />
                          </div>

                          <div>
                            <p className="text-sm font-medium text-ink">
                              Current ID Document
                            </p>

                            <a
                              href={electrician.valid_id_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-medium text-primary hover:underline"
                            >
                              View Current Document
                            </a>
                          </div>
                        </div>
                      )}

                      <a
                        href={electrician.valid_id_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-xs font-medium text-primary hover:underline"
                      >
                        Open Document
                      </a>
                    </div>
                  </div>
                )}
                <DocumentUpload
                  label="Valid ID"
                  file={validId}
                  onChange={handleValidIdChange}
                  includePdf
                />

                {isAdmin && electrician?.valid_id_url && (
                  <a
                    href={electrician.valid_id_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
                  >
                    View Current Valid ID
                  </a>
                )}
              </div>
            </div>

            {/* Admin Status */}
            {isAdmin && (
              <div className="mb-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="font-bold text-ink">Account Status</h3>

                    <p className="text-xs text-slate-500">
                      Change electrician account status
                    </p>
                  </div>
                </div>

                <AppSelect
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="pending">Pending</option>

                  <option value="approved">Approved</option>

                  <option value="rejected">Rejected</option>
                </AppSelect>
              </div>
            )}

            {/* Password */}
            {!isAdmin && (
              <div className="mb-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <LockKeyhole className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="font-bold text-ink">Account Password</h3>

                    <p className="text-xs text-slate-500">
                      {isAdmin
                        ? "Leave empty to keep the current password"
                        : "Create a password for your electrician account"}
                    </p>
                  </div>
                </div>

                <AppInput
                  label={isAdmin ? "New Password" : "Password"}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={8}
                  placeholder={
                    isAdmin ? "Enter new password" : "Enter a secure password"
                  }
                  required={!isAdmin}
                />
              </div>
            )}

            {/* Submit */}
            <PrimaryButton fullWidth type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                isAdmin ? (
                  "Saving Changes..."
                ) : (
                  "Submitting..."
                )
              ) : (
                <>
                  {isAdmin ? "Save Changes" : "Submit Registration"}

                  <CheckCircle2 className="h-4 w-4" />
                </>
              )}
            </PrimaryButton>

            <p className="mt-4 text-center text-xs text-slate-400">
              Your documents and personal information will be kept secure.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ElectricianForm;
