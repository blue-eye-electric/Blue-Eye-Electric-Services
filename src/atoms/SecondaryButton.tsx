import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type SecondaryButtonProps = (
  | AnchorHTMLAttributes<HTMLAnchorElement>
  | ButtonHTMLAttributes<HTMLButtonElement>
) & {
  children: ReactNode;
  icon?: ReactNode;
};

export function SecondaryButton({
  children,
  icon,
  className = "",
  ...props
}: SecondaryButtonProps) {
  const classNames = `
    inline-flex
    items-center
    gap-2
    border
    border-primary
    rounded-xl
    px-4
    py-2
    text-lg
    font-bold
    text-ink
    no-underline
    transition
    hover:-translate-y-0.5
    cursor-pointer
    ${className}
  `;

  if ("href" in props) {
    return (
      <a {...props} className={classNames}>
        {icon && <span aria-hidden="true">{icon}</span>}

        {children}
      </a>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button {...buttonProps} className={classNames}>
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
}
