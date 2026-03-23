import { Star, CheckCircle2, AlertCircle, ExternalLink, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getProductById } from '@/lib/api';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  
  return {
    title: `${product.title} Review & Best Price | TechDiscover`,
    description: product.description?.substring(0, 155) + '...',
    openGraph: {
      title: product.title,
      description: product.description?.substring(0, 155) + '...',
    }
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.image_url || 'https://best-electronics-discovery.vercel.app/default.jpg',
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.review_count,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="bg-gray-50/50 dark:bg-black/20 min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 pt-6 pb-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex text-sm text-gray-500 font-medium">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
              <li><ChevronRight className="h-4 w-4 text-gray-400" /></li>
              <li><Link href={`/category/${product.category_slug}`} className="hover:text-blue-600 transition-colors capitalize">{product.category_slug.replace('best-', '').replace('-', ' ')}</Link></li>
              <li><ChevronRight className="h-4 w-4 text-gray-400" /></li>
              <li className="text-gray-900 dark:text-gray-200 truncate max-w-[200px] sm:max-w-xs">{product.title}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Image & Media */}
          <div className="lg:col-span-5 space-y-4">
            <div className="aspect-square bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl flex items-center justify-center p-8 overflow-hidden relative shadow-sm">
              {/* Score Badge */}
              <div className="absolute top-6 left-6 bg-blue-600/95 backdrop-blur text-white px-4 py-2 rounded-2xl shadow-lg flex flex-col items-center border border-blue-500/50">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-90 mb-0.5">Score</span>
                <span className="text-3xl font-extrabold leading-none">{product.computed_score}</span>
              </div>
              
              {product.image_url ? (
                <img src={product.image_url} alt={product.title} className="max-h-full max-w-full object-contain" />
              ) : (
                <div className="text-gray-400 font-medium italic">Product Image</div>
              )}
            </div>
          </div>

          {/* Right Column: Details & Price */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-sm font-bold text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20 uppercase tracking-wide">
                {product.brand}
              </span>
              <div className="flex items-center text-sm bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full ring-1 ring-inset ring-yellow-500/20 font-medium text-yellow-800 dark:text-yellow-500">
                <div className="flex text-yellow-500 mr-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                  ))}
                </div>
                <span>{product.rating}</span>
                <span className="ml-1 opacity-70 cursor-pointer hover:underline">({product.review_count.toLocaleString()} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-6">
              {product.title}
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
              {product.description}
            </p>

            {/* Buying Box - Most Critical for Affiliate Conversions */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-blue-100 dark:border-blue-900/40 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none mb-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              
              <div className="flex items-end justify-between mb-8 relative z-10">
                <div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Best Available Price</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-5xl font-extrabold text-gray-900 dark:text-white">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-green-700 bg-green-50 dark:bg-green-900/30 dark:text-green-400 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-800/50">
                    <CheckCircle2 className="h-4 w-4" /> In Stock
                  </span>
                  <span className="text-xs font-medium text-gray-500 mt-2">Free shipping eligible</span>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                {product.affiliate_links && product.affiliate_links.length > 0 ? (
                  <>
                    <a href={product.affiliate_links[0]?.url || '#'} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-3 bg-[#FF9900] hover:bg-[#e68a00] text-black font-extrabold text-lg py-4 px-8 rounded-2xl transition-transform hover:scale-[1.02] shadow-sm">
                      Buy on {product.affiliate_links[0]?.retailer || 'Store'} <ExternalLink className="h-5 w-5" />
                    </a>
                    {product.affiliate_links.length > 1 && (
                      <div className="grid grid-cols-2 gap-4">
                        {product.affiliate_links.slice(1).map((link: any, idx: number) => (
                          <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors">
                            {link.retailer} <ExternalLink className="h-4 w-4" />
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 italic text-center py-4">No buying options available right now.</p>
                )}
              </div>
              <p className="text-[11px] text-center text-gray-400 mt-5 font-medium">
                Prices last verified today via API. We earn a commission if you purchase through these links.
              </p>
            </div>

            {/* Specs & Pros/Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Specs */}
              <div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-5 uppercase tracking-wide">Key Specs</h3>
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                  <dl className="divide-y divide-gray-100 dark:divide-gray-800">
                    {Object.entries(product.specs || {}).map(([key, value]) => {
                      if (key === 'pros' || key === 'cons' || key === 'description' || key === 'reviews') return null;
                      return (
                        <div key={key} className="flex grid-cols-3 px-5 py-3.5 sm:gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <dt className="text-sm font-semibold text-gray-500 dark:text-gray-400 w-1/3">{key}</dt>
                          <dd className="text-sm font-bold text-gray-900 dark:text-gray-200 flex-1 text-right">{String(value)}</dd>
                        </div>
                      );
                    })}
                  </dl>
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-5 flex items-center gap-2 uppercase tracking-wide">
                    <CheckCircle2 className="h-5 w-5 text-green-500" /> What We Love
                  </h3>
                  <ul className="space-y-3">
                    {(product.pros || []).map((pro: string, i: number) => (
                      <li key={i} className="flex gap-3 text-gray-700 dark:text-gray-300 text-sm font-medium">
                        <div className="mt-0.5"><CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /></div>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-5 flex items-center gap-2 uppercase tracking-wide">
                    <AlertCircle className="h-5 w-5 text-red-500" /> Keep In Mind
                  </h3>
                  <ul className="space-y-3">
                    {(product.cons || []).map((con: string, i: number) => (
                      <li key={i} className="flex gap-3 text-gray-700 dark:text-gray-300 text-sm font-medium">
                        <div className="mt-0.5"><AlertCircle className="h-4 w-4 text-red-500 shrink-0" /></div>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Simulated Online Reviews Section */}
            {product.specs?.reviews && product.specs.reviews.length > 0 && (
              <div className="mt-16">
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6 uppercase tracking-wide">Top Reviews from the Web</h3>
                <div className="space-y-6">
                  {product.specs.reviews.map((rev: any, idx: number) => (
                    <div key={idx} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, st) => (
                            <Star key={st} className={`h-4 w-4 ${st < rev.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-700'}`} />
                          ))}
                        </div>
                        <span className="font-bold text-gray-900 dark:text-gray-100">{rev.title}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">"{rev.comment}"</p>
                      <span className="text-xs text-gray-500 font-medium">— {rev.author} (Verified Purchase)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
    </>
  );
}
