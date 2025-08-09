// src/lib/demoData.ts
export const demoProducts = [
  // Rice & Grains
  {
    id: "1",
    name: "Basmati Rice Premium Quality",
    description:
      "High-quality aged basmati rice with long grains and aromatic fragrance. Perfect for biryanis and pulao. Sourced from the finest farms.",
    price: 180,
    weight: 1.0,
    category: "Rice & Grains",
    images: ["/images/products/basmati-rice.jpg"],
    stock: 50,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Brown Rice Organic",
    description:
      "Certified organic brown rice rich in fiber and nutrients. Healthy choice for daily meals. Unpolished and naturally processed.",
    price: 120,
    weight: 1.0,
    category: "Rice & Grains",
    images: ["/images/products/brown-rice.jpg"],
    stock: 30,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Wheat Flour (Atta) Fresh Ground",
    description:
      "Fresh stone-ground wheat flour perfect for making rotis, chapatis and bread. Made from premium quality wheat grains.",
    price: 65,
    weight: 1.0,
    category: "Rice & Grains",
    images: ["/images/products/wheat-flour.jpg"],
    stock: 40,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Sona Masoori Rice",
    description:
      "Premium quality Sona Masoori rice, lightweight and aromatic. Perfect for everyday meals and South Indian dishes.",
    price: 95,
    weight: 1.0,
    category: "Rice & Grains",
    images: ["/images/products/sona-masoori.jpg"],
    stock: 35,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },

  // Oils (Not eligible for free delivery as per requirements)
  {
    id: "5",
    name: "Sunflower Oil Pure",
    description:
      "Pure sunflower oil for healthy cooking. Light taste and high smoking point. Ideal for all types of cooking and frying.",
    price: 145,
    weight: 1.0,
    category: "Oils",
    images: ["/images/products/sunflower-oil.jpg"],
    stock: 25,
    isEligibleForFreeDelivery: false, // As per requirements
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "6",
    name: "Coconut Oil Cold Pressed",
    description:
      "Pure cold-pressed coconut oil extracted without heat. Great for cooking, hair care, and skin care. 100% natural.",
    price: 280,
    weight: 0.5,
    category: "Oils",
    images: ["/images/products/coconut-oil.jpg"],
    stock: 20,
    isEligibleForFreeDelivery: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "7",
    name: "Mustard Oil Traditional",
    description:
      "Traditional mustard oil with strong flavor. Perfect for Bengali and North Indian cuisine. Adds authentic taste to your dishes.",
    price: 160,
    weight: 1.0,
    category: "Oils",
    images: ["/images/products/mustard-oil.jpg"],
    stock: 15,
    isEligibleForFreeDelivery: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "8",
    name: "Groundnut Oil Filtered",
    description:
      "Pure filtered groundnut oil with natural flavor. High smoking point makes it perfect for deep frying and cooking.",
    price: 155,
    weight: 1.0,
    category: "Oils",
    images: ["/images/products/groundnut-oil.jpg"],
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
      "High-quality toor dal, rich in protein and essential nutrients. Essential for daily meals and perfect for sambar and dal preparations.",
    price: 140,
    weight: 1.0,
    category: "Pulses & Lentils",
    images: ["/images/products/toor-dal.jpg"],
    stock: 35,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "10",
    name: "Moong Dal Green",
    description:
      "Premium quality moong dal. Easy to digest, nutritious, and perfect for soups, curries, and traditional sweets.",
    price: 120,
    weight: 1.0,
    category: "Pulses & Lentils",
    images: ["/images/products/moong-dal.jpg"],
    stock: 30,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "11",
    name: "Chana Dal Split",
    description:
      "Premium split chickpeas dal with rich flavor and high protein content. Perfect for making dal, snacks, and traditional dishes.",
    price: 110,
    weight: 1.0,
    category: "Pulses & Lentils",
    images: ["/images/products/chana-dal.jpg"],
    stock: 25,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "12",
    name: "Urad Dal Black",
    description:
      "Whole black urad dal with skin. Rich in protein and fiber. Essential for making idli, dosa, and traditional North Indian dishes.",
    price: 130,
    weight: 1.0,
    category: "Pulses & Lentils",
    images: ["/images/products/urad-dal.jpg"],
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
      "Pure turmeric powder with natural color and aroma. Essential spice for Indian cooking with anti-inflammatory properties.",
    price: 85,
    weight: 0.2,
    category: "Spices & Herbs",
    images: ["/images/products/turmeric-powder.jpg"],
    stock: 50,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "14",
    name: "Red Chili Powder Hot",
    description:
      "Spicy red chili powder made from finest red chilies. Adds heat and vibrant color to your dishes. Perfect spice level.",
    price: 95,
    weight: 0.2,
    category: "Spices & Herbs",
    images: ["/images/products/chili-powder.jpg"],
    stock: 40,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "15",
    name: "Garam Masala Blend",
    description:
      "Authentic blend of aromatic spices including cardamom, cinnamon, cloves. Perfect for enhancing flavor of curries and biryanis.",
    price: 120,
    weight: 0.1,
    category: "Spices & Herbs",
    images: ["/images/products/garam-masala.jpg"],
    stock: 35,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "16",
    name: "Coriander Powder Fresh",
    description:
      "Freshly ground coriander powder with natural aroma. Essential spice for Indian cuisine. Adds mild flavor and beautiful color.",
    price: 75,
    weight: 0.2,
    category: "Spices & Herbs",
    images: ["/images/products/coriander-powder.jpg"],
    stock: 45,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },

  // Sugar & Sweeteners (Not eligible for free delivery as per requirements)
  {
    id: "17",
    name: "White Sugar Crystal",
    description:
      "Pure white crystal sugar for daily use. Perfect for tea, coffee, cooking, and baking. Premium quality refined sugar.",
    price: 45,
    weight: 1.0,
    category: "Sugar & Sweeteners",
    images: ["/images/products/white-sugar.jpg"],
    stock: 60,
    isEligibleForFreeDelivery: false, // As per requirements
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "18",
    name: "Jaggery (Gur) Natural",
    description:
      "Natural jaggery made from sugarcane. Healthy alternative to white sugar. Rich in minerals and natural sweetness.",
    price: 75,
    weight: 1.0,
    category: "Sugar & Sweeteners",
    images: ["/images/products/jaggery.jpg"],
    stock: 25,
    isEligibleForFreeDelivery: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "19",
    name: "Brown Sugar Unrefined",
    description:
      "Unrefined brown sugar with natural molasses. Great for baking, beverages, and desserts. Natural sweetness with rich flavor.",
    price: 80,
    weight: 0.5,
    category: "Sugar & Sweeteners",
    images: ["/images/products/brown-sugar.jpg"],
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
      "Premium quality full cream milk powder with rich taste. Perfect for tea, coffee, cooking, and baking. Long shelf life.",
    price: 320,
    weight: 1.0,
    category: "Dairy Products",
    images: ["/images/products/milk-powder.jpg"],
    stock: 15,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "21",
    name: "Paneer Fresh Homemade",
    description:
      "Fresh homemade paneer made from pure milk. Rich in protein and perfect for curries, snacks, and sweets. Daily fresh preparation.",
    price: 240,
    weight: 0.5,
    category: "Dairy Products",
    images: ["/images/products/paneer.jpg"],
    stock: 10,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "22",
    name: "Ghee Pure Cow",
    description:
      "Pure cow ghee with rich aroma and taste. Essential for Indian cooking, religious ceremonies, and Ayurvedic preparations.",
    price: 450,
    weight: 0.5,
    category: "Dairy Products",
    images: ["/images/products/ghee.jpg"],
    stock: 12,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },

  // Additional Products for variety
  {
    id: "23",
    name: "Cumin Seeds Whole",
    description:
      "Whole cumin seeds with strong aroma and flavor. Essential for tempering and spice blends. Adds authentic taste to Indian dishes.",
    price: 180,
    weight: 0.2,
    category: "Spices & Herbs",
    images: ["/images/products/cumin-seeds.jpg"],
    stock: 30,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "24",
    name: "Masoor Dal Red",
    description:
      "Red masoor dal, quick cooking and nutritious. High in protein and fiber. Perfect for daily meals and soups.",
    price: 100,
    weight: 1.0,
    category: "Pulses & Lentils",
    images: ["/images/products/masoor-dal.jpg"],
    stock: 28,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

export const demoCategories = [
  "Rice & Grains",
  "Oils",
  "Pulses & Lentils",
  "Spices & Herbs",
  "Sugar & Sweeteners",
  "Dairy Products",
];

// Mock API functions for demo with enhanced filtering
export const mockProductAPI = {
  getProducts: (filters?: any) => {
    let filteredProducts = [...demoProducts];

    if (filters?.category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === filters.category
      );
    }

    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    if (filters?.priceRange) {
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
      );
    }

    // Sort products
    if (filters?.sortBy) {
      filteredProducts.sort((a, b) => {
        const order = filters.sortOrder === "desc" ? -1 : 1;

        switch (filters.sortBy) {
          case "price":
            return (a.price - b.price) * order;
          case "name":
            return a.name.localeCompare(b.name) * order;
          case "newest":
            return (
              (new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()) *
              order
            );
          default:
            return 0;
        }
      });
    }

    return Promise.resolve({
      data: filteredProducts,
      pagination: {
        page: 1,
        limit: filteredProducts.length,
        total: filteredProducts.length,
        totalPages: 1,
      },
    });
  },

  getProductById: (id: string) => {
    const product = demoProducts.find((p) => p.id === id);
    return Promise.resolve(product);
  },

  getCategories: () => {
    return Promise.resolve(demoCategories);
  },

  getFeaturedProducts: (limit: number = 8) => {
    // Return high-stock, popular items as featured
    const featured = demoProducts
      .filter((p) => p.stock > 20)
      .sort((a, b) => b.stock - a.stock)
      .slice(0, limit);

    return Promise.resolve(featured);
  },

  getProductsByCategory: (category: string) => {
    const products = demoProducts.filter((p) => p.category === category);
    return Promise.resolve(products);
  },
};
