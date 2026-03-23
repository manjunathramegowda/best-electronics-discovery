import { ProductCard } from '@/components/ProductCard';
import { Filter, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getProductsByCategory } from '@/lib/api';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace('best-', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    title: `Best ${title} Ranked by Data (${new Date().getFullYear()}) | TechDiscover`,
    description: `We analyzed expert reviews, specs, and prices to rank the absolute best ${title.toLowerCase()} available right now.`,
  };
}

export default async function CategoryPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  let categoryProducts = await getProductsByCategory(slug);
  
  // Apply SearchParam Filters
  const brands = resolvedSearchParams.brand 
    ? (Array.isArray(resolvedSearchParams.brand) ? resolvedSearchParams.brand : [resolvedSearchParams.brand]) 
    : [];
  
  const minPrice = resolvedSearchParams.min_price ? Number(resolvedSearchParams.min_price) : 0;
  const maxPrice = resolvedSearchParams.max_price ? Number(resolvedSearchParams.max_price) : Infinity;

  if (brands.length > 0) {
    categoryProducts = categoryProducts.filter((p: any) => brands.includes(p.brand));
  }
  if (minPrice > 0) {
    categoryProducts = categoryProducts.filter((p: any) => p.price >= minPrice);
  }
  if (maxPrice < Infinity) {
    categoryProducts = categoryProducts.filter((p: any) => p.price <= maxPrice);
  }
  
  const sort = resolvedSearchParams.sort as string;
  if (sort === 'price_asc') {
    categoryProducts.sort((a: any, b: any) => a.price - b.price);
  } else if (sort === 'price_desc') {
    categoryProducts.sort((a: any, b: any) => b.price - a.price);
  } else if (sort === 'rating_desc') {
    categoryProducts.sort((a: any, b: any) => b.rating - a.rating);
  }
  
  // Format slug to readable title
  const title = slug.replace('best-', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full bg-gray-50/50 dark:bg-black/20">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-6 font-medium">
        <ol className="flex items-center space-x-2">
          <li><Link href="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
          <li><span className="mx-2 text-gray-300 dark:text-gray-700">/</span></li>
          <li className="text-gray-900 dark:text-gray-200">Best {title}</li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters (Smartprix style) */}
        <div className="w-full lg:w-72 shrink-0">
          <form action={`/category/${slug}`} method="GET" className="sticky top-24 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </div>
            
            <div className="space-y-8">
              {/* Brand Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 tracking-wide uppercase">Brand</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {['Apple', 'Samsung', 'Google', 'OnePlus', 'ASUS', 'Lenovo', 'Dell'].map((brand) => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" name="brand" value={brand} className="peer appearance-none w-5 h-5 border border-gray-300 rounded checked:bg-blue-600 checked:border-blue-600 dark:border-gray-600 dark:bg-gray-800 transition-colors cursor-pointer" />
                        <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 tracking-wide uppercase">Price Range (₹)</h3>
                <div className="flex items-center gap-2">
                  <input type="number" name="min_price" placeholder="Min" className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white transition-all" />
                  <span className="text-gray-400">-</span>
                  <input type="number" name="max_price" placeholder="Max" className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white transition-all" />
                </div>
              </div>
              
              {/* Sort By Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 tracking-wide uppercase">Sort By</h3>
                <select name="sort" className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white transition-all appearance-none">
                  <option value="score_desc">Smart Score (Highest)</option>
                  <option value="price_asc">Price (Lowest First)</option>
                  <option value="price_desc">Price (Highest First)</option>
                  <option value="rating_desc">Top Rated</option>
                </select>
              </div>
            </div>

            <button type="submit" className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm">
              Apply Filters & Sort
            </button>
          </form>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
              Best {title} ({new Date().getFullYear()})
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              We&apos;ve analyzed technical specifications, expert reviews, and current prices to mathematically rank the smartest {title.toLowerCase()} you can buy today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <span className="text-sm text-gray-500 font-medium bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">{categoryProducts.length} products found</span>
          </div>

          <div className="grid gap-6">
            {categoryProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} rank={index + 1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
