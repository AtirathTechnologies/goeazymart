import riceImg from '../assets/categories/rice.jpg';
import spicesImg from '../assets/categories/spices.jpg';
import condimentsImg from '../assets/categories/condiments.png';
import seedsImg from '../assets/categories/seeds.jpg';
import processedImg from '../assets/categories/processed.webp';
import textileImg from '../assets/categories/textile.jpg';
import herbalImg from '../assets/categories/herbal.jpg';
import oilsImg from '../assets/categories/Oil_Dairy.png';
import constructionImg from '../assets/categories/construction.webp';
import industrialImg from '../assets/categories/industrial.jpg';
import tunaImg1 from "../assets/images/soltuna/tuna-chilli.jpeg";
import tunaImg2 from "../assets/images/soltuna/tuna-olive_oil.jpeg";
import tunaImg3 from "../assets/images/soltuna/tuna-lemon-pepper.jpeg";
import tunaImg4 from "../assets/images/soltuna/tuna-chunk-SJ-soy-oil.png";
import tunaImg5 from "../assets/images/soltuna/tuna-spring-water.jpeg";
import tunaImg6 from "../assets/images/soltuna/tuna-SJ-lemon-pepper.png";
import tunaImg7 from "../assets/images/soltuna/tuna-SJ-spring-water.png";
import tunaImg8 from "../assets/images/soltuna/tuna-SJ-olive_oil.png";
import tunaImg9 from "../assets/images/soltuna/tuna-spicy-delight.png";
import tunaImg10 from "../assets/images/soltuna/tuna-chunk-soy-oil.png";
import tunaImg11 from "../assets/images/soltuna/tuna-vegetable-oil.jpeg";
import tunaBanner from "../assets/images/soltuna/soltuna.png";
import rice1121banner from "../assets/images/rice/1121_banner.png";
import rice1121Img1 from "../assets/images/rice/1121_steam_A+.png";
import rice1121Img2 from "../assets/images/rice/1121_steam_A.png";
import rice1121Img3 from "../assets/images/rice/1121_golden_sella_A.png";
import rice1121Img4 from "../assets/images/rice/1121_golden_sella_A+.png";
import rice1121Img5 from "../assets/images/rice/1121_white_sella_A+.png";
import rice1121Img6 from "../assets/images/rice/1121_white_sella_A.png";
import rice1509banner from "../assets/images/rice/1509_banner.png";
import rice1509Img1 from "../assets/images/rice/1509_steam_A+.png";
import rice1509Img2 from "../assets/images/rice/1509_steam_A.png";
import rice1509Img3 from "../assets/images/rice/1509_golden_sella_A.png";
import rice1509Img4 from "../assets/images/rice/1509_golden_sella_A+.png";
import rice1509Img5 from "../assets/images/rice/1509_white_sella_A+.png";
import rice1509Img6 from "../assets/images/rice/1509_white_sella_A.png";

import rice1401Img1 from "../assets/images/rice/1401_steam_A+.png";
import rice1401Img2 from "../assets/images/rice/1401_steam_A.png";
import rice1401Img3 from "../assets/images/rice/1401_golden_sella_A.png";
import rice1401Img4 from "../assets/images/rice/1401_golden_sella_A+.png";
import rice1401Img5 from "../assets/images/rice/1401_white_sella_A+.png";
import rice1401Img6 from "../assets/images/rice/1401_white_sella_A.png";

import ricejeerabanner from "../assets/images/rice/jeerakasala.jpeg";
import ricejeeraImg1 from "../assets/images/rice/jeera_steam.png";
import ricejeeraImg2 from "../assets/images/rice/jeera_raw.png";
import ricejeeraImg3 from "../assets/images/rice/jeera_golden.png";


import riceidlibanner from "../assets/images/rice/idliricebanner.png";
import riceidliImg1 from "../assets/images/rice/idli_raw.png";
import riceidliImg2 from "../assets/images/rice/idli_parboiled.png";
import riceidliImg3 from "../assets/images/rice/idli_creamy_parboiled.png";

import ricesonamasooribanner from "../assets/images/rice/sonabanner.png";
import ricesonaImg1 from "../assets/images/rice/sona_steam.png";
import ricesonaImg2 from "../assets/images/rice/sona_golden.png";
import ricesonaImg3 from "../assets/images/rice/sona_creamy_parboiled.png";
import ricesonaImg4 from "../assets/images/rice/sona_sella.png";

import riceIR64banner from "../assets/images/rice/IR-64_banner.png";
import riceIR64Img1 from "../assets/images/rice/IR-64_parboiled.png";
import riceIR64Img2 from "../assets/images/rice/IR-64_raw.png";
import riceIR64Img3 from "../assets/images/rice/IR-64_sella.png";
import riceIR64Img4 from "../assets/images/rice/IR-64_steam.png";


import solomonBanner from "../assets/images/solomon/solomon.png";
import solomonImg1 from "../assets/images/solomon/special-chunk-soy-oil.png";
import solomonImg2 from "../assets/images/solomon/sandwich-flakes-yf-soy-oil.png";
import solomonImg3 from "../assets/images/solomon/white-flakes-soy-oil.png";
import solomonImg4 from "../assets/images/solomon/red-flakes-soy-oil.png";
import solomonImg5 from "../assets/images/solomon/curry-flakes-SJ-soy-oil.png";


