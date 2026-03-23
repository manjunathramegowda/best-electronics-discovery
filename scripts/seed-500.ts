import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { faker } from '@faker-js/faker';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// We define our structural categories
const categoryDefinitions = [
  { name: "Mobiles", slug: "best-mobiles" },
  { name: "Laptops", slug: "best-laptops" },
  { name: "Televisions", slug: "best-tvs" },
  { name: "Audio", slug: "best-audio" },
  { name: "Smartwatches", slug: "best-smartwatches" }
];

async function seedMassiveCatalog(totalItems = 500) {
  console.log(`Starting massive catalog seeding operation (${totalItems} items)...`);

  // Clear existing data heavily
  console.log("Wiping existing DB tables...");
  await supabase.from('affiliate_links').delete().neq('id', 0);
  await supabase.from('products').delete().neq('id', 0);

  // Initialize Categories
  console.log("Setting up categories...");
  for (const cat of categoryDefinitions) {
    await supabase.from('categories').upsert({
      name: cat.name,
      slug: cat.slug,
      faqs: [],
      buying_guide_html: `<p>Buying guide for ${cat.name}...</p>`
    }, { onConflict: 'slug' });
  }

  const { data: catData } = await supabase.from('categories').select('id, slug');
  if (!catData || catData.length === 0) throw new Error("Categories didn't initialize!");

  const brandsLists: Record<string, string[]> = {
    'best-mobiles': ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Motorola', 'Vivo', 'Oppo'],
    'best-laptops': ['Apple', 'Dell', 'Lenovo', 'HP', 'ASUS', 'Acer', 'Microsoft'],
    'best-tvs': ['Samsung', 'LG', 'Sony', 'TCL', 'Hisense', 'Panasonic'],
    'best-audio': ['Sony', 'Bose', 'Sennheiser', 'JBL', 'Apple', 'Jabra'],
    'best-smartwatches': ['Apple', 'Samsung', 'Garmin', 'Fitbit', 'Amazfit']
  };

  const genericImages = [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop', // phone
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop', // laptop
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800&auto=format&fit=crop', // tv
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop', // headphones
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop', // smartwatch
  ];

  console.log("Generating products mock data...");
  const generatedProducts = [];
  const itemsPerCategory = Math.floor(totalItems / catData.length);

  for (let i = 0; i < catData.length; i++) {
    const category = catData[i];
    const categoryBrands = brandsLists[category.slug] || ['Generic'];
    const imagePlaceholder = genericImages[i];

    for (let p = 0; p < itemsPerCategory; p++) {
      const brand = faker.helpers.arrayElement(categoryBrands);
      const randomModelName = faker.helpers.arrayElement(['Pro', 'Max', 'Ultra', 'Plus', 'Air', 'Lite', 'Series X', 'Gen 2', 'Ultimate']);
      const title = `${brand} ${faker.word.noun()} ${randomModelName} (${faker.number.int({ min: 8, max: 64 })}GB RAM)`;
      const price = faker.number.int({ min: 15_000, max: 250_000 });
      const rating = faker.number.float({ min: 3.5, max: 5.0 });
      const review_count = faker.number.int({ min: 50, max: 50000 });
      const computed_score = Number(((rating * 0.7) + (Math.log(review_count + 1) * 0.3)).toFixed(4));

      // Generate mock online reviews
      const mockReviews = Array.from({ length: faker.number.int({ min: 2, max: 5 }) }).map(() => ({
        author: faker.person.fullName(),
        rating: faker.number.int({ min: 3, max: 5 }),
        title: faker.lorem.sentence(4),
        comment: faker.lorem.paragraph(2)
      }));

      generatedProducts.push({
        category_id: category.id,
        title: title,
        brand: brand,
        image_url: imagePlaceholder,
        rating: Number(rating.toFixed(1)),
        review_count: review_count,
        price: price,
        computed_score: computed_score,
        specs: {
          "Display": faker.helpers.arrayElement(["OLED", "LCD", "AMOLED", "Mini-LED", "Retina"]),
          "Processor": faker.helpers.arrayElement(["Snapdragon 8", "Intel Core i7", "Apple M-Series", "MediaTek", "Ryzen 9"]),
          "Battery": faker.helpers.arrayElement(["4000mAh", "5000mAh", "60 Whr", "18 Hours", "All-day"]),
          "Warranty": "1 Year Manufacturer",
          pros: [faker.word.adjective() + " design", "Excellent " + faker.word.noun(), faker.lorem.words(3)],
          cons: ["Average " + faker.word.noun(), "Expensive", faker.lorem.words(3)],
          description: faker.lorem.paragraphs(2),
          reviews: mockReviews
        }
      });
    }
  }

  console.log(`Pushing ${generatedProducts.length} items to Supabase in batches...`);
  
  // Batch insert products
  const batchSize = 100;
  for (let i = 0; i < generatedProducts.length; i += batchSize) {
    const batch = generatedProducts.slice(i, i + batchSize);
    
    // Perform bulk insert
    const { data: insertedData, error } = await supabase.from('products').insert(batch).select('id, price');
    
    if (error) {
      console.error(`Batch ${i} failed:`, error.message);
      continue;
    }

    if (insertedData) {
      // Create affiliate links in bulk
      const affiliateLinksBatch = [];
      for (const item of insertedData) {
        affiliateLinksBatch.push({ product_id: item.id, retailer: 'Amazon.in', url: '#', current_price: item.price });
        affiliateLinksBatch.push({ product_id: item.id, retailer: 'Flipkart', url: '#', current_price: item.price + 500 });
      }
      
      const { error: linkErr } = await supabase.from('affiliate_links').insert(affiliateLinksBatch);
      if (linkErr) console.error("Link batch failed:", linkErr.message);
    }
    
    console.log(`Processed ${i + batchSize} records...`);
  }

  console.log("✅ Huge Database Seeding Complete! 🚀 Visit Live Website to test the robust load!");
}

seedMassiveCatalog(500).catch(console.error);
