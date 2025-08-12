import { useWishlist } from "@/store/wishlist";
import { ProductCard } from "@/components/product-card";

const Wishlist = () => {
  const { items } = useWishlist();

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>

      {items.length === 0 ? (
        <div className="text-center text-gray-500">Your wishlist is empty.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