const generateId = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const products = [
  // ✅ BASMATI

  {
    id: generateId('1121 Basmati Rice'),
    cat: 'rice',
    icon: '🌾',
    name: '1121 Basmati Rice',
    banner: rice1121banner,
    images: [rice1121Img1, rice1121Img2, rice1121Img3, rice1121Img4, rice1121Img5, rice1121Img6],
    description: "Premium long-grain 1121 Basmati rice known for its rich aroma, extra-long grain length (8.2-8.4mm), and superior cooking quality. Ideal for biryani, pulao, and premium culinary applications.",
    grades: ["1121 Steam A+", "1121 Steam A", "1121 Golden Sella A", "1121 Golden Sella A+", "1121 White Sella A+", "1121 White Sella A"],
    quantities: ["5 KG", "10 KG", "30 KG"],
    price: {
      "1121 Steam A+": { "5 KG": 475, "10 KG": 950, "30 KG": 2850 },
      "1121 Steam A": { "5 KG": 505, "10 KG": 1010, "30 KG": 3030 },
      "1121 Golden Sella A": { "5 KG": 510, "10 KG": 1020, "30 KG": 3060 },
      "1121 Golden Sella A+": { "5 KG": 510, "10 KG": 1020, "30 KG": 3060 },
      "1121 White Sella A+": { "5 KG": 730, "10 KG": 1460, "30 KG": 4380 },
      "1121 White Sella A": { "5 KG": 520, "10 KG": 1040, "30 KG": 3120 }
    },
    highlights: [
      "Extra long grain (8.2 – 8.4 mm)",
      "Naturally aged for rich aroma",
      "Max 1–2% broken grains",
      "Perfect for biryani & premium dishes",
      "Export quality with uniform grains",
    ],
    specifications: {
      Moisture: "Max 12%",
      Broken: "Max 1–2%",
      Purity: "95%+",
      Origin: "India",
      Packaging: "5kg, 10kg, 25kg, 50kg bags",
      ShelfLife: "12 Months",
      Color: "Natural White",
      GrainLength: "8.2 – 8.4 mm",
      Aroma: "Natural",
      HSN: "10063020",
      Brand: "SIEA"
    },
    reviews: [
      {
        name: "Ramesh",
        rating: 5,
        comment: "Excellent quality! Export standard.",
        date: "2026-04-20"
      },
      {
        name: "Suresh",
        rating: 4,
        comment: "Good packaging and fast delivery.",
        date: "2026-04-18"
      }
    ]
  },
  {
    id: generateId('1509 Basmati Rice'),
    cat: 'rice',
    icon: '🌾',
    name: '1509 Basmati Rice',
    banner: rice1509banner,
    images: [rice1509Img1, rice1509Img2, rice1509Img3, rice1509Img4, rice1509Img5, rice1509Img6],
    description: "Premium aromatic Basmati rice with excellent grain length (7.8-8.1mm) and natural fragrance. Perfect for daily use and special occasions like biryani and pulao.",
    grades: ["1509 Steam A+", "1509 Steam A", "1509 Golden Sella A+", "1509 Golden Sella A", "1509 White Sella A+", "1509 White Sella A"],
    quantities: ["5 KG", "10 KG", "30 KG"],
    price: {
      "1509 Steam A+": { "5 KG": 585, "10 KG": 1170, "30 KG": 3510 },
      "1509 Steam A": { "5 KG": 630, "10 KG": 1260, "30 KG": 3780 },
      "1509 Golden Sella A+": { "5 KG": 740, "10 KG": 1480, "30 KG": 4440 },
      "1509 Golden Sella A": { "5 KG": 550, "10 KG": 1100, "30 KG": 3300 },
      "1509 White Sella A+": { "5 KG": 475, "10 KG": 950, "30 KG": 2850 },
      "1509 White Sella A": { "5 KG": 505, "10 KG": 1010, "30 KG": 3030 }
    },
    highlights: [
      "Long grain (7.8 – 8.1 mm)",
      "Naturally aromatic",
      "Max 2% broken grains",
      "Fresh harvest Nov 2026",
      "Ideal for biryani and pulao",
      "High yielding variety"
    ],
    specifications: {
      Moisture: "Max 12%",
      Broken: "Max 2%",
      Purity: "94%+",
      Origin: "India",
      Packaging: "5kg, 10kg, 25kg, 50kg bags",
      ShelfLife: "12 Months",
      Color: "Natural White",
      GrainLength: "7.8 – 8.1 mm",
      Aroma: "Natural",
      HSN: "10063020",
      Brand: "SIEA"
    }
  },
  {
    id: generateId('Jeera Kasala Rice'),
    cat: 'rice',
    icon: '🌾',
    name: 'Jeera Kasala Rice',
    banner: ricejeerabanner,
    images: [ricejeeraImg1, ricejeeraImg2, ricejeeraImg3],
    description: "Traditional aromatic rice variety known for its distinct jeera (cumin) like fragrance and small, flavorful grains. Highly prized for biryani, ghee rice, and festive preparations.",
    grades: ["Jeera Kasala Steam", "Jeera Kasala Golden Sella", "Jeera Kasala Raw"],
    quantities: ["5 KG", "10 KG", "25 KG"],
    price: {
      "Jeera Kasala Steam": { "5 KG": 350, "10 KG": 680, "25 KG": 1650 },
      "Jeera Kasala Golden Sella": { "5 KG": 380, "10 KG": 740, "25 KG": 1800 },
      "Jeera Kasala Raw": { "5 KG": 320, "10 KG": 620, "25 KG": 1500 }
    },
    highlights: [
      "Distinct jeera/cumin aroma",
      "Small, flavorful grains",
      "Max 2% broken grains",
      "Perfect for biryani & ghee rice",
      "Traditional variety"
    ],
    specifications: {
      Moisture: "Max 12%",
      Broken: "Max 2%",
      Purity: "96%+",
      Origin: "India",
      Packaging: "5kg, 10kg, 25kg, 50kg bags",
      ShelfLife: "12 Months",
      Color: "Natural White",
      GrainType: "Short Grain",
      Aroma: "Strong Jeera Aroma",
      HSN: "10063090",
      Brand: "SIEA"
    },
    reviews: [
      {
        name: "Arun",
        rating: 5,
        comment: "Authentic Jeera Kasala rice. Perfect aroma for biryani!",
        date: "2026-04-15"
      }
    ]
  },
  {
    id: generateId('Idli Rice'),
    cat: 'rice',
    icon: '🌾',
    name: 'Idli Rice',
    banner: riceidlibanner,
    images: [riceidliImg1, riceidliImg2, riceidliImg3],
    description: "Special parboiled rice variety specifically processed for making soft, fluffy idlis and dosas. Coarsely ground to achieve the perfect fermentation and texture.",
    grades: ["Idli Special Parboiled", "Idli Creamy Parboiled", "Idli Raw Rice"],
    quantities: ["5 KG", "10 KG", "25 KG", "50 KG"],
    price: {
      "Idli Special Parboiled": { "5 KG": 280, "10 KG": 540, "25 KG": 1300, "50 KG": 2550 },
      "Idli Creamy Parboiled": { "5 KG": 260, "10 KG": 500, "25 KG": 1200, "50 KG": 2350 },
      "Idli Raw Rice": { "5 KG": 240, "10 KG": 460, "25 KG": 1100, "50 KG": 2150 }
    },
    highlights: [
      "Specially processed for idli/dosa",
      "Gives soft and fluffy idlis",
      "Good fermentation quality",
      "Max 3% broken grains",
      "Ideal for South Indian breakfast"
    ],
    specifications: {
      Moisture: "Max 13%",
      Broken: "Max 3%",
      Purity: "94%+",
      Origin: "India",
      Packaging: "5kg, 10kg, 25kg, 50kg bags",
      ShelfLife: "12 Months",
      Color: "Creamy White",
      GrainType: "Short Grain",
      Aroma: "Mild",
      Usage: "Idli, Dosa, Rice Batter",
      HSN: "10063090",
      Brand: "SIEA"
    },
    reviews: [
      {
        name: "Lakshmi",
        rating: 5,
        comment: "Makes very soft idlis. Great quality!",
        date: "2026-04-10"
      }
    ]
  },
  // {
  //   id: generateId('1401 Basmati Rice'),
  //   cat: 'rice',
  //   icon: '🌾',
  //   name: '1401 Basmati Rice',
  //   images: [rice1401Img1, rice1401Img2, rice1401Img3, rice1401Img4, rice1401Img5, rice1401Img6],
  //   description: "Fine and flavorful Basmati rice with medium-long grains (7.6-7.9mm). Known for its excellent taste and cooking properties, suitable for everyday use and special dishes.",
  //   grades: ["1401 Steam A+", "1401 Steam A", "1401 White Sella A+", "1401 White Sella A", "1401 Golden Sella A+", "1401 Golden Sella A"],
  //   quantities: ["5 KG", "10 KG", "30 KG"],
  //   price: {
  //     "1401 Steam A+": { "5 KG": 460, "10 KG": 920, "30 KG": 2760 },
  //     "1401 Steam A": { "5 KG": 515, "10 KG": 1030, "30 KG": 3090 },
  //     "1401 White Sella A+": { "5 KG": 715, "10 KG": 1430, "30 KG": 4290 },
  //     "1401 White Sella A": { "5 KG": 715, "10 KG": 1430, "30 KG": 4290 },
  //     "1401 Golden Sella A+": { "5 KG": 715, "10 KG": 1430, "30 KG": 4290 },
  //     "1401 Golden Sella A": { "5 KG": 715, "10 KG": 1430, "30 KG": 4290 }
  //   },
  //   highlights: [
  //     "Medium-long grain (7.6 – 7.9 mm)",
  //     "Natural aroma",
  //     "Max 2% broken grains",
  //     "Versatile cooking applications",
  //   ],
  //   specifications: {
  //     Moisture: "Max 12%",
  //     Broken: "Max 2%",
  //     Purity: "94%+",
  //     Origin: "India",
  //     Packaging: "5kg, 10kg, 25kg, 50kg bags",
  //     ShelfLife: "12 Months",
  //     Color: "Natural White",
  //     GrainLength: "7.6 – 7.9 mm",
  //     Aroma: "Natural",

  //     HSN: "10063020",
  //     Brand: "SIEA"
  //   }
  // },
  // {
  //   id: generateId('Pusa Basmati Rice'),
  //   cat: 'rice',
  //   icon: '🌾',
  //   name: 'Pusa Basmati Rice',
  //   images: [riceImg, spicesImg, seedsImg, textileImg, herbalImg, condimentsImg],
  //   description: "Versatile Basmati rice variety with strong natural aroma and excellent grain quality. Perfect for authentic Indian cuisine including biryani and special rice dishes.",
  //   grades: ["Pusa Golden Sella A", "Pusa Golden Sella A+", "Pusa White Sella A+", "Pusa White Sella A", "Pusa Steam A", "Pusa Steam A+"],
  //   quantities: ["5 KG", "10 KG", "30 KG"],
  //   price: {
  //     "Pusa Golden Sella A": { "5 KG": 745, "10 KG": 1490, "30 KG": 4470 },
  //     "Pusa Golden Sella A+": { "5 KG": 585, "10 KG": 1170, "30 KG": 3510 },
  //     "Pusa White Sella A+": { "5 KG": 665, "10 KG": 1330, "30 KG": 3990 },
  //     "Pusa White Sella A": { "5 KG": 665, "10 KG": 1330, "30 KG": 3990 },
  //     "Pusa Steam A": { "5 KG": 635, "10 KG": 1270, "30 KG": 3810 },
  //     "Pusa Steam A+": { "5 KG": 595, "10 KG": 1190, "30 KG": 3570 }
  //   },
  //   highlights: [
  //     "Strong natural aroma",
  //     "Grain length: 7.5 – 7.8 mm",
  //     "Max 2% broken grains",
  //     "Authentic basmati variety",
  //   ],
  //   specifications: {
  //     Moisture: "Max 12%",
  //     Broken: "Max 2%",
  //     Purity: "94%+",
  //     Origin: "India",
  //     Packaging: "5kg, 10kg, 25kg, 50kg bags",
  //     ShelfLife: "12 Months",
  //     Color: "Natural White",
  //     GrainLength: "7.5 – 7.8 mm",
  //     Aroma: "Strong Natural",

  //     HSN: "10063020",
  //     Brand: "SIEA"
  //   }
  // },
  // {
  //   id: generateId('1718 Basmati Rice'),
  //   cat: 'rice',
  //   icon: '🌾',
  //   name: '1718 Basmati Rice',
  //   images: [riceImg, spicesImg, seedsImg, textileImg, herbalImg, condimentsImg],
  //   description: "High-yield Basmati rice variety with excellent grain length (7.9-8.2mm). Known for its natural aroma and superior cooking quality, ideal for bulk food service.",
  //   grades: ["1718 White Sella A+", "1718 White Sella A", "1718 Golden Sella A+", "1718 Golden Sella A", "1718 Steam A+", "1718 Steam A"],
  //   quantities: ["5 KG", "10 KG", "30 KG"],
  //   price: {
  //     "1718 White Sella A+": { "5 KG": 605, "10 KG": 1210, "30 KG": 3630 },
  //     "1718 White Sella A": { "5 KG": 470, "10 KG": 940, "30 KG": 2820 },
  //     "1718 Golden Sella A+": { "5 KG": 635, "10 KG": 1270, "30 KG": 3810 },
  //     "1718 Golden Sella A": { "5 KG": 635, "10 KG": 1270, "30 KG": 3810 },
  //     "1718 Steam A+": { "5 KG": 735, "10 KG": 1470, "30 KG": 4410 },
  //     "1718 Steam A": { "5 KG": 585, "10 KG": 1170, "30 KG": 3510 }
  //   },
  //   highlights: [
  //     "Long grain (7.9 – 8.2 mm)",
  //     "Natural aroma",
  //     "Max 2% broken grains",
  //     "High yielding variety",
  //   ],
  //   specifications: {
  //     Moisture: "Max 12%",
  //     Broken: "Max 2%",
  //     Purity: "94%+",
  //     Origin: "India",
  //     Packaging: "5kg, 10kg, 25kg, 50kg bags",
  //     ShelfLife: "12 Months",
  //     Color: "Natural White",
  //     GrainLength: "7.9 – 8.2 mm",
  //     Aroma: "Natural",

  //     HSN: "10063020",
  //     Brand: "SIEA"
  //   }
  // },
  // {
  //   id: generateId('Sugandha Non-Basmati Rice'),
  //   cat: 'rice',
  //   icon: '🌾',
  //   name: 'Sugandha (Non-Basmati)',
  //   images: [riceImg, spicesImg, seedsImg, textileImg, herbalImg, condimentsImg],
  //   description: "Aromatic non-Basmati rice with mild fragrance and excellent cooking quality. A great value option for daily consumption with a pleasant aroma.",
  //   grades: ["Sugandha Creamy Parboiled", "Sugandha Golden", "Sugandha Steam", "Sugandha Sella"],
  //   quantities: ["5 KG", "10 KG", "30 KG"],
  //   price: {
  //     "Sugandha Creamy Parboiled": { "5 KG": 540, "10 KG": 1080, "30 KG": 3240 },
  //     "Sugandha Golden": { "5 KG": 530, "10 KG": 1060, "30 KG": 3180 },
  //     "Sugandha Steam": { "5 KG": 555, "10 KG": 1110, "30 KG": 3330 },
  //     "Sugandha Sella": { "5 KG": 465, "10 KG": 930, "30 KG": 2790 }
  //   },
  //   highlights: [
  //     "Mild aromatic rice",
  //     "6.8 – 7.2 mm grain length",
  //     "Max 3% broken grains",
  //     "Great for daily cooking",
  //   ],
  //   specifications: {
  //     Moisture: "Max 14%",
  //     Broken: "Max 3%",
  //     Purity: "92%+",
  //     Origin: "India",
  //     Packaging: "5kg, 10kg, 25kg, 50kg bags",
  //     ShelfLife: "12 Months",
  //     Color: "Natural White",
  //     GrainLength: "6.8 – 7.2 mm",
  //     Aroma: "Mild Aromatic",

  //     HSN: "10063090",
  //     Brand: "SIEA"
  //   }
  // },
  // {
  //   id: generateId('Sharbati Non-Basmati Rice'),
  //   cat: 'rice',
  //   icon: '🌾',
  //   name: 'Sharbati (Non-Basmati)',
  //   images: [riceImg, spicesImg, seedsImg, textileImg, herbalImg, condimentsImg],
  //   description: "Sweet and flavorful non-Basmati rice with a mild sweet aroma. Known for its excellent taste and texture, perfect for everyday meals and festive occasions.",
  //   grades: ["Sharbati Creamy Parboiled", "Sharbati Golden", "Sharbati Steam", "Sharbati Sella"],
  //   quantities: ["5 KG", "10 KG", "30 KG"],
  //   price: {
  //     "Sharbati Creamy Parboiled": { "5 KG": 505, "10 KG": 1010, "30 KG": 3030 },
  //     "Sharbati Golden": { "5 KG": 750, "10 KG": 1500, "30 KG": 4500 },
  //     "Sharbati Steam": { "5 KG": 650, "10 KG": 1300, "30 KG": 3900 },
  //     "Sharbati Sella": { "5 KG": 525, "10 KG": 1050, "30 KG": 3150 }
  //   },
  //   highlights: [
  //     "Mild sweet aroma",
  //     "Grain length: 7.0 – 7.4 mm",
  //     "Max 3% broken grains",
  //     "Sweet and flavorful taste",
  //   ],
  //   specifications: {
  //     Moisture: "Max 14%",
  //     Broken: "Max 3%",
  //     Purity: "92%+",
  //     Origin: "India",
  //     Packaging: "5kg, 10kg, 25kg, 50kg bags",
  //     ShelfLife: "12 Months",
  //     Color: "Natural White",
  //     GrainLength: "7.0 – 7.4 mm",
  //     Aroma: "Mild Sweet",

  //     HSN: "10063090",
  //     Brand: "SIEA"
  //   }
  // },
  // {
  //   id: generateId('PR-11-14 Non-Basmati Rice'),
  //   cat: 'rice',
  //   icon: '🌾',
  //   name: 'PR-11/14 (Non-Basmati)',
  //   images: [riceImg, spicesImg, seedsImg, textileImg, herbalImg, condimentsImg],
  //   description: "Premium non-Basmati rice variety with neutral aroma and consistent grain quality. Ideal for bulk food service, restaurants, and daily family meals.",
  //   grades: ["PR-11/14 Creamy Parboiled", "PR-11/14 Golden", "PR-11/14 Steam", "PR-11/14 Sella"],
  //   quantities: ["5 KG", "10 KG", "30 KG"],
  //   price: {
  //     "PR-11/14 Creamy Parboiled": { "5 KG": 745, "10 KG": 1490, "30 KG": 4470 },
  //     "PR-11/14 Golden": { "5 KG": 700, "10 KG": 1400, "30 KG": 4200 },
  //     "PR-11/14 Steam": { "5 KG": 695, "10 KG": 1390, "30 KG": 4170 },
  //     "PR-11/14 Sella": { "5 KG": 535, "10 KG": 1070, "30 KG": 3210 }
  //   },
  //   highlights: [
  //     "Neutral aroma",
  //     "Grain length: 6.5 – 6.9 mm",
  //     "Max 3% broken grains",
  //     "Excellent for daily cooking",
  //   ],
  //   specifications: {
  //     Moisture: "Max 14%",
  //     Broken: "Max 3%",
  //     Purity: "92%+",
  //     Origin: "India",
  //     Packaging: "5kg, 10kg, 25kg, 50kg bags",
  //     ShelfLife: "12 Months",
  //     Color: "Natural White",
  //     GrainLength: "6.5 – 6.9 mm",
  //     Aroma: "Neutral",

  //     HSN: "10063090",
  //     Brand: "SIEA"
  //   }
  // },
  // {
  //   id: generateId('PR-06-47 Non-Basmati Rice'),
  //   cat: 'rice',
  //   icon: '🌾',
  //   name: 'PR-06/47 (Non-Basmati)',
  //   images: [riceImg, spicesImg, seedsImg, textileImg, herbalImg, condimentsImg],
  //   description: "Durable non-Basmati rice variety known for its robust grains and consistent cooking results. Perfect for daily use in households and restaurants.",
  //   grades: ["PR-06/47 Creamy Parboiled", "PR-06/47 Golden", "PR-06/47 Steam", "PR-06/47 Sella"],
  //   quantities: ["5 KG", "10 KG", "30 KG"],
  //   price: {
  //     "PR-06/47 Creamy Parboiled": { "5 KG": 740, "10 KG": 1480, "30 KG": 4440 },
  //     "PR-06/47 Golden": { "5 KG": 600, "10 KG": 1200, "30 KG": 3600 },
  //     "PR-06/47 Steam": { "5 KG": 510, "10 KG": 1020, "30 KG": 3060 },
  //     "PR-06/47 Sella": { "5 KG": 635, "10 KG": 1270, "30 KG": 3810 }
  //   },
  //   highlights: [
  //     "Neutral aroma",
  //     "Grain length: 6.4 – 6.8 mm",
  //     "Max 3% broken grains",
  //     "Durable and robust grains",
  //   ],
  //   specifications: {
  //     Moisture: "Max 14%",
  //     Broken: "Max 3%",
  //     Purity: "92%+",
  //     Origin: "India",
  //     Packaging: "5kg, 10kg, 25kg, 50kg bags",
  //     ShelfLife: "12 Months",
  //     Color: "Natural White",
  //     GrainLength: "6.4 – 6.8 mm",
  //     Aroma: "Neutral",

  //     HSN: "10063090",
  //     Brand: "SIEA"
  //   }
  // },
  // {
  //   id: generateId('RH-10 Non-Basmati Rice'),
  //   cat: 'rice',
  //   icon: '🌾',
  //   name: 'RH-10 (Non-Basmati)',
  //   images: [riceImg, spicesImg, seedsImg, textileImg, herbalImg, condimentsImg],
  //   description: "Robust non-Basmati rice variety with mild aroma and excellent grain integrity. Ideal for bulk cooking, catering, and food service operations.",
  //   grades: ["Creamy Parboiled", "RH-10 Golden", "RH-10 Steam", "RH-10 Sella"],
  //   quantities: ["5 KG", "10 KG", "30 KG"],
  //   price: {
  //     "Creamy Parboiled": { "5 KG": 590, "10 KG": 1180, "30 KG": 3540 },
  //     "RH-10 Golden": { "5 KG": 665, "10 KG": 1330, "30 KG": 3990 },
  //     "RH-10 Steam": { "5 KG": 625, "10 KG": 1250, "30 KG": 3750 },
  //     "RH-10 Sella": { "5 KG": 625, "10 KG": 1250, "30 KG": 3750 }
  //   },
  //   highlights: [
  //     "Mild aroma",
  //     "Grain length: 6.7 – 7.1 mm",
  //     "Max 3% broken grains",
  //     "Robust grain quality",
  //   ],
  //   specifications: {
  //     Moisture: "Max 14%",
  //     Broken: "Max 3%",
  //     Purity: "92%+",
  //     Origin: "India",
  //     Packaging: "5kg, 10kg, 25kg, 50kg bags",
  //     ShelfLife: "12 Months",
  //     Color: "Natural White",
  //     GrainLength: "6.7 – 7.1 mm",
  //     Aroma: "Mild",

  //     HSN: "10063090",
  //     Brand: "SIEA"
  //   }
  // },
  {
    id: generateId('Sona Masoori Non-Basmati Rice'),
    cat: 'rice',
    icon: '🌾',
    name: 'Sona Masoori (Non-Basmati)',
    banner: ricesonamasooribanner,
    images: [ricesonaImg1, ricesonaImg2, ricesonaImg3, ricesonaImg4],
    description: "Light and fluffy non-Basmati rice, popular in South Indian cuisine. Known for its light texture and excellent taste, perfect for daily meals, idli, and dosa.",
    grades: ["Sona Masoori Steam", "Sona Masoori Sella", "Sona Masoori Creamy Parboiled", "Sona Masoori Golden"],
    quantities: ["5 KG", "10 KG", "30 KG"],
    price: {
      "Sona Masoori Steam": { "5 KG": 670, "10 KG": 1340, "30 KG": 4020 },
      "Sona Masoori Sella": { "5 KG": 570, "10 KG": 1140, "30 KG": 3420 },
      "Sona Masoori Creamy Parboiled": { "5 KG": 580, "10 KG": 1160, "30 KG": 3480 },
      "Sona Masoori Golden": { "5 KG": 535, "10 KG": 1070, "30 KG": 3210 }
    },
    highlights: [
      "Light aroma",
      "Short grain: 5.2 – 5.5 mm",
      "Max 3% broken grains",
      "Light and fluffy texture",
    ],
    specifications: {
      Moisture: "Max 14%",
      Broken: "Max 3%",
      Purity: "92%+",
      Origin: "India",
      Packaging: "5kg, 10kg, 25kg, 50kg bags",
      ShelfLife: "12 Months",
      Color: "Natural White",
      GrainLength: "5.2 – 5.5 mm",
      Aroma: "Light",

      HSN: "10063090",
      Brand: "SIEA"
    }
  },
  {
    id: generateId('IR-64 Non-Basmati Rice'),
    cat: 'rice',
    icon: '🌾',
    name: 'IR-64 Non-Basmati Rice',
    banner: riceIR64banner,
    images: [riceIR64Img1, riceIR64Img2, riceIR64Img3, riceIR64Img4], // use existing imports or create new ones
    description: "High-yielding medium-grain non-Basmati rice variety. Popular for daily cooking in households and bulk food service due to its neutral aroma, excellent cooking properties, and affordable price point.",
    grades: ["IR-64 Steam", "IR-64 Parboiled", "IR-64 Raw", "IR-64 Sella"],
    quantities: ["5 KG", "10 KG", "25 KG", "50 KG"],
    price: {
      "IR-64 Steam": { "5 KG": 220, "10 KG": 420, "25 KG": 1000, "50 KG": 1950 },
      "IR-64 Parboiled": { "5 KG": 240, "10 KG": 460, "25 KG": 1100, "50 KG": 2150 },
      "IR-64 Raw": { "5 KG": 200, "10 KG": 380, "25 KG": 900, "50 KG": 1750 },
      "IR-54 Sella": { "5 KG": 230, "10 KG": 440, "25 KG": 1050, "50 KG": 2050 }
    },
    highlights: [
      "Medium grain rice (6.0 - 6.5 mm)",
      "Neutral aroma",
      "Max 5% broken grains (export quality)",
      "High yield variety",
      "Excellent for daily cooking",
      "Affordable bulk pricing"
    ],
    specifications: {
      Moisture: "Max 14%",
      Broken: "Max 5% (Premium: 1-2%)",
      Purity: "92%+",
      Origin: "India",
      Packaging: "5kg, 10kg, 25kg, 50kg, 100kg bags",
      ShelfLife: "12 Months",
      Color: "Natural White",
      GrainLength: "6.0 – 6.5 mm",
      GrainType: "Medium Grain",
      Aroma: "Neutral",
      Usage: "Daily Cooking, Bulk Food Service",
      HSN: "10063090",
      Brand: "SIEA"
    },
    reviews: [
      {
        name: "Siva Kumar",
        rating: 4,
        comment: "Good quality for daily use. Value for money.",
        date: "2026-04-25"
      },
      {
        name: "Ramesh Babu",
        rating: 5,
        comment: "Consistent quality. Perfect for our hostel mess.",
        date: "2026-04-20"
      }
    ]
  },
  // {
  //   id: generateId('Long Grain Non-Basmati Rice'),
  //   cat: 'rice',
  //   icon: '🌾',
  //   name: 'Long Grain (Non-Basmati)',
  //   images: [riceImg, spicesImg, seedsImg, textileImg, herbalImg, condimentsImg],
  //   description: "Long-grain non-Basmati rice with neutral aroma and excellent cooking properties. A versatile rice variety suitable for a wide range of culinary applications.",
  //   grades: ["Long Grain Parboiled", "Long Grain Creamy Parboiled", "Long Grain Sella", "Long Grain Golden", "Long Grain Steam"],
  //   quantities: ["5 KG", "10 KG", "30 KG"],
  //   price: {
  //     "Long Grain Parboiled": { "5 KG": 505, "10 KG": 1010, "30 KG": 3030 },
  //     "Long Grain Creamy Parboiled": { "5 KG": 630, "10 KG": 1260, "30 KG": 3780 },
  //     "Long Grain Sella": { "5 KG": 535, "10 KG": 1070, "30 KG": 3210 },
  //     "Long Grain Golden": { "5 KG": 600, "10 KG": 1200, "30 KG": 3600 },
  //     "Long Grain Steam": { "5 KG": 515, "10 KG": 1030, "30 KG": 3090 }
  //   },
  //   highlights: [
  //     "Neutral aroma",
  //     "Long grain: 6.8 – 7.3 mm",
  //     "Max 3% broken grains",
  //     "Versatile cooking applications",
  //   ],
  //   specifications: {
  //     Moisture: "Max 14%",
  //     Broken: "Max 3%",
  //     Purity: "92%+",
  //     Origin: "India",
  //     Packaging: "5kg, 10kg, 25kg, 50kg bags",
  //     ShelfLife: "12 Months",
  //     Color: "Natural White",
  //     GrainLength: "6.8 – 7.3 mm",
  //     Aroma: "Neutral",

  //     HSN: "10063090",
  //     Brand: "SIEA"
  //   }
  // },
  // {
  //   id: generateId('IR-8 Non-Basmati Rice'),
  //   cat: 'rice',
  //   icon: '🌾',
  //   name: 'IR-8 (Non-Basmati)',
  //   images: [riceImg, spicesImg, seedsImg, textileImg, herbalImg, condimentsImg],
  //   description: "High-yielding rice variety with neutral aroma and good grain integrity. A reliable choice for bulk food production and daily consumption.",
  //   grades: ["IR-8 Parboiled", "IR-8 Creamy Parboiled", "IR-8 Sella", "IR-8 Golden", "IR-8 Steam"],
  //   quantities: ["5 KG", "10 KG", "30 KG"],
  //   price: {
  //     "IR-8 Parboiled": { "5 KG": 655, "10 KG": 1310, "30 KG": 3930 },
  //     "IR-8 Creamy Parboiled": { "5 KG": 665, "10 KG": 1330, "30 KG": 3990 },
  //     "IR-8 Sella": { "5 KG": 560, "10 KG": 1120, "30 KG": 3360 },
  //     "IR-8 Golden": { "5 KG": 560, "10 KG": 1120, "30 KG": 3360 },
  //     "IR-8 Steam": { "5 KG": 560, "10 KG": 1120, "30 KG": 3360 }
  //   },
  //   highlights: [
  //     "Neutral aroma",
  //     "Grain length: 6.2 – 6.6 mm",
  //     "Max 3% broken grains",
  //     "High yielding variety",
  //   ],
  //   specifications: {
  //     Moisture: "Max 14%",
  //     Broken: "Max 3%",
  //     Purity: "92%+",
  //     Origin: "India",
  //     Packaging: "5kg, 10kg, 25kg, 50kg bags",
  //     ShelfLife: "12 Months",
  //     Color: "Natural White",
  //     GrainLength: "6.2 – 6.6 mm",
  //     Aroma: "Neutral",

  //     HSN: "10063090",
  //     Brand: "SIEA"
  //   }
  // },
  // {
  //   id: generateId('GR-11 Non-Basmati Rice'),
  //   cat: 'rice',
  //   icon: '🌾',
  //   name: 'GR-11 (Non-Basmati)',
  //   images: [riceImg, spicesImg, seedsImg, textileImg, herbalImg, condimentsImg],
  //   description: "Durable and tasty non-Basmati rice variety with consistent grain quality. Perfect for everyday meals and food service operations.",
  //   grades: ["GR-11 Creamy Parboiled", "GR-11 Parboiled", "GR-11 Sella", "GR-11 Steam", "GR-11 Golden"],
  //   quantities: ["5 KG", "10 KG", "30 KG"],
  //   price: {
  //     "GR-11 Creamy Parboiled": { "5 KG": 605, "10 KG": 1210, "30 KG": 3630 },
  //     "GR-11 Parboiled": { "5 KG": 605, "10 KG": 1210, "30 KG": 3630 },
  //     "GR-11 Sella": { "5 KG": 605, "10 KG": 1210, "30 KG": 3630 },
  //     "GR-11 Steam": { "5 KG": 605, "10 KG": 1210, "30 KG": 3630 },
  //     "GR-11 Golden": { "5 KG": 605, "10 KG": 1210, "30 KG": 3630 }
  //   },
  //   highlights: [
  //     "Neutral aroma",
  //     "Grain length: 6.0 – 6.4 mm",
  //     "Max 3% broken grains",
  //     "Consistent cooking quality",
  //   ],
  //   specifications: {
  //     Moisture: "Max 14%",
  //     Broken: "Max 3%",
  //     Purity: "92%+",
  //     Origin: "India",
  //     Packaging: "5kg, 10kg, 25kg, 50kg bags",
  //     ShelfLife: "12 Months",
  //     Color: "Natural White",
  //     GrainLength: "6.0 – 6.4 mm",
  //     Aroma: "Neutral",

  //     HSN: "10063090",
  //     Brand: "SIEA"
  //   }
  // },
  // {
  //   id: generateId('Swarna Non-Basmati Rice'),
  //   cat: 'rice',
  //   icon: '🌾',
  //   name: 'Swarna (Non-Basmati)',
  //   images: [riceImg, spicesImg, seedsImg, textileImg, herbalImg, condimentsImg],
  //   description: "Popular non-Basmati rice variety known for its excellent cooking properties and neutral aroma. Widely used in households and restaurants across India.",
  //   grades: ["Swarna Steam", "Swarna Sella", "Swarna Creamy Parboiled", "Swarna Parboiled", "Swarna Golden"],
  //   quantities: ["5 KG", "10 KG", "30 KG"],
  //   price: {
  //     "Swarna Steam": { "5 KG": 700, "10 KG": 1400, "30 KG": 4200 },
  //     "Swarna Sella": { "5 KG": 595, "10 KG": 1190, "30 KG": 3570 },
  //     "Swarna Creamy Parboiled": { "5 KG": 680, "10 KG": 1360, "30 KG": 4080 },
  //     "Swarna Parboiled": { "5 KG": 690, "10 KG": 1380, "30 KG": 4140 },
  //     "Swarna Golden": { "5 KG": 730, "10 KG": 1460, "30 KG": 4380 }
  //   },
  //   highlights: [
  //     "Neutral aroma",
  //     "Grain length: 5.8 – 6.2 mm",
  //     "Max 3% broken grains",
  //     "Popular everyday rice",
  //   ],
  //   specifications: {
  //     Moisture: "Max 14%",
  //     Broken: "Max 3%",
  //     Purity: "92%+",
  //     Origin: "India",
  //     Packaging: "5kg, 10kg, 25kg, 50kg bags",
  //     ShelfLife: "12 Months",
  //     Color: "Natural White",
  //     GrainLength: "5.8 – 6.2 mm",
  //     Aroma: "Neutral",

  //     HSN: "10063090",
  //     Brand: "SIEA"
  //   }
  // },
  // {
  //   id: generateId('Kalizeera Non-Basmati Rice'),
  //   cat: 'rice',
  //   icon: '🌾',
  //   name: 'Kalizeera (Non-Basmati)',
  //   images: [riceImg, spicesImg, seedsImg, textileImg, herbalImg, condimentsImg],
  //   description: "Aromatic short-grain rice known as 'Indian Jasmine Rice'. Features a strong natural aroma and small, flavorful grains, perfect for special dishes and festive meals.",
  //   grades: ["Kalizeera Steam", "Kalizeera Golden", "Kalizeera Creamy Parboiled", "Kalizeera Parboiled", "Kalizeera Sella"],
  //   quantities: ["5 KG", "10 KG", "30 KG"],
  //   price: {
  //     "Kalizeera Steam": { "5 KG": 685, "10 KG": 1370, "30 KG": 4110 },
  //     "Kalizeera Golden": { "5 KG": 670, "10 KG": 1340, "30 KG": 4020 },
  //     "Kalizeera Creamy Parboiled": { "5 KG": 450, "10 KG": 900, "30 KG": 2700 },
  //     "Kalizeera Parboiled": { "5 KG": 450, "10 KG": 900, "30 KG": 2700 },
  //     "Kalizeera Sella": { "5 KG": 450, "10 KG": 900, "30 KG": 2700 }
  //   },
  //   highlights: [
  //     "Strong aromatic rice",
  //     "Cumin seed-like grains",
  //     "Grain length: 3.8 – 4.2 mm",
  //     "Max 3% broken grains",
  //     "Indian Jasmine variety",
  //   ],
  //   specifications: {
  //     Moisture: "Max 14%",
  //     Broken: "Max 3%",
  //     Purity: "92%+",
  //     Origin: "India",
  //     Packaging: "1kg, 5kg, 10kg bags",
  //     ShelfLife: "12 Months",
  //     Color: "Natural White",
  //     GrainLength: "3.8 – 4.2 mm",
  //     Aroma: "Strong Aromatic",

  //     HSN: "10063090",
  //     Brand: "SIEA"
  //   }
  // },
  // {
  //   id: generateId('Ponni Rice Non-Basmati'),
  //   cat: 'rice',
  //   icon: '🌾',
  //   name: 'Ponni Rice (Non-Basmati)',
  //   images: [riceImg, spicesImg, seedsImg, textileImg, herbalImg, condimentsImg],
  //   description: "Soft and tasty non-Basmati rice, popular in South Indian cuisine. Known for its soft texture and mild flavor, perfect for daily meals, especially in Tamil Nadu and Kerala.",
  //   grades: ["Ponni Rice Steam", "Ponni Rice Sella", "Ponni Rice Golden", "Ponni Rice Creamy Parboiled", "Ponni Rice Parboiled"],
  //   quantities: ["5 KG", "10 KG", "30 KG"],
  //   price: {
  //     "Ponni Rice Steam": { "5 KG": 550, "10 KG": 1100, "30 KG": 3300 },
  //     "Ponni Rice Sella": { "5 KG": 560, "10 KG": 1120, "30 KG": 3360 },
  //     "Ponni Rice Golden": { "5 KG": 490, "10 KG": 980, "30 KG": 2940 },
  //     "Ponni Rice Creamy Parboiled": { "5 KG": 470, "10 KG": 940, "30 KG": 2820 },
  //     "Ponni Rice Parboiled": { "5 KG": 500, "10 KG": 1000, "30 KG": 3000 }
  //   },
  //   highlights: [
  //     "Mild aroma",
  //     "Grain length: 5.5 – 5.9 mm",
  //     "Max 3% broken grains",
  //     "Soft and tasty texture",
  //     "Popular in South India",
  //   ],
  //   specifications: {
  //     Moisture: "Max 14%",
  //     Broken: "Max 3%",
  //     Purity: "92%+",
  //     Origin: "India",
  //     Packaging: "5kg, 10kg, 25kg, 50kg bags",
  //     ShelfLife: "12 Months",
  //     Color: "Natural White",
  //     GrainLength: "5.5 – 5.9 mm",
  //     Aroma: "Mild",

  //     HSN: "10063090",
  //     Brand: "SIEA"
  //   }
  // },
  // ✅ SPICES
  // { id: generateId('Chilli Powder'), cat: 'spices', icon: '🌶️', name: 'Chilli Powder' },
  // { id: generateId('Turmeric Powder'), cat: 'spices', icon: '🌿', name: 'Turmeric Powder' },
  // { id: generateId('Cumin Seeds'), cat: 'spices', icon: '🌱', name: 'Cumin Seeds' },
  // { id: generateId('Garam Masala'), cat: 'spices', icon: '🫙', name: 'Garam Masala' },

  // ✅ SEEDS
  // { id: generateId('Natural Sesame Seeds'), cat: 'seeds', icon: '🌱', name: 'Natural Sesame Seeds' },
  // { id: generateId('Hulled Sesame Seeds'), cat: 'seeds', icon: '🌱', name: 'Hulled Sesame Seeds' },
  // { id: generateId('Fenugreek Seeds'), cat: 'seeds', icon: '🟤', name: 'Fenugreek Seeds' },
  // { id: generateId('Peanuts'), cat: 'seeds', icon: '🥜', name: 'Peanuts' },

  // ✅ OILS
  // { id: generateId('Mustard Oil'), cat: 'oils', icon: '🫙', name: 'Mustard Oil' },
  // { id: generateId('Ghee'), cat: 'oils', icon: '🧈', name: 'Ghee' },
  // { id: generateId('Honey'), cat: 'oils', icon: '🍯', name: 'Honey' },
  // { id: generateId('Coconut Oil'), cat: 'oils', icon: '🥥', name: 'Coconut Oil' },

  // ✅ HERBAL
  // { id: generateId('Ashwagandha'), cat: 'herbal', icon: '🌿', name: 'Ashwagandha' },
  // { id: generateId('Isabgol'), cat: 'herbal', icon: '🍃', name: 'Isabgol' },
  // { id: generateId('Safed Musli'), cat: 'herbal', icon: '🌿', name: 'Safed Musli' },
  // { id: generateId('Mehendi Powder'), cat: 'herbal', icon: '🌿', name: 'Mehendi Powder' },

  // ✅ PROCESSED
  {
    id: generateId('Soltuna Tuna Products'),
    cat: 'processed',
    icon: '🥫',
    name: 'Soltuna Premium Tuna',
    banner: tunaBanner,

    description: "Premium quality canned tuna sourced from sustainable fisheries. Rich in protein, omega-3 fatty acids, and perfect for healthy meals, salads, sandwiches, and ready-to-eat dishes.",

    // ❌ REMOVE grades, quantities, price
    // ✅ ADD variants

    variants: [
      {
        name: "Chunk YF in Soy Oil",
        image: tunaImg10,
        images: [tunaImg10],
        options: [
          { size: "160g", packing: ["24 ezo", "48 ezo"] }
        ]
      },
      {
        name: "Chunk YF in Spring Water",
        image: tunaImg5,
        images: [tunaImg5],
        options: [
          { size: "160g", packing: ["24 ezo", "48 ezo"] }
        ]
      },
      {
        name: "Chilli Chunk YF in Soy Oil",
        image: tunaImg1,
        images: [tunaImg1],
        options: [
          { size: "160g", packing: ["24 ezo", "48 ezo"] },
          { size: "100g", packing: ["12 ezo", "48 ezo"] }
        ]
      },
      {
        name: "Chunk YF in Olive Oil",
        image: tunaImg2,
        images: [tunaImg2],
        options: [
          { size: "160g", packing: ["24 ezo", "48 ezo"] }
        ]
      },
      {
        name: "Chunk YF in Lemon & Pepper",
        image: tunaImg3,
        images: [tunaImg3],
        options: [
          { size: "160g", packing: ["24 ezo"] }
        ]
      },
      {
        name: "Chunk SJ in Lemon & Pepper",
        image: tunaImg6,
        images: [tunaImg6],
        options: [
          { size: "160g", packing: ["48 ezo"] }
        ]
      },
      {
        name: "Spicy YF Tuna Delight",
        image: tunaImg9,
        images: [tunaImg9],
        options: [
          { size: "160g", packing: ["24 ezo"] }
        ]
      },
      {
        name: "Chunk Skipjack in Soy Oil",
        image: tunaImg4,
        images: [tunaImg4],
        options: [
          { size: "160g", packing: ["24 ezo", "48 ezo"] }
        ]
      },
      {
        name: "Chunk SJ in Spring Water",
        image: tunaImg7,
        images: [tunaImg7],
        options: [
          { size: "160g", packing: ["24 ezo", "48 ezo"] },
          { size: "100g", packing: ["12 ezo", "48 ezo"] }
        ]
      },
      {
        name: "Chunk SJ in Olive Oil",
        image: tunaImg8,
        images: [tunaImg8],
        options: [
          { size: "100g", packing: ["12 ezo", "48 ezo"] }
        ]
      },
      {
        name: "Tuna in Vegetable oil",
        image: tunaImg11,
        images: [tunaImg11],
        options: [
          { size: "160g", packing: ["24 ezo", "48 ezo"] }
        ]
      }
    ],

    highlights: [
      "High protein & omega-3 rich",
      "Ready-to-eat convenience food",
      "Sustainably sourced tuna",
      "Multiple flavors available",
      "Long shelf life",
      "Ideal for salads, sandwiches & meals"
    ],

    specifications: {
      Protein: "High (20g+ per 100g)",
      ShelfLife: "24 Months",
      Packaging: "Tin cans (100g, 160g, 250g, 400g)",
      Origin: "Solomon Islands",
      Preservation: "Sealed in oil / water",
      Quality: "Export Grade",
      Certification: "MSC Certified",
      Brand: "SOLTUNA"
    },

    reviews: [
      {
        name: "Rahul",
        rating: 5,
        comment: "Very tasty and fresh. Perfect for quick meals!",
        date: "2026-04-22"
      },
      {
        name: "Anjali",
        rating: 4,
        comment: "Good quality tuna with nice flavor options.",
        date: "2026-04-19"
      }
    ]
  },
  {
    id: generateId('Solomon Blue Original Tuna'),
    cat: 'processed',
    icon: '🥫',
    name: 'Solomon Blue Original Tuna',
    banner: solomonBanner,

    description: "High-quality canned tuna from Solomon Islands, packed in soy oil with multiple variants like chunks, flakes, and curry flavors. Ideal for sandwiches, ready meals, and export-grade supply.",

    variants: [

      // 🔹 100 x 48
      {
        name: "Special Chunk in Soy Oil",
        image: solomonImg1,
        images: [solomonImg1],
        options: [
          { size: "100g", packing: ["48 ezo"] },
          { size: "160g", packing: ["24 ezo", "48 ezo"] }
        ]
      },
      {
        name: "Sandwich Flakes YF in Soy Oil",
        image: solomonImg2,
        images: [solomonImg2],
        options: [
          { size: "100g", packing: ["48 ezo"] },
          { size: "160g", packing: ["24 ezo", "48 ezo"] }
        ]
      },
      {
        name: "White Flakes Tuna in Soy Oil",
        image: solomonImg3,
        images: [solomonImg3],
        options: [
          { size: "100g", packing: ["48 ezo"] },
          { size: "160g", packing: ["24 ezo", "48 ezo"] },
          { size: "250g", packing: ["36 ezo"] },
          { size: "400g", packing: ["24 ezo"] }
        ]
      },
      {
        name: "Red Flake Tuna in Soy Oil",
        image: solomonImg4,
        images: [solomonImg4],
        options: [
          { size: "100g", packing: ["48 ezo"] },
          { size: "160g", packing: ["24 ezo", "48 ezo"] },
          { size: "400g", packing: ["24 ezo"] }
        ]
      },
      {
        name: "Curry Flakes SJ in Soy Oil",
        image: solomonImg5,
        images: [solomonImg5],
        options: [
          { size: "160g", packing: ["24 ezo", "48 ezo"] }
        ]
      },

    ],

    highlights: [
      "High protein seafood product",
      "Multiple variants (chunk, flakes, curry)",
      "Export quality tuna",
      "Ready-to-eat convenience",
      "Packed in soy oil for rich taste",
      "Suitable for bulk supply & retail"
    ],

    specifications: {
      Protein: "High (20g+ per 100g)",
      ShelfLife: "24 Months",
      Packaging: "Tin cans (100g, 160g, 250g, 400g)",
      Origin: "Solomon Islands",
      Preservation: "Soy Oil",
      Quality: "Export Grade",
      Certification: "Food Safety Certified",
      Brand: "Solomon Blue Original"
    },

    reviews: [
      {
        name: "Praveen",
        rating: 5,
        comment: "Good quality tuna, perfect for sandwiches and bulk supply.",
        date: "2026-05-05"
      },
      {
        name: "Kiran",
        rating: 4,
        comment: "Nice variety and good taste in curry flakes.",
        date: "2026-05-03"
      }
    ]
  },
  // ✅ CONSTRUCTION
  // { id: generateId('Cement'), cat: 'construction', icon: '🏗️', name: 'Cement' },
  // { id: generateId('Bricks'), cat: 'construction', icon: '🧱', name: 'Bricks' },
  // { id: generateId('TMT Bars'), cat: 'construction', icon: '🔩', name: 'TMT Bars' },
  // { id: generateId('Marble'), cat: 'construction', icon: '🪨', name: 'Marble' },

  // ✅ TEXTILE
  // { id: generateId('Cotton Clothes'), cat: 'textile', icon: '👗', name: 'Cotton Clothes' },
  // { id: generateId('Bath Towels'), cat: 'textile', icon: '🧖', name: 'Bath Towels' },
  // { id: generateId('Napkins'), cat: 'textile', icon: '🧻', name: 'Napkins' },

  // ✅ INDUSTRIAL
  // { id: generateId('Batteries'), cat: 'industrial', icon: '🔋', name: 'Batteries' },
  // { id: generateId('Motor Pumps'), cat: 'industrial', icon: '⚙️', name: 'Motor Pumps' },
  // { id: generateId('Submersible Pumps'), cat: 'industrial', icon: '💧', name: 'Submersible Pumps' }
];
export const categories = [
  { id: 'rice', label: '🌾 Rice & Grains', image: riceImg },
  // { id: 'spices', label: '🌶️ Spices', image: spicesImg },
  // { id: 'condiments', label: '🫙 Condiments', image: condimentsImg },
  // { id: 'seeds', label: '🌱 Seeds & Nuts', image: seedsImg },
  // { id: 'oils', label: '🫙 Oils & Dairy', image: oilsImg },
  // { id: 'herbal', label: '🌿 Herbal & Ayurvedic', image: herbalImg },
  { id: 'processed', label: '🍫 Processed Foods', image: processedImg },
  // { id: 'construction', label: '🏗️ Construction', image: constructionImg },
  // { id: 'textile', label: '👗 Textiles', image: textileImg },
  // { id: 'industrial', label: '⚡ Industrial', image: industrialImg }
];

