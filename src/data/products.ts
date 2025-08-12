import { Product } from "@/components/product-card"

export const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 89.99,
    originalPrice: 129.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    category: "Electronics",
    rating: 4.5,
    reviews: 124,
    inStock: true,
    badge: "Sale"
  },
  {
    id: "2",
    name: "Stylish Leather Jacket",
    price: 199.99,
    originalPrice: 299.99,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
    category: "Fashion",
    rating: 4.8,
    reviews: 89,
    inStock: true,
    badge: "Hot"
  },
  {
    id: "3",
    name: "Smart Fitness Watch",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    category: "Electronics",
    rating: 4.7,
    reviews: 156,
    inStock: true,
    badge: "New"
  },
  {
    id: "4",
    name: "Comfortable Running Shoes",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    category: "Sports",
    rating: 4.6,
    reviews: 203,
    inStock: true,
    badge: "Sale"
  },
  {
    id: "5",
    name: "Designer Sunglasses",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    category: "Accessories",
    rating: 4.4,
    reviews: 67,
    inStock: true
  },
  {
    id: "6",
    name: "Luxury Handbag",
    price: 299.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop",
    category: "Fashion",
    rating: 4.9,
    reviews: 45,
    inStock: false
  },
  {
    id: "7",
    name: "Gaming Mechanical Keyboard",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop",
    category: "Electronics",
    rating: 4.8,
    reviews: 312,
    inStock: true,
    badge: "Hot"
  },
  {
    id: "8",
    name: "Premium Coffee Maker",
    price: 189.99,
    originalPrice: 249.99,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop",
    category: "Home",
    rating: 4.7,
    reviews: 98,
    inStock: true,
    badge: "Sale"
  }
]

export const categories = [
  {
    id: "men",
    name: "Men's Fashion",
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=500&h=500&fit=crop",
    href: "/category/men",
    productCount: 245
  },
  {
    id: "women",
    name: "Women's Fashion",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&h=500&fit=crop",
    href: "/category/women",
    productCount: 312
  },
  {
    id: "electronics",
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=500&fit=crop",
    href: "/category/electronics",
    productCount: 189
  },
  {
    id: "home",
    name: "Home & Garden",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
    href: "/category/home",
    productCount: 156
  },
  {
    id: "sports",
    name: "Sports",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop",
    href: "/category/sports",
    productCount: 98
  },
  {
    id: "beauty",
    name: "Beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop",
    href: "/category/beauty",
    productCount: 134
  }
]