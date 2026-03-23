import { supabase } from '@/lib/supabase';
import { ProductCard } from '@/components/ProductCard';
import { Search } from 'lucide-react';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q: string }> }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q;

  let searchResults: any[] = [];
  
  if (query && query.trim() !== '') {
    const { data } = await supabase
      .from('products')
      .select('*, affiliate_links(*)')
      .ilike('title', `%${query}%`)
      .order('computed_score', { ascending: false })
      .limit(50);
      
    searchResults = data || [];
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <Search className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          {query ? `Search results for "${query}"` : 'Global Search'}
        </h1>
      </div>

      {!query ? (
        <div className="max-w-xl text-center py-20 mx-auto">
          <p className="text-lg text-gray-500 dark:text-gray-400">Please enter a search term above to find the best electronics.</p>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="max-w-xl text-center py-20 mx-auto border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
          <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">No results found</p>
          <p className="text-gray-500 dark:text-gray-400">We couldn&apos;t find any products matching &quot;{query}&quot;. Try adjusting your keywords.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          <p className="text-sm text-gray-500 font-medium mb-2">{searchResults.length} products found matching your query.</p>
          {searchResults.map((product, index) => (
            <ProductCard key={product.id} product={product} rank={index + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
