import { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  // eslint-disable-next-line no-console
  console.log('layout');
  return <div>{children}</div>;
}
