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
        <div className="flex items-center gap-4 xl:ml-8 lg:ml-8 md:ml-8 ml-auto w-full md:w-auto">
          <form action="/search" method="GET" className="relative group w-full md:w-auto">
            <input type="text" name="q" placeholder="Search..." required className="w-full md:w-64 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all dark:text-white" />
            <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
          </form>
        </div>
      </div>
    </header>
  );
}
