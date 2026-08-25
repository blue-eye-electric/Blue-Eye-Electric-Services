// Components
import { SecondaryButton } from "../../atoms";

// Assets
import logo from "../../assets/logo.png";

// Icons
import { MessageCircle } from "lucide-react";

// Helpers
import { scrollToSection } from "../../helpers/scrollToSection";

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
        {/* <Brand /> */}
        <img
          src={logo}
          alt="Blue Eye Electrical Services"
          className="h-[62px] w-[62px] object-contain"
        />

        <div
          className="
        ml-20
        flex
        gap-8
        max-md:hidden
      "
        >
          <button
            type="button"
            className="text-muted no-underline hover:text-ink"
            onClick={() => scrollToSection("services")}
          >
            Services
          </button>
          <button
            type="button"
            className="text-muted no-underline hover:text-ink"
            onClick={() => scrollToSection("how")}
          >
            How it works
          </button>
          <button
            type="button"
            className="text-muted no-underline hover:text-ink"
            onClick={() => scrollToSection("#trust")}
          >
            Why Blue Eye
          </button>
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
