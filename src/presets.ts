import { PresetMeal } from "./types";

export const PRESET_MEALS: PresetMeal[] = [
  {
    id: "avocado_toast",
    name: "Avocado Toast",
    calories: 380,
    protein: 12,
    carbs: 18,
    fats: 32,
    image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=400",
    description: "Multi-grain crust topped with mashed fresh avocado, organic greens, organic seeds, and cherry tomatoes.",
    ingredients: ["Fresh Hass Avocado", "Mixed Salad Greens", "Cherry Tomatoes", "Extra Virgin Olive Oil", "Pumpkin Seeds"]
  },
  {
    id: "chicken_rice",
    name: "Grilled Chicken & Jasmine Brown Rice",
    calories: 540,
    protein: 46,
    carbs: 58,
    fats: 10,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400",
    description: "Lean high-protein grilled organic chicken breast coupled with tender brown jasmine rice and steamed leafy broccoli.",
    ingredients: ["Marinated Chicken Breast", "Steamed Jasmine Rice", "Sautéed Fresh Broccoli Florets", "Olive Oil"]
  },
  {
    id: "berry_pancakes",
    name: "Double Berry Protein Pancakes",
    calories: 460,
    protein: 18,
    carbs: 70,
    fats: 12,
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&q=80&w=400",
    description: "Grated flour oats mixed with whey isolate, stacked high with ripe mountain blueberries and sweet organic maple sauce.",
    ingredients: ["Rolled Oats", "Whey Protein Isolate", "Fresh Blueberries", "Organic Maple Syrup", "Bananas"]
  },
  {
    id: "sourdough_pizza",
    name: "Gourmet Pepperoni Pizza Slice",
    calories: 440,
    protein: 18,
    carbs: 54,
    fats: 16,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400",
    description: "Airy, baked sourdough topped with rich tomato emulsion, creamy buffalo mozzarella, and dry cured pepperoni slices.",
    ingredients: ["Sourdough Base Crust", "Vine-ripened Tomato Sauce", "Part-Skim Mozzarella", "Dry-Cured Pepperoni"]
  },
  {
    id: "sushi_platter",
    name: "Premium Rainbow Sushi Platter",
    calories: 395,
    protein: 24,
    carbs: 62,
    fats: 6,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=400",
    description: "Authentic seaweed wraps with seasoned vinegary rice, fresh sashimi tuna, premium salmon fillet, and creamy avocado.",
    ingredients: ["Sashimi Salmon", "Ahi Tuna", "Sushi Rice", "Ripe Hass Avocado", "Crispy Nori Wraps"]
  }
];
