// src/pages/ProductPage.tsx
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Heart, Share2, Star, Plus, Minus, ShoppingCart, Truck, Shield, RotateCcw} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authAxios } from "@/lib/axios"
import { useCart } from "@/store/cart"
import { toast } from "@/hooks/use-toast"

const ProductPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCart()
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await authAxios.get(`/products/${id}/`);
        setProduct(response.data)
      } catch (err) {
        setError("Failed to fetch product.")
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>
  if (!product) return <p>No product found.</p>

  const sizes = ["XS", "S", "M", "L", "XL"]
  // const colors = ["Black", "White", 'Golden' , "Navy", "Gray", "Red"]
  // const [selectedColor, setSelectedColor] = useState("")
  const colorImages = product.color_images || {}
  const availableColors = Object.keys(colorImages)
  const currentImages = selectedColor && colorImages[selectedColor] ? colorImages[selectedColor] : [product.image]


  const handleColorChange = (color: string) => {
    setSelectedColor(color)

    // If API returns variants, you can fetch that color's image
    // For now, we assume additional_images map colors to images
    const colorImage = (product.color_images && product.color_images[color]) || product.image
    setSelectedImageIndex(0) // Reset slider
    setProduct((prev: any) => ({
      ...prev,
      image: colorImage
    }))
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
      // quantity:
    })
    toast({ title: "Added to cart", description: `${product.name} has been added.` })
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} has been ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={currentImages[selectedImageIndex] || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <Badge variant={product.badge === "Sale" ? "destructive" : "secondary"} className="absolute top-4 left-4">
                {product.badge}
              </Badge>
            )}
          </div>

          {/* Thumbnail Images */}
          <div className="flex gap-4">
            {currentImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${selectedColor} ${idx}`}
                className={`w-20 h-20 border ${idx === selectedImageIndex ? "border-primary" : ""}`}
                onClick={() => setSelectedImageIndex(idx)}
              />
            ))}
          </div>


        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-2">{product.category_name}</p>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {product.average_rating || 0} ({product.reviews_list.length} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold">₹{product.price}</span>
              {product.original_price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">₹{product.original_price}</span>
                  <Badge variant="destructive">
                    {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                  </Badge>
                </>
              )}
            </div>
          </div>

          {/* Size Selection */}
          {product.category === "Fashion" && (
            <div>
              <h3 className="font-semibold mb-3">Size</h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          <div className="flex gap-2">
            {availableColors.map((color) => (
              <Button
                key={color}
                variant={selectedColor === color ? "default" : "outline"}
                onClick={() => handleColorChange(color)}
              >
                {color}
              </Button>
            ))}
          </div>


          {/* Quantity */}
          <div>
            <h3 className="font-semibold mb-3">Quantity</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className={`text-sm ${product.in_stock ? "text-green-600" : "text-red-600"}`}>
                {product.in_stock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button onClick={handleAddToCart} disabled={!product.in_stock} className="flex-1 bg-gradient-primary text-lg py-6">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button variant="outline" size="icon" onClick={handleWishlist}>
              <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Features */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <Truck className="h-8 w-8 text-primary" />
                  <p className="font-semibold text-sm">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">On orders over ₹1000</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <RotateCcw className="h-8 w-8 text-primary" />
                  <p className="font-semibold text-sm">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">30-day return policy</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Shield className="h-8 w-8 text-primary" />
                  <p className="font-semibold text-sm">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">100% protected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs: Description, Reviews, Shipping */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews_list?.length || 0})</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Product Description</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card className="bg-card border border-border text-foreground">
              <CardContent className="p-6 space-y-6">
                <h3 className="font-semibold text-xl">Customer Reviews</h3>

                {/* Show existing reviews */}
                {product.reviews_list.map((review: any) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <img
                          // src="http://localhost:8000/media/icons/icon.png"
                          src={`${import.meta.env.VITE_BASE_URL || "http://localhost:8000"}/media/icons/icon.png`}
                          alt="User Icon"
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="font-semibold">{review.user_name}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-400">{review.comment}</p>
                  </div>
                ))}

                {/* Add Review Form */}
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Write Name</h4>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target as HTMLFormElement);
                      const data = {
                        user_name: formData.get("user_name"),
                        rating: rating, // use state instead of select
                        comment: formData.get("comment"),
                      };

                      try {
                        await authAxios.post(`${id}/add-review/`, data);
                        toast({ title: "Thank you!", description: "Your review has been submitted." });
                        setProduct((prev: any) => ({
                          ...prev,
                          reviews_list: [...prev.reviews_list, { ...data, created_at: new Date().toISOString() }],
                        }));
                        setRating(0); // reset stars
                        (e.target as HTMLFormElement).reset();
                      } catch {
                        toast({ title: "Error", description: "Failed to submit review." });
                      }
                    }}
                    className="space-y-4"
                  >
                    <input
                      name="user_name"
                      placeholder="Your name"
                      className="w-full border rounded px-3 py-2 bg-background text-foreground placeholder-muted-foreground"
                      required
                    />

                    {/* Star Rating UI */}
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-6 w-6 cursor-pointer ${
                            star <= rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                          onClick={() => setRating(star)}
                        />

                      ))}
                    </div>
                    <textarea
                      name="comment"
                      placeholder="Write your review..."
                      className="w-full border border-border rounded px-3 py-2 bg-background text-foreground placeholder-muted-foreground"
                      rows={3}
                    />
                    <Button type="submit" className="bg-primary w-full text-primary-foreground">
                      Submit Review
                    </Button>
                  </form>
                </div>

              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Shipping Information</h3>
                <p className="text-muted-foreground text-sm">Free shipping on orders over ₹1000.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </div>
  )
}

export default ProductPage
