import Link from 'next/link';

export default function Page() {
  return (
    <div>
      <div>
        <Link href="/throw"> throw </Link>
        <Link href="/not-found"> not found </Link>
      </div>
    </div>
  );
}
