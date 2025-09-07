import { DetailedHTMLProps, HTMLAttributes } from 'react';

export function PageBox({
  className,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  return (
    <div
      className={'mx-auto max-w-screen-lg px-4 ' + className ?? ''}
      {...props}
    />
  );
}
