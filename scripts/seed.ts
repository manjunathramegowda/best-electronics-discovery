import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

// Ensure the schema was created
const supabase = createClient(supabaseUrl, supabaseKey);

const categories = [
  { name: "Mobiles", slug: "best-mobiles", faqs: [], buying_guide_html: "<p>Buying guide for mobiles...</p>" },
  { name: "Laptops", slug: "best-laptops", faqs: [], buying_guide_html: "<p>Buying guide for laptops...</p>" }
];

const mobileProducts = [
  {
    title: "Apple iPhone 15 Pro Max (256 GB)",
    brand: "Apple",
    image_url: "https://m.media-amazon.com/images/I/81Os1SDWpcL._AC_SL1500_.jpg",
    rating: 4.8,
    review_count: 15432,
    price: 159900.00,
    specs: { "Screen Size": "6.7 Inches", "Storage": "256 GB", "Camera": "48MP Main", "Processor": "A17 Pro", "OS": "iOS 17" },
    pros: ["Incredible titanium build", "A17 Pro is blazing fast", "USB-C finally"],
    cons: ["Extremely expensive in India", "Slightly slow charging speed"]
  },
  {
    title: "Samsung Galaxy S24 Ultra (512 GB)",
    brand: "Samsung",
    image_url: "https://m.media-amazon.com/images/I/71WcjptMGsL._AC_SL1500_.jpg",
    rating: 4.7,
    review_count: 8120,
    price: 139999.00,
    specs: { "Screen Size": "6.8 Inches", "Storage": "512 GB", "Camera": "200MP Main", "Processor": "Snapdragon 8 Gen 3 for Galaxy", "OS": "Android 14", "Stylus": "S-Pen Included" },
    pros: ["Best-in-class flat display", "Incredible battery life", "7 years of OS updates"],
    cons: ["Very heavy and bulky", "Expensive relative to base models"]
  },
  {
    title: "Google Pixel 8 Pro",
    brand: "Google",
    image_url: "https://m.media-amazon.com/images/I/71LzFfGz5oL._AC_SL1500_.jpg",
    rating: 4.5,
    review_count: 4200,
    price: 106999.00,
    specs: { "Screen Size": "6.7 Inches", "Storage": "128 GB", "Camera": "50MP Main", "Processor": "Tensor G3", "OS": "Android 14" },
    pros: ["Unbeatable still photography", "Cleanest Android experience", "AI features are genuinely useful"],
    cons: ["Battery life is average", "After-sales service network in India is limited"]
  },
  {
    title: "OnePlus 12",
    brand: "OnePlus",
    image_url: "https://m.media-amazon.com/images/I/717EAJEQQUL._AC_SL1500_.jpg",
    rating: 4.6,
    review_count: 12800,
    price: 64999.00,
    specs: { "Screen Size": "6.82 Inches", "Storage": "256 GB", "Camera": "50MP Main", "Processor": "Snapdragon 8 Gen 3", "OS": "OxygenOS 14" },
    pros: ["Incredible value for flagship specs in India", "Blazing fast 100W SuperVOOC charging", "Beautiful bright screen"],
    cons: ["Curved screen isn't for everyone", "Hasselblad processing can be inconsistent"]
  }
];

