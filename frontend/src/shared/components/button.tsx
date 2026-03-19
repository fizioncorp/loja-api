interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

// Botão padrão do sistema
export function Button({ children, ...rest }: Props) {
  return (
    <button
      className="
        w-full
        bg-blue-600
        text-white
        p-2
        rounded
        hover:bg-blue-700
        transition
      "
      {...rest}
    >
      {children}
    </button>
  );
}