export const whyChooseData = [
  { icon: '🚀', title: 'Fast & Reliable Logistics', desc: 'Multi-modal shipping with real-time tracking, customs clearance support, and door-step delivery across 40+ countries.', bg: 'rgba(45,106,79,0.2)', border: '#2D6A4F' },
  { icon: '📋', title: 'End-to-End Documentation', desc: 'We handle all export paperwork: phytosanitary certificates, COO, bill of lading, insurance, and LC documentation.', bg: 'rgba(200,151,43,0.2)', border: '#C8972B' },
  { icon: '🔬', title: 'Quality Control Labs', desc: 'In-house testing for purity, moisture, adulteration, and microbiological parameters. Third-party SGS/GeoChem support.', bg: 'rgba(82,183,136,0.2)', border: '#52B788' },
  { icon: '💎', title: 'Competitive B2B Pricing', desc: 'Direct farm & factory sourcing eliminates middlemen. Get the best FOB/CIF rates with flexible payment terms.', bg: 'rgba(200,151,43,0.2)', border: '#E8B84B' },
  { icon: '🌿', title: 'Sustainable Sourcing', desc: 'Ethically sourced agricultural products with traceability. Supporting fair trade and eco-friendly packaging.', bg: 'rgba(45,106,79,0.2)', border: '#2D6A4F' },
  { icon: '🤝', title: 'Dedicated Account Managers', desc: '24/7 dedicated trade expert for every client — from first inquiry to repeat orders, we’re your growth partner.', bg: 'rgba(200,151,43,0.2)', border: '#C8972B' }
];

