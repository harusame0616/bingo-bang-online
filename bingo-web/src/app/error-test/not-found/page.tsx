import { notFound } from 'next/navigation';

export default function Test() {
  // eslint-disable-next-line no-console
  console.log('not-found');
  return notFound();
}
