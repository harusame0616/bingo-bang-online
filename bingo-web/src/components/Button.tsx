'use client';

import { experimental_useFormStatus as useFormStatus } from 'react-dom';

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  disableInAction?: boolean;
  disableInActionChildren?: React.ReactNode;
};

function BaseButton(props: ButtonProps) {
  const { children, ...rest } = props;
  const { pending } = useFormStatus();

  const showChildren =
    props.disableInAction === true && pending && props.disableInActionChildren
      ? props.disableInActionChildren
      : children;

  return (
    <button
      {...rest}
      disabled={props.disabled || (props.disableInAction && pending)}
    >
      {showChildren}
    </button>
  );
}

export function Button(props: ButtonProps) {
  return (
    <BaseButton
      {...props}
      className={`bg-primary-normal hover:bg-primary-darker text-white font-bold py-2 px-4 rounded disabled:opacity-40 disabled:hover:bg-primary-normal`}
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
