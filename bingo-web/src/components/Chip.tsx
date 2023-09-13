type Props = {
  children: React.ReactNode;
};
export function Chip({ children }: Props) {
  return (
    <div className="flex justify-center w-16 rounded-lg bg-primary-lighten text-primary-darken">
      {children}
    </div>
  );
}