export const testimonials = [
  { name: 'Rajesh Kumar', role: 'Wholesale Distributor, Delhi', text: 'Goeazy Mart has been our trusted supplier for over 3 years. Consistent quality on rice and spices, and their logistics team is excellent.', avatar: '🏪', color: '#1DB954' },
  { name: 'Priya Sundaram', role: 'F&B Procurement, Chennai', text: 'We source all our oils and grains from Goeazy Mart. The quality is top-notch and they always deliver on time, even for large orders.', avatar: '🍽️', color: '#1A73E8' },
  { name: 'Mohammed Al-Rashid', role: 'Import Business, Dubai', text: 'Excellent export quality products. Goeazy Mart helped us establish a regular supply of basmati rice and spices for the Gulf market.', avatar: '🌍', color: '#FF6B2B' },
  { name: 'Anjali Mehta', role: 'Retail Chain Owner, Mumbai', text: 'From herbal products to packaged snacks, everything is reliably sourced. Their B2B portal makes reordering super simple.', avatar: '🛒', color: '#E91E8C' },
  { name: 'Venkat Reddy', role: 'Manufacturing Unit, Hyderabad', text: 'Industrial packaging materials and electrical supplies at competitive B2B rates. Goeazy Mart is our one-stop wholesale partner.', avatar: '🏭', color: '#FFB800' },
  { name: 'Sarah Thompson', role: 'Ayurvedic Brand, Bangalore', text: 'High-quality herbal powders with consistent quality certificates. Moringa and ashwagandha bulk orders always delivered as promised.', avatar: '🌿', color: '#1DB954' }
];

