interface Props {
  children: React.ReactNode;
}
export function Chip({ children }: Props) {
  return (
    <div className="flex w-16 justify-center rounded-lg bg-primary-lighten text-primary-darken">
      {children}
    </div>
  );
}
