import { create } from "zustand";

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  reviews?: number;
  category?: string;
  category_name?: string;
  original_price?: number;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
}

const getInitialWishlist = (): WishlistItem[] => {
  const stored = localStorage.getItem("wishlist");
  return stored ? JSON.parse(stored) : [];
};

export const useWishlist = create<WishlistStore>((set) => ({
  items: getInitialWishlist(),
  addItem: (item) =>
    set((state) => {
      if (state.items.some((i) => i.id === item.id)) return state;
      const updated = [...state.items, item];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return { items: updated };
    }),
  removeItem: (id) =>
    set((state) => {
      const updated = state.items.filter((i) => i.id !== id);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return { items: updated };
    }),
}));