export const countriesData = [
  { name: "India", lat: 20.5937, lng: 78.9629, flag: "🇮🇳", region: "South Asia" },
  { name: "UAE", lat: 23.4241, lng: 53.8478, flag: "🇦🇪", region: "Middle East" },
  { name: "Saudi Arabia", lat: 23.8859, lng: 45.0792, flag: "🇸🇦", region: "Middle East" },
  { name: "Oman", lat: 21.4735, lng: 55.9754, flag: "🇴🇲", region: "Middle East" },
  { name: "Qatar", lat: 25.3548, lng: 51.1839, flag: "🇶🇦", region: "Middle East" },
  { name: "Kuwait", lat: 29.3117, lng: 47.4818, flag: "🇰🇼", region: "Middle East" },
  { name: "Bangladesh", lat: 23.6850, lng: 90.3563, flag: "🇧🇩", region: "South Asia" },
  { name: "Sri Lanka", lat: 7.8731, lng: 80.7718, flag: "🇱🇰", region: "South Asia" },
  { name: "Malaysia", lat: 4.2105, lng: 101.9758, flag: "🇲🇾", region: "Southeast Asia" },
  { name: "Indonesia", lat: -0.7893, lng: 113.9213, flag: "🇮🇩", region: "Southeast Asia" },
  { name: "Vietnam", lat: 14.0583, lng: 108.2772, flag: "🇻🇳", region: "Southeast Asia" },
  { name: "Philippines", lat: 12.8797, lng: 121.7740, flag: "🇵🇭", region: "Southeast Asia" },
  { name: "Thailand", lat: 15.8700, lng: 100.9925, flag: "🇹🇭", region: "Southeast Asia" },
  { name: "Singapore", lat: 1.3521, lng: 103.8198, flag: "🇸🇬", region: "Southeast Asia" },
  { name: "Kenya", lat: -1.2864, lng: 36.8172, flag: "🇰🇪", region: "Africa" },
  { name: "Tanzania", lat: -6.3690, lng: 34.8888, flag: "🇹🇿", region: "Africa" },
  { name: "Egypt", lat: 26.8206, lng: 30.8025, flag: "🇪🇬", region: "Africa" },
  { name: "Nigeria", lat: 9.0820, lng: 8.6753, flag: "🇳🇬", region: "Africa" },
  { name: "South Africa", lat: -30.5595, lng: 22.9375, flag: "🇿🇦", region: "Africa" },
  { name: "United Kingdom", lat: 51.5074, lng: -0.1278, flag: "🇬🇧", region: "Europe" },
  { name: "Germany", lat: 51.1657, lng: 10.4515, flag: "🇩🇪", region: "Europe" },
  { name: "Netherlands", lat: 52.1326, lng: 5.2913, flag: "🇳🇱", region: "Europe" },
  { name: "France", lat: 46.2276, lng: 2.2137, flag: "🇫🇷", region: "Europe" },
  { name: "Italy", lat: 41.8719, lng: 12.5674, flag: "🇮🇹", region: "Europe" },
  { name: "Spain", lat: 40.4637, lng: -3.7492, flag: "🇪🇸", region: "Europe" },
  { name: "USA", lat: 37.0902, lng: -95.7129, flag: "🇺🇸", region: "North America" },
  { name: "Canada", lat: 56.1304, lng: -106.3468, flag: "🇨🇦", region: "North America" },
  { name: "Mexico", lat: 23.6345, lng: -102.5528, flag: "🇲🇽", region: "North America" },
  { name: "Brazil", lat: -14.2350, lng: -51.9253, flag: "🇧🇷", region: "South America" },
  { name: "Australia", lat: -25.2744, lng: 133.7751, flag: "🇦🇺", region: "Oceania" },
  { name: "Nepal", lat: 28.3949, lng: 84.1240, flag: "🇳🇵", region: "South Asia" },
  { name: "Maldives", lat: 3.2028, lng: 73.2207, flag: "🇲🇻", region: "South Asia" },
  { name: "Turkey", lat: 38.9637, lng: 35.2433, flag: "🇹🇷", region: "Middle East" },
  { name: "Jordan", lat: 30.5852, lng: 36.2384, flag: "🇯🇴", region: "Middle East" },
  { name: "Ethiopia", lat: 9.1450, lng: 40.4897, flag: "🇪🇹", region: "Africa" },
  { name: "Uganda", lat: 1.3733, lng: 32.2903, flag: "🇺🇬", region: "Africa" },
  { name: "Ghana", lat: 7.9465, lng: -1.0232, flag: "🇬🇭", region: "Africa" },
  { name: "Mauritius", lat: -20.3484, lng: 57.5522, flag: "🇲🇺", region: "Africa" },
  { name: "Pakistan", lat: 30.3753, lng: 69.3451, flag: "🇵🇰", region: "South Asia" }
];

