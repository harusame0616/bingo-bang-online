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
      className={`bg-primary-normal font-bold text-white hover:bg-primary-darker ${
        props.thick ? 'text-sm' : 'py-2'
      } rounded px-4 disabled:opacity-40 disabled:hover:bg-primary-normal`}
    />
  );
}

export function ButtonOutline(props: ButtonProps) {
  return (
    <BaseButton
      {...props}
      className="rounded border border-primary-normal px-4  py-2 font-bold text-primary-darker hover:bg-primary-darker hover:text-white disabled:opacity-20"
    />
  );
}
