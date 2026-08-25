import { MessageCircle } from "lucide-react";
import { SecondaryButton } from "../../atoms";
import { Brand } from "../../molecules/Brand";

const Navbar = () => {
  return (
    <nav
      className="
      fixed
      top-0
      flex
      w-full
      bg-background
      items-center
      justify-between
      border-b
      border-border
      px-[6vw]
      py-2
      z-[10]
    "
    >
      <div className="flex w-full items-center justify-between max-w-5xl mx-auto">
        <Brand />

        <div
          className="
        ml-20
        flex
        gap-8
        max-md:hidden
      "
        >
          <a
            href="#services"
            className="text-muted no-underline hover:text-ink"
          >
            Services
          </a>

          <a href="#how" className="text-muted no-underline hover:text-ink">
            How it works
          </a>

          <a href="#trust" className="text-muted no-underline hover:text-ink">
            Why Blue Eye
          </a>
        </div>

        <SecondaryButton
          onClick={() => {
            window.open("https://wa.me/916202372739", "_blank");
          }}
          icon={
            <MessageCircle className="h-4 w-4 text-success group-hover:text-white" />
          }
          className="border-transparent hover:bg-success group"
        >
          Whatsapp Us
        </SecondaryButton>
      </div>
    </nav>
  );
};

export default Navbar;
