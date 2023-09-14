'use client';

import { experimental_useFormStatus as useFormStatus } from 'react-dom';

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  disableInAction?: boolean;
  disableInActionChildren?: React.ReactNode;
  thick?: boolean;
};

function BaseButton(props: ButtonProps) {
  const { children, disableInAction, disableInActionChildren, ...rest } = props;
  const { pending } = useFormStatus();

  const showChildren =
    disableInAction === true && pending && disableInActionChildren
      ? disableInActionChildren
      : children;

  return (
    <button {...rest} disabled={props.disabled || (disableInAction && pending)}>
      {showChildren}
    </button>
  );
}

export function Button(props: ButtonProps) {
  return (
    <BaseButton
      {...props}
      className={`bg-primary-normal hover:bg-primary-darker text-white font-bold ${
        props.thick ? 'text-sm' : 'py-2'
      } px-4 rounded disabled:opacity-40 disabled:hover:bg-primary-normal`}
    />
  );
}

export function ButtonOutline(props: ButtonProps) {
  return (
    <BaseButton
      {...props}
      className="border-primary-normal hover:bg-primary-darker hover:text-white border  text-primary-darker font-bold py-2 px-4 rounded disabled:opacity-20"
    />
  );
}
