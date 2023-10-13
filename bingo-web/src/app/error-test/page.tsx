import Link from 'next/link';

export default function Page() {
  // eslint-disable-next-line no-console
  console.log('page');
  return (
    <div>
      <div>
        <Link href="/throw"> throw </Link>
        <Link href="/not-found"> not found </Link>
      </div>
    </div>
  );
}
