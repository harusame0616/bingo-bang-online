import { DetailedHTMLProps, HTMLAttributes } from 'react';

export function Section({
  className,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
  return (
    <section className={`mb-12 last:mb-0 ${className || ''}`} {...props} />
  );
}
