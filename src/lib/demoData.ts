// src/lib/demoData.ts
export const demoProducts = [
  // Rice & Grains
  {
    id: "1",
    name: "Basmati Rice Premium",
    description:
      "High-quality aged basmati rice with long grains and aromatic fragrance. Perfect for biryanis and pulao.",
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
      "Organic brown rice rich in fiber and nutrients. Healthy choice for daily meals.",
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
    name: "Wheat Flour (Atta)",
    description:
      "Fresh stone-ground wheat flour perfect for making rotis, chapatis and bread.",
    price: 65,
    weight: 1.0,
    category: "Rice & Grains",
    images: ["/images/products/wheat-flour.jpg"],
    stock: 40,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },

  // Oils
  {
    id: "4",
    name: "Sunflower Oil",
    description:
      "Pure sunflower oil for healthy cooking. Light taste and high smoking point.",
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
    id: "5",
    name: "Coconut Oil Cold Pressed",
    description:
      "Pure cold-pressed coconut oil. Great for cooking and hair care.",
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
    id: "6",
    name: "Mustard Oil",
    description:
      "Traditional mustard oil with strong flavor. Perfect for Bengali and North Indian cuisine.",
    price: 160,
    weight: 1.0,
    category: "Oils",
    images: ["/images/products/mustard-oil.jpg"],
    stock: 15,
    isEligibleForFreeDelivery: false,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },

  // Pulses & Lentils
  {
    id: "7",
    name: "Toor Dal (Arhar)",
    description:
      "High-quality toor dal, rich in protein. Essential for daily meals.",
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
    id: "8",
    name: "Moong Dal",
    description: "Premium quality moong dal. Easy to digest and nutritious.",
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
    id: "9",
    name: "Chana Dal",
    description:
      "Split chickpeas dal with rich flavor and high protein content.",
    price: 110,
    weight: 1.0,
    category: "Pulses & Lentils",
    images: ["/images/products/chana-dal.jpg"],
    stock: 25,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },

  // Spices & Herbs
  {
    id: "10",
    name: "Turmeric Powder",
    description:
      "Pure turmeric powder with natural color and aroma. Essential spice for Indian cooking.",
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
    id: "11",
    name: "Red Chili Powder",
    description:
      "Spicy red chili powder made from finest red chilies. Adds heat and color to dishes.",
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
    id: "12",
    name: "Garam Masala",
    description:
      "Authentic blend of aromatic spices. Perfect for enhancing flavor of curries and biryanis.",
    price: 120,
    weight: 0.1,
    category: "Spices & Herbs",
    images: ["/images/products/garam-masala.jpg"],
    stock: 35,
    isEligibleForFreeDelivery: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },

  // Sugar & Sweeteners
  {
    id: "13",
    name: "White Sugar",
    description:
      "Pure white crystal sugar for daily use. Perfect for tea, coffee and cooking.",
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
    id: "14",
    name: "Jaggery (Gur)",
    description:
      "Natural jaggery made from sugarcane. Healthy alternative to white sugar.",
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
    id: "15",
    name: "Brown Sugar",
    description:
      "Unrefined brown sugar with natural molasses. Great for baking and beverages.",
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
    id: "16",
    name: "Full Cream Milk Powder",
    description:
      "Premium quality milk powder with rich taste. Perfect for tea, coffee and cooking.",
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
    id: "17",
    name: "Paneer (Fresh)",
    description:
      "Fresh homemade paneer. Rich in protein and perfect for curries.",
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
    id: "18",
    name: "Ghee (Clarified Butter)",
    description:
      "Pure cow ghee with rich aroma and taste. Essential for Indian cooking.",
    price: 450,
    weight: 0.5,
    category: "Dairy Products",
    images: ["/images/products/ghee.jpg"],
    stock: 12,
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

// Mock API functions for demo
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
              new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime() * order
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
};
