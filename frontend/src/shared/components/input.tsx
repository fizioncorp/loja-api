interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

// Componente reutilizável de input
export function Input(props: Props) {
  return (
    <input
      className="
        w-full
        p-2
        border
        rounded
        outline-none
        focus:ring-2
        focus:ring-blue-500
      "
      {...props}
    />
  );
}