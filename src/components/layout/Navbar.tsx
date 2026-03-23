import Link from 'next/link';
import { Search, Zap } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:bg-gray-950/80 dark:border-gray-800">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">TechDiscover</span>
        </Link>
        <div className="flex-1" />
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/category/best-mobiles" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Mobile Phones</Link>
          <Link href="/category/best-laptops" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Laptops</Link>
          <Link href="/category/best-tvs" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Televisions</Link>
          <Link href="/compare" className="text-blue-600 font-bold dark:text-blue-400 hover:underline transition-colors flex items-center gap-1.5 hidden lg:flex">Compare Products</Link>
        </nav>
        <div className="flex items-center gap-4 xl:ml-8 lg:ml-8 md:ml-8 ml-auto">
          <button className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors" aria-label="Search">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