const laptopProducts = [
  {
    title: "Apple MacBook Air 15-inch (M3 Chip, 16GB RAM)",
    brand: "Apple",
    image_url: "https://m.media-amazon.com/images/I/71vFKBpKakL._AC_SL1500_.jpg",
    rating: 4.9,
    review_count: 5540,
    price: 134900.00,
    specs: { "Screen Size": "15.3 Inches", "RAM": "16 GB Unified", "Storage": "512 GB SSD", "Processor": "Apple M3", "Battery": "Up to 18 Hours" },
    pros: ["Unmatched battery life", "Completely silent (no fan)", "Beautiful large 15-inch display"],
    cons: ["Only 2 USB-C ports", "RAM and Storage upgrades are extremely expensive in India"]
  },
  {
    title: "ASUS ROG Zephyrus G14 (2024)",
    brand: "ASUS",
    image_url: "https://m.media-amazon.com/images/I/81k33C5w2CL._AC_SL1500_.jpg",
    rating: 4.8,
    review_count: 2450,
    price: 149990.00,
    specs: { "Screen Size": "14 Inches OLED 120Hz", "RAM": "16 GB", "Storage": "1 TB SSD", "Processor": "AMD Ryzen 9", "Graphics": "RTX 4060" },
    pros: ["Incredible gaming performance in a thin chassis", "Beautiful OLED panel", "Excellent CNC aluminum build"],
    cons: ["Fans can get loud under heavy load", "RAM is soldered on to the motherboard"]
  },
  {
    title: "Lenovo IdeaPad Slim 5",
    brand: "Lenovo",
    image_url: "https://m.media-amazon.com/images/I/61kXYxH2mZL._AC_SL1500_.jpg",
    rating: 4.4,
    review_count: 18320,
    price: 65990.00,
    specs: { "Screen Size": "16 Inches", "RAM": "16 GB LPDDR5", "Storage": "512 GB SSD", "Processor": "Intel Core i5-13500H", "Weight": "1.89 kg" },
    pros: ["Excellent value for everyday use", "Sturdy aluminum build", "Great port selection including USB-C PD"],
    cons: ["Display color accuracy is average", "Speakers are bottom-firing and lack bass"]
  }
];

async function seed() {
  console.log("Starting database seeding logic pipeline...");

  // FIRST, wipe existing products heavily to clear out USD items
  console.log("Wiping existing products...");
  await supabase.from('affiliate_links').delete().neq('id', 0);
  await supabase.from('products').delete().neq('id', 0);

  // 1. Insert Categories
  for (const cat of categories) {
    const { error } = await supabase.from('categories').upsert({
      name: cat.name,
      slug: cat.slug,
      faqs: cat.faqs,
      buying_guide_html: cat.buying_guide_html
    }, { onConflict: 'slug' });
    if (error) console.error("Error inserting category:", cat.name, error);
  }

  // Fetch created categories to get their IDs
  const { data: catData } = await supabase.from('categories').select('id, slug');
  const mobileCatId = catData?.find(c => c.slug === 'best-mobiles')?.id;
  const laptopCatId = catData?.find(c => c.slug === 'best-laptops')?.id;

  if (!mobileCatId || !laptopCatId) {
    console.error("Categories not returned. Ensure you ran the database_schema.md SQL in Supabase!");
    process.exit(1);
  }

  // 2. Insert Products
  const insertProducts = async (products: any[], categoryId: number) => {
    for (const p of products) {
      // Base Bayesian scoring implementation locally
      const computed_score = (p.rating * 0.7) + (Math.log(p.review_count + 1) * 0.3);

      const { data: insertedProduct, error } = await supabase.from('products').insert({
        category_id: categoryId,
        title: p.title,
        brand: p.brand,
        image_url: p.image_url,
        rating: p.rating,
        review_count: p.review_count,
        price: p.price,
        specs: { ...p.specs, pros: p.pros, cons: p.cons, description: `The ${p.title} is a premium device offering top-tier performance for discerning Indian buyers. Automatically curated by our algorithm.` },
        computed_score: Number(computed_score.toFixed(4))
      }).select('id').single();

      if (error) {
        console.error("Error inserting product", p.title, error.message);
      } else if (insertedProduct) {
        // Insert affiliate links focused on India
        await supabase.from('affiliate_links').insert([
          { product_id: insertedProduct.id, retailer: 'Amazon.in', url: `https://www.amazon.in/s?k=${encodeURIComponent(p.title)}`, current_price: p.price },
          { product_id: insertedProduct.id, retailer: 'Flipkart', url: `https://www.flipkart.com/search?q=${encodeURIComponent(p.title)}`, current_price: p.price + 500 },
          { product_id: insertedProduct.id, retailer: 'Croma', url: `https://www.croma.com/searchB?q=${encodeURIComponent(p.title)}`, current_price: p.price + 200 }
        ]);
        console.log(`Inserted ${p.title} and Indian API links successfully.`);
      }
    }
  };

  console.log("Seeding Indian Mobile Phones...");
  await insertProducts(mobileProducts, mobileCatId);

  console.log("Seeding Indian Laptops...");
  await insertProducts(laptopProducts, laptopCatId);

  console.log("Database Seeding Complete! 🚀 Visit your live site to see the products instantly in INR.");
}

seed();
