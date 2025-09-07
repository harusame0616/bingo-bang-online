'use client';

import { ReloadIcon } from '@radix-ui/react-icons';

import { Button as ShadcnButton } from '@/components/ui/button';

import { useFormStatus } from 'react-dom'

export type ButtonProps = React.ComponentProps<typeof ShadcnButton> & {
  disableInAction?: boolean;
  disableInActionChildren?: React.ReactNode;
  loading?: boolean;
};

export function Button(props: ButtonProps) {
  const {
    children,
    disableInAction,
    disableInActionChildren,
    loading,
    ...rest
  } = props;
  const { pending } = useFormStatus();

  const showChildren =
    disableInAction === true && pending && disableInActionChildren
      ? disableInActionChildren
      : children;

  return (
    <ShadcnButton
      {...rest}
      disabled={props.disabled || (disableInAction && pending)}
    >
      {(loading || (disableInAction === true && pending)) && (
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      )}
      {showChildren}
    </ShadcnButton>
  );
}
