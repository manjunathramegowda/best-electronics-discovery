import { ProductCard } from '@/components/ProductCard';
import { ShieldCheck, Trophy, Zap, Smartphone, Laptop, Tv, Headphones, Watch, HomeIcon } from 'lucide-react';
import Link from 'next/link';
import { getTopProducts } from '@/lib/api';

const HIGH_LEVEL_CATEGORIES = [
  { name: "Mobiles", slug: "best-mobiles", icon: Smartphone },
  { name: "Laptops", slug: "best-laptops", icon: Laptop },
  { name: "TVs", slug: "best-tvs", icon: Tv },
  { name: "Audio", slug: "best-audio", icon: Headphones },
  { name: "Watches", slug: "best-smartwatches", icon: Watch },
  { name: "Home", slug: "best-home-appliances", icon: HomeIcon },
];

export default async function Home() {
  const featuredProducts = await getTopProducts(4);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/50 px-3 py-1 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-300">
            <Trophy className="h-4 w-4" />
            <span>Data-Driven Electronics Rankings</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl max-w-4xl text-gray-900 dark:text-white">
            Stop Guessing. <br className="hidden sm:block" />
            <span className="text-blue-600 dark:text-blue-400">Buy the Best.</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl dark:text-gray-400 leading-relaxed">
            We analyze thousands of reviews, compute specific hardware specs, and track prices to find the absolute smartest buys in electronics today.
          </p>
        </div>
      </section>

      {/* Smartprix Style Visual Categories */}
      <section className="py-10 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {HIGH_LEVEL_CATEGORIES.map((cat) => (
              <Link key={cat.name} href={`/category/${cat.slug}`} className="group flex flex-col items-center p-4 rounded-2xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-md hover:bg-blue-50 transition-all dark:bg-gray-900 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:border-gray-700">
                <div className="h-14 w-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform dark:bg-blue-900/40 dark:text-blue-400">
                  <cat.icon className="h-7 w-7" />
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / Top Rated Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Highest Rated This Week</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Our algorithm&apos;s top picks across all categories.</p>
            </div>
          </div>
          
          <div className="grid gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} rank={index + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Factors */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Independent API Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Our algorithm automatically pulls data and reviews from massive datasets to rank products mathematically.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Data-Driven Scoring</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">We don&apos;t do sponsored placements. Products rank simply by having the best combination of ratings, specs, and price.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Real-Time Prices</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Prices are sourced from Amazon.in, Flipkart, and Croma so you can compare and buy at the best deal.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
