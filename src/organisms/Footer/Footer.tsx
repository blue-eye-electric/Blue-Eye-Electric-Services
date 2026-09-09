import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="px-2 tracking-[0.3px]">
      <div className="mx-auto my-2 flex min-h-16 max-w-5xl flex-col md:items-center justify-between gap-2 md:flex-row">
        <div className="flex items-center gap-2">
          <span>© 2026 Blue Eye Electric Service</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <a
            href="https://spsoftsolution.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-md hover:text-primary"
          >
            Made with
            <Heart className="h-4 w-4 text-primary" fill="currentColor" />
            by <span className="font-bold underline">SP Soft Solution</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
