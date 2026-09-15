import { FileText } from "lucide-react";

type DocumentPreviewProps = {
  label: string;
  url: string;
  openText?: string;
};

const DocumentPreview = ({ label, url, openText }: DocumentPreviewProps) => {
  const isImage = /\.(jpg|jpeg|png|heic|heif)(\?|$)/i.test(url);

  return (
    <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
      <p className="mb-2 text-sm font-medium text-ink">Current {label}</p>

      {isImage ? (
        <img
          src={url}
          alt={label}
          className="max-h-64 w-auto rounded-lg border border-slate-200 object-contain"
        />
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-5 w-5" />
          </div>

          <p className="text-sm font-medium text-ink">Current {label}</p>
        </div>
      )}

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-xs font-medium text-primary hover:underline"
      >
        {openText || "Open Document"}
      </a>
    </div>
  );
};

export default DocumentPreview;
