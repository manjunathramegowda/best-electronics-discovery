import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';

export type Product = {
  id: number;
  title: string;
  brand: string;
  image_url: string;
  rating: number;
  review_count: number;
  price: number;
  specs: Record<string, string | number>;
  computed_score: number;
  category_slug: string;
};

export function ProductCard({ product, rank }: { product: Product, rank?: number }) {
  return (
    <div className="relative flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow dark:bg-gray-900 dark:border-gray-800">
      {rank && (
        <div className="absolute -top-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-sm">
          #{rank}
        </div>
      )}
      
      <div className="relative h-48 w-full md:w-64 shrink-0 overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
        {/* Placeholder for real image */}
        <div className="text-gray-400 text-sm italic">Image: {product.brand}</div>
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
              {product.brand}
            </span>
            <div className="flex items-center text-sm text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">{product.rating}</span>
              <span className="ml-1 text-gray-400">({product.review_count.toLocaleString()})</span>
            </div>
            <div className="ml-auto inline-flex items-center rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              Score: {product.computed_score}
            </div>
          </div>
          
          <Link href={`/product/${product.id}`} className="group">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {product.title}
            </h3>
          </Link>
          
          <div className="mt-4 grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600 dark:text-gray-400">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500">{key}</span>
                <span className="font-medium text-gray-900 dark:text-gray-200">{value}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400">Current Price</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
          </div>
          
          <div className="flex w-full sm:w-auto gap-3">
            <Link 
              href={`/product/${product.id}`}
              className="flex-1 sm:flex-none flex items-center justify-center rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-colors"
            >
              Read Review
            </Link>
            <a 
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-sm hover:shadow"
            >
              <ShoppingCart className="h-4 w-4" />
              Buy Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
