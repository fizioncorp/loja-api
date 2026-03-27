import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ children, ...rest }: Props) {
  return (
    <button
      className="
        w-full
        rounded-2xl
        bg-sky-500
        px-4
        py-3
        font-medium
        text-white
        transition
        hover:bg-sky-400
        disabled:cursor-not-allowed
        disabled:opacity-70
      "
      {...rest}
    >
      {children}
    </button>
  );
}
