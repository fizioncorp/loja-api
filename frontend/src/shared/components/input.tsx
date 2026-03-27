import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: Props) {
  return (
    <input
      className="
        w-full
        rounded-2xl
        border
        border-slate-700
        bg-slate-950/80
        px-4
        py-3
        text-slate-100
        outline-none
        placeholder:text-slate-500
        focus:ring-2
        focus:ring-sky-500
      "
      {...props}
    />
  );
}
