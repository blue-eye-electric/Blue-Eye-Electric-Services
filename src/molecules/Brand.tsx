import logo from "../assets/logo.jpeg";

type BrandProps = {
  href?: string;
};

export function Brand({ href = "#hero" }: BrandProps) {
  return (
    <a
      href={href}
      className="
        flex
        items-center
        no-underline
      "
    >
      <img
        src={logo}
        alt="Blue Eye Electrical Services"
        className="h-[62px] w-[62px] object-contain"
      />
    </a>
  );
}
