import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <Image src="/logo.png" alt="Taurus Thrift" width={56} height={56} className="mb-6 opacity-50 dark:hidden" />
      <Image src="/logo-white.png" alt="Taurus Thrift" width={56} height={56} className="mb-6 hidden opacity-50 dark:block" />
      <h1 className="text-6xl font-bold text-brand-brown mb-3">404</h1>
      <h2 className="text-xl font-semibold mb-2">Page not found</h2>
      <p className="text-muted-foreground mb-8 max-w-xs">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/en"
        className="inline-flex items-center px-6 py-3 rounded-lg bg-brand-brown text-white font-medium hover:bg-brand-brown-dark transition-colors"
      >
        Back to shop
      </Link>
    </div>
  );
}
