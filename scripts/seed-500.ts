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


  // Real World Indian English Reviews Data Logic
  const reviewPraises = [
    "Absolutely love this product! The build quality is phenomenal and it exceeded all my expectations.",
    "Great value for money. I've been using it for a week and the performance is totally solid.",
    "The display is incredibly sharp and the battery life lasts me through a highly intensive workday.",
    "Highly recommended for anyone looking to upgrade. It's fast, beautifully designed, and very reliable.",
    "Delivery was quick via Amazon India and the packaging was supreme. The device itself is flawlessly constructed.",
    "Best purchase of the year for me. The camera sensors and hardware processing is top-notch."
  ];
  const reviewCritiques = [
    "It works well most of the time, but the software can occasionally be a bit buggy out of the box in Indian weather.",
    "Good product overall, but I feel it is slightly overpriced for the features it offers compared to similar market alternatives.",
    "The battery drains a bit faster than I anticipated when running heavy applications like BGMI.",
    "Solid attempt from the brand, but the user interface takes some getting used to. Not exactly intuitive initially.",
    "It's decent, but I had higher expectations. The camera quality in low light is just okay."
  ];

  // Global Models Arrays mapping directly to real Indian market existence
  const globalModels = {
    'best-mobiles': [
      { brand: 'Apple', models: ['iPhone 15 Pro Max', 'iPhone 15', 'iPhone 14 Plus', 'iPhone 13'] },
      { brand: 'Samsung', models: ['Galaxy S24 Ultra', 'Galaxy S23 FE', 'Galaxy Z Fold 5', 'Galaxy M34 5G', 'Galaxy A54'] },
      { brand: 'OnePlus', models: ['12R 5G', '11 5G', 'Nord CE 3 Lite', 'Open Foldable'] },
      { brand: 'Google', models: ['Pixel 8 Pro', 'Pixel 7a', 'Pixel Fold'] },
      { brand: 'Xiaomi', models: ['Redmi Note 13 Pro', 'Xiaomi 14 Ultra', 'Poco X6 Pro'] },
      { brand: 'Vivo', models: ['X100 Pro', 'V30 Pro', 'T2x 5G'] }
    ],
    'best-laptops': [
      { brand: 'Apple', models: ['MacBook Air M3 (15-inch)', 'MacBook Pro 16 M3 Max', 'MacBook Air M1'] },
      { brand: 'Dell', models: ['XPS 15 OLED', 'Inspiron 15 3000', 'Alienware m18'] },
      { brand: 'HP', models: ['Spectre x360', 'Pavilion 14', 'Omen Transcend 16', 'Victus Gaming'] },
      { brand: 'Lenovo', models: ['ThinkPad X1 Carbon Gen 11', 'IdeaPad Slim 3', 'Legion Pro 5i'] },
      { brand: 'ASUS', models: ['ROG Zephyrus G14', 'Vivobook 16X', 'TUF Gaming A15'] }
    ],
    'best-tvs': [
      { brand: 'Samsung', models: ['65" Neo QLED 8K Smart TV', '55" The Frame QLED', '43" Crystal Vision 4K Ultra HD'] },
      { brand: 'LG', models: ['65" OLED evo C3 Series', '55" UR7500 LED 4K', '77" G3 OLED'] },
      { brand: 'Sony', models: ['Bravia XR 65" A80L OLED', 'Bravia 55" X82L LED'] },
      { brand: 'TCL', models: ['55" 4K Google TV C645', '65" Mini LED QLED'] },
      { brand: 'Hisense', models: ['55" Tornado Series 4K', '65" U7K Mini LED'] }
    ],
    'best-audio': [
      { brand: 'Sony', models: ['WH-1000XM5 Wireless ANC', 'WF-1000XM5 Earbuds', 'HT-A7000 Soundbar'] },
      { brand: 'Apple', models: ['AirPods Pro (2nd Gen)', 'AirPods Max', 'AirPods (3rd Gen)'] },
      { brand: 'Bose', models: ['QuietComfort Ultra Headphones', 'Smart Soundbar 900'] },
      { brand: 'JBL', models: ['Flip 6 Waterproof Speaker', 'Quantum 910 Headset', 'PartyBox 310'] },
      { brand: 'Sennheiser', models: ['Momentum 4 Wireless', 'HD 660S2'] }
    ],
    'best-smartwatches': [
      { brand: 'Apple', models: ['Watch Series 9', 'Watch Ultra 2', 'Watch SE (2nd Gen)'] },
      { brand: 'Samsung', models: ['Galaxy Watch 6 Classic', 'Galaxy Watch 5 Pro'] },
      { brand: 'Garmin', models: ['Fenix 7X Pro', 'Venu 3', 'Forerunner 265'] },
      { brand: 'Fitbit', models: ['Charge 6', 'Versa 4', 'Sense 2'] },
      { brand: 'Amazfit', models: ['GTR 4', 'T-Rex Ultra'] }
    ]
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
    const modelsList = globalModels[category.slug as keyof typeof globalModels] || globalModels['best-mobiles'];
    const imagePlaceholder = genericImages[i];

    for (let p = 0; p < itemsPerCategory; p++) {
      // Pick a real brand and real model mapping
      const brandObj = faker.helpers.arrayElement(modelsList);
      const randomModelName = faker.helpers.arrayElement(brandObj.models);
      
      const brand = brandObj.brand;
      const title = `${brand} ${randomModelName} (${faker.number.int({min:128, max:512})}GB)`;
      
      const price = faker.number.int({ min: 15_000, max: 250_000 });
      const rating = faker.number.float({ min: 3.5, max: 5.0 });
      const review_count = faker.number.int({ min: 50, max: 50000 });
      // Score algorithm prioritizes good ratings + high counts + competitive price ratio
      const computed_score = Number(((rating * 0.7) + (Math.log(review_count + 1) * 0.3)).toFixed(4));

      // Generate mock online reviews using ENGLISH terminology
      const mockReviews = Array.from({ length: faker.number.int({ min: 2, max: 5 }) }).map(() => {
        const revRating = faker.number.int({ min: 3, max: 5 });
        return {
          author: faker.person.fullName(),
          rating: revRating,
          title: revRating >= 4 ? "Excellent Purchase!" : "Good but has flaws",
          comment: revRating === 5 
            ? faker.helpers.arrayElement(reviewPraises)
            : faker.helpers.arrayElement(reviewCritiques)
        }
      });

      // Simple English description
      const basicEnglishPara = `An exceptional release from ${brand}, the ${randomModelName} delivers cutting-edge performance targeted explicitly at the modern demographic. With high-fidelity output metrics and robust architectural enhancements, this gadget brings unparalleled efficiency directly to your hands. Expect highly optimized load balancing and dynamic interface rendering on every use.`;

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
          "Display": faker.helpers.arrayElement(["OLED", "LCD", "AMOLED", "Mini-LED", "Retina OLED"]),
          "Processor": faker.helpers.arrayElement(["Snapdragon 8 Gen 3", "Intel Core i9 14th Gen", "Apple M3 Pro", "MediaTek Dimensity 9300", "AMD Ryzen 9 7945HX"]),
          "Battery": faker.helpers.arrayElement(["4500mAh", "5000mAh", "68 Whr", "84 Whr", "100 Whr", "Up to 36 hours"]),
          "Warranty": "1 Year Official Manufacturer Warranty",
          pros: [faker.helpers.arrayElement(["Stunning visually", "Sleek industrial design", "Premium feel"]), "Excellent hardware integrity", "Incredible battery lifespan"],
          cons: ["Can be heavy for some", "Premium price range", "No charger in box"],
          description: basicEnglishPara,
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
    const { data: insertedData, error } = await supabase.from('products').insert(batch).select('id, price, title');
    
    if (error) {
      console.error(`Batch ${i} failed:`, error.message);
      continue;
    }

    if (insertedData) {
      // Create affiliate links in bulk
      const affiliateLinksBatch: any[] = [];
      for (const item of insertedData) {
        affiliateLinksBatch.push({ product_id: item.id, retailer: 'Amazon.in', url: `https://www.amazon.in/s?k=${encodeURIComponent(item.title)}`, current_price: item.price });
        affiliateLinksBatch.push({ product_id: item.id, retailer: 'Flipkart', url: `https://www.flipkart.com/search?q=${encodeURIComponent(item.title)}`, current_price: item.price + 500 });
        affiliateLinksBatch.push({ product_id: item.id, retailer: 'Croma', url: `https://www.croma.com/searchB?q=${encodeURIComponent(item.title)}`, current_price: item.price + 200 });
      }
      
      const { error: linkErr } = await supabase.from('affiliate_links').insert(affiliateLinksBatch);
      if (linkErr) console.error("Link batch failed:", linkErr.message);
    }
    
    console.log(`Processed ${i + batchSize} records...`);
  }

  console.log("✅ Huge Database Seeding Complete! 🚀 Visit Live Website to test the robust load!");
}

seedMassiveCatalog(500).catch(console.error);
