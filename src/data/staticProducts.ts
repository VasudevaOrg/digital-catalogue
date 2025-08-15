// src/data/staticProducts.ts
import { Product } from "@/types";

export const staticProducts: Product[] = [
  // Rice & Grains
  {
    id: "1",
    name: "Basmati Rice Premium Quality",
    description:
      "High-quality aged basmati rice with long grains and aromatic fragrance. Perfect for biryanis and pulao.",
    price: 180,
    weight: 1.0,
    category: "Rice & Grains",
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop",
    ],
    stock: 50,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Brown Rice Organic",
    description:
      "Certified organic brown rice rich in fiber and nutrients. Healthy choice for daily meals.",
    price: 120,
    weight: 1.0,
    category: "Rice & Grains",
    images: [
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=500&h=500&fit=crop",
    ],
    stock: 30,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Wheat Flour (Atta)",
    description:
      "Fresh stone-ground wheat flour perfect for making rotis, chapatis and bread.",
    price: 65,
    weight: 1.0,
    category: "Rice & Grains",
    images: [
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=500&fit=crop",
    ],
    stock: 40,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Sona Masoori Rice",
    description:
      "Premium quality Sona Masoori rice, lightweight and aromatic. Perfect for everyday meals.",
    price: 95,
    weight: 1.0,
    category: "Rice & Grains",
    images: [
      "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=500&h=500&fit=crop",
    ],
    stock: 35,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },

  // Oils
  {
    id: "5",
    name: "Sunflower Oil Pure",
    description:
      "Pure sunflower oil for healthy cooking. Light taste and high smoking point.",
    price: 145,
    weight: 1.0,
    category: "Oils",
    images: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=500&fit=crop",
    ],
    stock: 25,
    isEligibleForFreeDelivery: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "6",
    name: "Coconut Oil Cold Pressed",
    description:
      "Pure cold-pressed coconut oil extracted without heat. Great for cooking and skin care.",
    price: 280,
    weight: 0.5,
    category: "Oils",
    images: [
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500&h=500&fit=crop",
    ],
    stock: 20,
    isEligibleForFreeDelivery: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "7",
    name: "Mustard Oil Traditional",
    description:
      "Traditional mustard oil with strong flavor. Perfect for Bengali and North Indian cuisine.",
    price: 160,
    weight: 1.0,
    category: "Oils",
    images: [
      "https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?w=500&h=500&fit=crop",
    ],
    stock: 15,
    isEligibleForFreeDelivery: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "8",
    name: "Groundnut Oil Filtered",
    description:
      "Pure filtered groundnut oil with natural flavor. High smoking point perfect for deep frying.",
    price: 155,
    weight: 1.0,
    category: "Oils",
    images: [
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&h=500&fit=crop",
    ],
    stock: 18,
    isEligibleForFreeDelivery: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },

  // Pulses & Lentils
  {
    id: "9",
    name: "Toor Dal (Arhar) Premium",
    description:
      "High-quality toor dal, rich in protein and essential nutrients. Perfect for sambar and dal.",
    price: 140,
    weight: 1.0,
    category: "Pulses & Lentils",
    images: [
      "https://images.unsplash.com/photo-1613843596852-4e665804b357?w=500&h=500&fit=crop",
    ],
    stock: 35,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "10",
    name: "Moong Dal Green",
    description:
      "Premium quality moong dal. Easy to digest, nutritious, perfect for soups and curries.",
    price: 120,
    weight: 1.0,
    category: "Pulses & Lentils",
    images: [
      "https://images.unsplash.com/photo-1609501676775-e8a5b2d2f8f5?w=500&h=500&fit=crop",
    ],
    stock: 30,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "11",
    name: "Chana Dal Split",
    description:
      "Premium split chickpeas dal with rich flavor and high protein content.",
    price: 110,
    weight: 1.0,
    category: "Pulses & Lentils",
    images: [
      "https://images.unsplash.com/photo-1638913659197-46040471de1d?w=500&h=500&fit=crop",
    ],
    stock: 25,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "12",
    name: "Urad Dal Black",
    description:
      "Whole black urad dal with skin. Rich in protein and fiber. Essential for idli and dosa.",
    price: 130,
    weight: 1.0,
    category: "Pulses & Lentils",
    images: [
      "https://images.unsplash.com/photo-1623066463831-3f7f6762734d?w=500&h=500&fit=crop",
    ],
    stock: 22,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },

  // Spices & Herbs
  {
    id: "13",
    name: "Turmeric Powder Pure",
    description:
      "Pure turmeric powder with natural color and aroma. Essential spice for Indian cooking.",
    price: 85,
    weight: 0.2,
    category: "Spices & Herbs",
    images: [
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&h=500&fit=crop",
    ],
    stock: 50,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "14",
    name: "Red Chili Powder Hot",
    description:
      "Spicy red chili powder made from finest red chilies. Adds heat and vibrant color.",
    price: 95,
    weight: 0.2,
    category: "Spices & Herbs",
    images: [
      "https://images.unsplash.com/photo-1599909533684-27dff4555e50?w=500&h=500&fit=crop",
    ],
    stock: 40,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "15",
    name: "Garam Masala Blend",
    description:
      "Authentic blend of aromatic spices including cardamom, cinnamon, cloves.",
    price: 120,
    weight: 0.1,
    category: "Spices & Herbs",
    images: [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&h=500&fit=crop",
    ],
    stock: 35,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "16",
    name: "Coriander Powder Fresh",
    description:
      "Freshly ground coriander powder with natural aroma. Essential spice for Indian cuisine.",
    price: 75,
    weight: 0.2,
    category: "Spices & Herbs",
    images: [
      "https://images.unsplash.com/photo-1607672632458-9eb56696346b?w=500&h=500&fit=crop",
    ],
    stock: 45,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },

  // Sugar & Sweeteners
  {
    id: "17",
    name: "White Sugar Crystal",
    description:
      "Pure white crystal sugar for daily use. Perfect for tea, coffee, and baking.",
    price: 45,
    weight: 1.0,
    category: "Sugar & Sweeteners",
    images: [
      "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500&h=500&fit=crop",
    ],
    stock: 60,
    isEligibleForFreeDelivery: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "18",
    name: "Jaggery (Gur) Natural",
    description:
      "Natural jaggery made from sugarcane. Healthy alternative to white sugar.",
    price: 75,
    weight: 1.0,
    category: "Sugar & Sweeteners",
    images: [
      "https://images.unsplash.com/photo-1599887203283-3cf9d88efaaa?w=500&h=500&fit=crop",
    ],
    stock: 25,
    isEligibleForFreeDelivery: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "19",
    name: "Brown Sugar Unrefined",
    description:
      "Unrefined brown sugar with natural molasses. Great for baking and desserts.",
    price: 80,
    weight: 0.5,
    category: "Sugar & Sweeteners",
    images: [
      "https://images.unsplash.com/photo-1581268223775-4d8055103d84?w=500&h=500&fit=crop",
    ],
    stock: 20,
    isEligibleForFreeDelivery: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },

  // Dairy Products
  {
    id: "20",
    name: "Full Cream Milk Powder",
    description:
      "Premium quality full cream milk powder with rich taste. Long shelf life.",
    price: 320,
    weight: 1.0,
    category: "Dairy Products",
    images: [
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&h=500&fit=crop",
    ],
    stock: 15,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "21",
    name: "Paneer Fresh",
    description:
      "Fresh paneer made from pure milk. Rich in protein, perfect for curries and snacks.",
    price: 240,
    weight: 0.5,
    category: "Dairy Products",
    images: [
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&h=500&fit=crop",
    ],
    stock: 10,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "22",
    name: "Ghee Pure Cow",
    description:
      "Pure cow ghee with rich aroma and taste. Essential for Indian cooking.",
    price: 450,
    weight: 0.5,
    category: "Dairy Products",
    images: [
      "https://images.unsplash.com/photo-1589985270245-d59b4844220f?w=500&h=500&fit=crop",
    ],
    stock: 12,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "23",
    name: "Cumin Seeds Whole",
    description:
      "Whole cumin seeds with strong aroma. Essential for tempering and spice blends.",
    price: 180,
    weight: 0.2,
    category: "Spices & Herbs",
    images: [
      "https://images.unsplash.com/photo-1607672632458-9eb56696346b?w=500&h=500&fit=crop",
    ],
    stock: 30,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "24",
    name: "Masoor Dal Red",
    description:
      "Red masoor dal, quick cooking and nutritious. High in protein and fiber.",
    price: 100,
    weight: 1.0,
    category: "Pulses & Lentils",
    images: [
      "https://images.unsplash.com/photo-1609501676775-e8a5b2d2f8f5?w=500&h=500&fit=crop",
    ],
    stock: 28,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

export const staticCategories = [
  "Rice & Grains",
  "Oils",
  "Pulses & Lentils",
  "Spices & Herbs",
  "Sugar & Sweeteners",
  "Dairy Products",
];
