import Link from "next/link";
import { SignedIn, UserButton } from '@clerk/nextjs';

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16">
      <Link href="/" className="text-3xl font-bold text-gray-100 hover:text-blue-600 transition-colors">Voice-2-Text</Link>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
} 