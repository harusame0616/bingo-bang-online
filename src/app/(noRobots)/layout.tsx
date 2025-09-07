import { Metadata } from 'next';
import { PropsWithChildren } from 'react';

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
};

export default function NoRobotsLayout({ children }: PropsWithChildren) {
  return children;
}
