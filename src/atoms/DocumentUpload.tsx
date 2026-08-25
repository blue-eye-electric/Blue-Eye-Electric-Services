import { Upload, FileCheck2 } from "lucide-react";

type DocumentUploadProps = {
  label: string;
  required?: boolean;
  file: File | File[] | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  multiple?: boolean;
  disabled?: boolean;
  includePdf?: boolean;
};

const DocumentUpload = ({
  label,
  required,
  file,
  onChange,
  multiple = false,
  disabled = false,
  includePdf = false,
}: DocumentUploadProps) => {
  return (
    <label
      className="
        group
        flex
        w-full
        cursor-pointer
        items-center
        gap-4
        rounded-xl
        border
        border-dashed
        border-slate-200
        bg-slate-50
        px-4
        py-3
        transition
        hover:border-primary
        hover:bg-white
      "
    >
      {/* Icon */}
      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-white
          text-muted
          shadow-sm
          transition
          group-hover:bg-primary/10
          group-hover:text-primary
        "
      >
        {file ? (
          <FileCheck2 className="h-5 w-5" />
        ) : (
          <Upload className="h-5 w-5" />
        )}
      </div>

      {/* File Information */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">
          {label}

          {required && <span className="ml-1 text-red-500">*</span>}
        </p>

        <p
          className={`
            mt-0.5
            truncate
            text-xs
            ${file ? "text-primary" : "text-muted"}
          `}
        >
          {Array.isArray(file)
            ? `${file.length} file${file.length === 1 ? "" : "s"} selected`
            : file
              ? file.name
              : "PDF, JPG or PNG"}
        </p>
      </div>

      {/* Upload input */}
      <input
        type="file"
        accept={`image/jpeg,image/png,image/heic,image/heif${includePdf ? ",application/pdf" : ""}`}
        required={required}
        onChange={onChange}
        className="hidden"
        multiple={multiple}
        disabled={disabled}
      />
    </label>
  );
};

export default DocumentUpload;
