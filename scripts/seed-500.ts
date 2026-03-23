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
  console.log(`Starting strict pricing catalog seeding operation (${totalItems} items)...`);

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

  // Global Models Arrays mapping directly to real Indian market existence and accurate MSRP baselines
  type ModelDef = { name: string, msrp: number };
  type BrandDef = { brand: string, models: ModelDef[] };

  const globalModels: Record<string, BrandDef[]> = {
    'best-mobiles': [
      { brand: 'Apple', models: [
        { name: 'iPhone 15 Pro Max', msrp: 159900 }, { name: 'iPhone 15', msrp: 79900 }, { name: 'iPhone 14 Plus', msrp: 89900 }, { name: 'iPhone 13', msrp: 59900 }
      ]},
      { brand: 'Samsung', models: [
        { name: 'Galaxy S24 Ultra', msrp: 129999 }, { name: 'Galaxy S23 FE', msrp: 59999 }, { name: 'Galaxy Z Fold 5', msrp: 154999 }, { name: 'Galaxy M34 5G', msrp: 18999 }, { name: 'Galaxy A54', msrp: 38999 }
      ]},
      { brand: 'OnePlus', models: [
        { name: '12R 5G', msrp: 39999 }, { name: '11 5G', msrp: 56999 }, { name: 'Nord CE 3 Lite', msrp: 19999 }, { name: 'Open Foldable', msrp: 139999 }
      ]},
      { brand: 'Google', models: [
        { name: 'Pixel 8 Pro', msrp: 106999 }, { name: 'Pixel 7a', msrp: 43999 }, { name: 'Pixel Fold', msrp: 145000 }
      ]},
      { brand: 'Xiaomi', models: [
        { name: 'Redmi Note 13 Pro', msrp: 25999 }, { name: 'Xiaomi 14 Ultra', msrp: 99999 }, { name: 'Poco X6 Pro', msrp: 26999 }
      ]},
      { brand: 'Vivo', models: [
        { name: 'X100 Pro', msrp: 89999 }, { name: 'V30 Pro', msrp: 41999 }, { name: 'T2x 5G', msrp: 12999 }
      ]}
    ],
    'best-laptops': [
      { brand: 'Apple', models: [
        { name: 'MacBook Air M3 (15-inch)', msrp: 134900 }, { name: 'MacBook Pro 16 M3 Max', msrp: 349900 }, { name: 'MacBook Air M1', msrp: 83900 }
      ]},
      { brand: 'Dell', models: [
        { name: 'XPS 15 OLED', msrp: 210000 }, { name: 'Inspiron 15 3000', msrp: 45000 }, { name: 'Alienware m18', msrp: 350000 }
      ]},
      { brand: 'HP', models: [
        { name: 'Spectre x360', msrp: 160000 }, { name: 'Pavilion 14', msrp: 65000 }, { name: 'Omen Transcend 16', msrp: 175000 }, { name: 'Victus Gaming', msrp: 75000 }
      ]},
      { brand: 'Lenovo', models: [
        { name: 'ThinkPad X1 Carbon Gen 11', msrp: 180000 }, { name: 'IdeaPad Slim 3', msrp: 40000 }, { name: 'Legion Pro 5i', msrp: 140000 }
      ]},
      { brand: 'ASUS', models: [
        { name: 'ROG Zephyrus G14', msrp: 155000 }, { name: 'Vivobook 16X', msrp: 58000 }, { name: 'TUF Gaming A15', msrp: 82000 }
      ]}
    ],
    'best-tvs': [
      { brand: 'Samsung', models: [
        { name: '65" Neo QLED 8K Smart TV', msrp: 320000 }, { name: '55" The Frame QLED', msrp: 95000 }, { name: '43" Crystal Vision 4K Ultra HD', msrp: 32000 }
      ]},
      { brand: 'LG', models: [
        { name: '65" OLED evo C3 Series', msrp: 210000 }, { name: '55" UR7500 LED 4K', msrp: 45000 }, { name: '77" G3 OLED', msrp: 450000 }
      ]},
      { brand: 'Sony', models: [
        { name: 'Bravia XR 65" A80L OLED', msrp: 230000 }, { name: 'Bravia 55" X82L LED', msrp: 74900 }
      ]},
      { brand: 'TCL', models: [
        { name: '55" 4K Google TV C645', msrp: 42000 }, { name: '65" Mini LED QLED', msrp: 85000 }
      ]},
      { brand: 'Hisense', models: [
        { name: '55" Tornado Series 4K', msrp: 38000 }, { name: '65" U7K Mini LED', msrp: 70000 }
      ]}
    ],
    'best-audio': [
      { brand: 'Sony', models: [
        { name: 'WH-1000XM5 Wireless ANC', msrp: 27030 }, { name: 'WF-1000XM5 Earbuds', msrp: 24990 }, { name: 'HT-A7000 Soundbar', msrp: 110000 }
      ]},
      { brand: 'Apple', models: [
        { name: 'AirPods Pro (2nd Gen)', msrp: 24900 }, { name: 'AirPods Max', msrp: 59900 }, { name: 'AirPods (3rd Gen)', msrp: 19900 }
      ]},
      { brand: 'Bose', models: [
        { name: 'QuietComfort Ultra Headphones', msrp: 35900 }, { name: 'Smart Soundbar 900', msrp: 104900 }
      ]},
      { brand: 'JBL', models: [
        { name: 'Flip 6 Waterproof Speaker', msrp: 11999 }, { name: 'Quantum 910 Headset', msrp: 22000 }, { name: 'PartyBox 310', msrp: 45000 }
      ]},
      { brand: 'Sennheiser', models: [
        { name: 'Momentum 4 Wireless', msrp: 34990 }, { name: 'HD 660S2', msrp: 54990 }
      ]}
    ],
    'best-smartwatches': [
      { brand: 'Apple', models: [
        { name: 'Watch Series 9', msrp: 41900 }, { name: 'Watch Ultra 2', msrp: 89900 }, { name: 'Watch SE (2nd Gen)', msrp: 29900 }
      ]},
      { brand: 'Samsung', models: [
        { name: 'Galaxy Watch 6 Classic', msrp: 36999 }, { name: 'Galaxy Watch 5 Pro', msrp: 39999 }
      ]},
      { brand: 'Garmin', models: [
        { name: 'Fenix 7X Pro', msrp: 98990 }, { name: 'Venu 3', msrp: 47990 }, { name: 'Forerunner 265', msrp: 44990 }
      ]},
      { brand: 'Fitbit', models: [
        { name: 'Charge 6', msrp: 14999 }, { name: 'Versa 4', msrp: 20499 }, { name: 'Sense 2', msrp: 24999 }
      ]},
      { brand: 'Amazfit', models: [
        { name: 'GTR 4', msrp: 16999 }, { name: 'T-Rex Ultra', msrp: 42999 }
      ]}
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
      const randomModelObj = faker.helpers.arrayElement(brandObj.models);
      
      const brand = brandObj.brand;
      const title = `${brand} ${randomModelObj.name} (${faker.number.int({min:128, max:512})}GB)`;
      
      // Compute realistic price based on MSRP (slight discount variable)
      const isDiscounted = Math.random() > 0.3; // 70% chance of being discounted
      const price = isDiscounted 
          ? Math.floor(randomModelObj.msrp * faker.number.float({ min: 0.82, max: 0.98 }))
          : randomModelObj.msrp;

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
      const basicEnglishPara = `An exceptional release from ${brand}, the ${randomModelObj.name} delivers cutting-edge performance targeted explicitly at the modern demographic. With high-fidelity output metrics and robust architectural enhancements, this gadget brings unparalleled efficiency directly to your hands. Expect highly optimized load balancing and dynamic interface rendering on every use.`;

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
        affiliateLinksBatch.push({ product_id: item.id, retailer: 'Flipkart', url: `https://www.flipkart.com/search?q=${encodeURIComponent(item.title)}`, current_price: item.price + Math.floor(Math.random() * 500) });
        affiliateLinksBatch.push({ product_id: item.id, retailer: 'Croma', url: `https://www.croma.com/searchB?q=${encodeURIComponent(item.title)}`, current_price: item.price + Math.floor(Math.random() * 200) });
      }
      
      const { error: linkErr } = await supabase.from('affiliate_links').insert(affiliateLinksBatch);
      if (linkErr) console.error("Link batch failed:", linkErr.message);
    }
    
    console.log(`Processed ${i + batchSize} records...`);
  }

  console.log("✅ Huge Database Seeding Complete! 🚀 Visit Live Website to test the robust load!");
}

seedMassiveCatalog(500).catch(console.error);
