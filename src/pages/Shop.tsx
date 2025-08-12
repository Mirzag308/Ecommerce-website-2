// Shop.tsx 
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ProductCard } from "@/components/product-card";
import axios from "axios";
import { BASE_URL } from "@/App";

const Shop = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);

  const brands = ["Nike", "Adidas", "Apple", "Samsung", "Sony", "Microsoft"];

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);

  // ✅ Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = category
          ? `${BASE_URL}/api/products/products/?category=${category}`
          : `${BASE_URL}/api/products/products/`;

        const res = await axios.get(url);
        const fetchedProducts = Array.isArray(res.data) ? res.data : res.data.results || [];
        setProducts(fetchedProducts);
        setFiltered(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [category]);

  // ✅ Apply filters and sorting
  useEffect(() => {
    let data = [...products];

    // 🔍 Search filter
    if (searchQuery) {
      data = data.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // 💰 Price range filter
    data = data.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // 🏷 Brand filter
    if (selectedBrands.length > 0) {
      data = data.filter((p) => selectedBrands.includes(p.brand));
    }

    // 🔽 Sorting
    if (sortBy === "newest") {
      data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === "price-low") {
      data.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      data.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFiltered(data);
  }, [searchQuery, priceRange, selectedBrands, sortBy, products]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Price Filter */}
      <div>
        <h3 className="font-semibold mb-2">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={1000}
          step={10}
          className="mb-2"
        />
        <p>${priceRange[0]} - ${priceRange[1]}</p>
      </div>

      {/* Brand Filter */}
      <div>
        <h3 className="font-semibold mb-2">Brands</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <span>{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : "All Products"}
        </h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters */}
        {/* <div className="hidden lg:block w-64 flex-shrink-0">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Filter className="h-5 w-5" />
              </div>
              <FilterSidebar />
            </CardContent>
          </Card>
        </div> */}

        {/* Main Content */}
        <div className="flex-1">
          {/* Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">
                {filtered.length} products
              </Badge>

              {/* Mobile Filter */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Best Rating</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className={`grid gap-6 ${viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
            : "grid-cols-1"
            }`}>
            {Array.isArray(filtered) && filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