export const tradeRoutes = [
  [[20.5937, 78.9629], [23.4241, 53.8478]],
  [[20.5937, 78.9629], [23.8859, 45.0792]],
  [[20.5937, 78.9629], [23.6850, 90.3563]],
  [[20.5937, 78.9629], [7.8731, 80.7718]],
  [[20.5937, 78.9629], [4.2105, 101.9758]],
  [[20.5937, 78.9629], [-0.7893, 113.9213]],
  [[20.5937, 78.9629], [14.0583, 108.2772]],
  [[20.5937, 78.9629], [15.8700, 100.9925]],
  [[23.4241, 53.8478], [26.8206, 30.8025]],
  [[26.8206, 30.8025], [-1.2864, 36.8172]],
  [[-1.2864, 36.8172], [-6.3690, 34.8888]],
  [[20.5937, 78.9629], [51.5074, -0.1278]],
  [[51.5074, -0.1278], [51.1657, 10.4515]],
  [[51.1657, 10.4515], [52.1326, 5.2913]],
  [[20.5937, 78.9629], [37.0902, -95.7129]],
  [[37.0902, -95.7129], [56.1304, -106.3468]],
  [[20.5937, 78.9629], [-14.2350, -51.9253]],
  [[20.5937, 78.9629], [-25.2744, 133.7751]],
  [[20.5937, 78.9629], [28.3949, 84.1240]],
  [[23.4241, 53.8478], [38.9637, 35.2433]]
];