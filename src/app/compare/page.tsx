import { getProductById } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { ArrowLeftRight } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category as string || 'best-mobiles';
  const id1 = resolvedParams.id1 as string;
  const id2 = resolvedParams.id2 as string;

  // Fetch all products in this category for the dropdowns
  const { data: catData } = await supabase.from('categories').select('id, slug').eq('slug', category).single();
  let availableProducts: any[] = [];
  if (catData) {
    const { data } = await supabase.from('products').select('id, title').eq('category_id', catData.id);
    availableProducts = data || [];
  }

  let product1 = id1 ? await getProductById(id1) : null;
  let product2 = id2 ? await getProductById(id2) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <ArrowLeftRight className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Product Comparison</h1>
      </div>

      <form action="/compare" method="GET" className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mb-10 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category</label>
          <select name="category" defaultValue={category} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 appearance-none">
            <option value="best-mobiles">Mobile Phones</option>
            <option value="best-laptops">Laptops</option>
            <option value="best-tvs">Televisions</option>
          </select>
        </div>
        
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Product 1</label>
          <select name="id1" defaultValue={id1} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 appearance-none">
            <option value="">Select a product...</option>
            {availableProducts.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Product 2</label>
          <select name="id2" defaultValue={id2} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 appearance-none">
            <option value="">Select a product...</option>
            {availableProducts.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors">
          Compare
        </button>
      </form>

      {(product1 || product2) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {product1 ? (
              <ProductCard product={product1} />
            ) : (
              <div className="h-64 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl flex items-center justify-center text-gray-400 font-medium bg-gray-50/50 dark:bg-gray-900/50">No product selected</div>
            )}
            
            {product1 && product1.specs && (
              <div className="mt-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-gray-50 dark:bg-gray-950 px-5 py-4 border-b border-gray-200 dark:border-gray-800 font-bold text-gray-900 dark:text-white uppercase tracking-wide text-sm">Specifications</div>
                <dl className="divide-y divide-gray-100 dark:divide-gray-800">
                  {Object.entries(product1.specs).map(([key, value]) => {
                    if (key === 'pros' || key === 'cons' || key === 'description' || key === 'reviews') return null;
                    return (
                      <div key={key} className="flex px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <dt className="w-1/3 text-sm text-gray-500 dark:text-gray-400 font-medium">{key}</dt>
                        <dd className="flex-1 text-sm font-bold text-gray-900 dark:text-gray-200 text-right">{String(value)}</dd>
                      </div>
                    )
                  })}
                </dl>
              </div>
            )}
          </div>
          
          <div>
            {product2 ? (
              <ProductCard product={product2} />
            ) : (
              <div className="h-64 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl flex items-center justify-center text-gray-400 font-medium bg-gray-50/50 dark:bg-gray-900/50">No product selected</div>
            )}
            
             {product2 && product2.specs && (
              <div className="mt-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-gray-50 dark:bg-gray-950 px-5 py-4 border-b border-gray-200 dark:border-gray-800 font-bold text-gray-900 dark:text-white uppercase tracking-wide text-sm">Specifications</div>
                <dl className="divide-y divide-gray-100 dark:divide-gray-800">
                  {Object.entries(product2.specs).map(([key, value]) => {
                    if (key === 'pros' || key === 'cons' || key === 'description' || key === 'reviews') return null;
                    return (
                      <div key={key} className="flex px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <dt className="w-1/3 text-sm text-gray-500 dark:text-gray-400 font-medium">{key}</dt>
                        <dd className="flex-1 text-sm font-bold text-gray-900 dark:text-gray-200 text-right">{String(value)}</dd>
                      </div>
                    )
                  })}
                </dl>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
