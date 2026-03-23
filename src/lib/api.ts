import { supabase } from './supabase';
import { Product } from '@/components/ProductCard';

// MOCK DATA FALLBACKS (Used if the database is empty or not yet seeded)
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: "Ninja Professional 72 Oz Countertop Blender",
    brand: "Ninja",
    image_url: "",
    rating: 4.8,
    review_count: 42500,
    price: 99.99,
    specs: { "Wattage": "1000W", "Capacity": "72 oz", "Speeds": 3 },
    computed_score: 9.2,
    category_slug: "best-mixer-grinders"
  },
  {
    id: 2,
    title: "LG C3 Series 65-Inch Class OLED Evo Smart TV",
    brand: "LG",
    image_url: "",
    rating: 4.7,
    review_count: 3200,
    price: 1599.99,
    specs: { "Refresh Rate": "120Hz", "Resolution": "4K", "Display": "OLED" },
    computed_score: 9.1,
    category_slug: "best-tvs"
  }
];

export async function getTopProducts(limit = 6): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories ( slug )
      `)
      .order('computed_score', { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      console.warn('Falling back to mock data for Top Products.');
      return MOCK_PRODUCTS;
    }

    return data.map((p) => ({
      ...p,
      category_slug: p.categories?.slug || 'unknown'
    }));
  } catch (e) {
    return MOCK_PRODUCTS;
  }
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  try {
    const { data: category } = await supabase
      .from('categories')
      .select('id, slug')
      .eq('slug', slug)
      .single();

    if (!category) return MOCK_PRODUCTS.filter(p => p.category_slug === slug);

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', category.id)
      .order('computed_score', { ascending: false });

    if (error || !data || data.length === 0) {
      return MOCK_PRODUCTS.filter(p => p.category_slug === slug);
    }

    return data.map(p => ({
      ...p,
      category_slug: category.slug
    }));
  } catch (e) {
    return MOCK_PRODUCTS.filter(p => p.category_slug === slug);
  }
}

export async function getProductById(id: string): Promise<any> {
    try {
        const { data: product, error } = await supabase
            .from('products')
            .select(`
                *,
                categories ( slug )
            `)
            .eq('id', id)
            .single();
        
        if (error || !product) {
            return getMockProductDetail(id);
        }

        const { data: links } = await supabase
            .from('affiliate_links')
            .select('*')
            .eq('product_id', id);

        return {
            ...product,
            category_slug: product.categories?.slug || '',
            affiliate_links: links || [],
            pros: product.specs?.pros || [], 
            cons: product.specs?.cons || [],
            description: product.specs?.description || 'No description available.',
        };
    } catch (e) {
        return getMockProductDetail(id);
    }
}

function getMockProductDetail(id: string) {
    const baseProduct = MOCK_PRODUCTS.find(p => p.id === Number(id)) || MOCK_PRODUCTS[0];
    return {
        ...baseProduct,
        description: "This is a fallback mock description. The database is either empty or the Supabase connection has not been finalized yet.",
        pros: ["Excellent build quality", "Great value for the price"],
        cons: ["Out of stock frequently"],
        affiliate_links: []
    }
}
