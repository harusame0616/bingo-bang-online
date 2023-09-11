'use client';

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export function Button(props: ButtonProps) {
  const { children, ...rest } = props;
  return (
    <button
      {...rest}
      className={`bg-primary-normal hover:bg-primary-darker text-white font-bold py-2 px-4 rounded`}
    >
      {children}
    </button>
  );
}

export function ButtonOutline(props: ButtonProps) {
  const { children, ...rest } = props;
  return (
    <button
      {...rest}
      className="border-primary-normal hover:bg-primary-darker hover:text-white border  text-primary-darker font-bold py-2 px-4 rounded"
    >
      {children}
    </button>
  );
}
