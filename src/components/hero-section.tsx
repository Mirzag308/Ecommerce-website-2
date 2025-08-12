import { Link } from "react-router-dom"
import { ArrowRight, ShoppingBag, Truck, Shield, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import heroBanner from "@/assets/hero-banner.jpg"

export function HeroSection() {
  const features = [
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Free Shipping",
      description: "On orders over $100"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Payment",
      description: "100% protected transactions"
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "24/7 Support",
      description: "Always here to help"
    }
  ]

  return (
    <section className="relative overflow-hidden">
      {/* Main Hero */}
      <div className="relative bg-gradient-hero min-h-[70vh] flex items-center">
        <div className="absolute inset-0 bg-black/20" />
        <img
          src={heroBanner}
          alt="Hero Banner"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover Your
              <span className="block bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                Perfect Style
              </span>
            </h1>
            {/* <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              Shop the latest trends in fashion, electronics, and home decor. 
              Quality products at unbeatable prices with fast, free shipping.
            </p> */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
                <Link to="/shop">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                </Link>
              </Button>
              {/* <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
                <Link to="/shop">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add Category-
                </Link>
              </Button> */}
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-10 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-white">
            <div className="text-2xl font-bold">50%</div>
            <div className="text-sm">OFF</div>
          </div>
        </div>
        
        <div className="absolute bottom-20 right-20 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-md rounded-full p-6 text-white">
            <ShoppingBag className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/95 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-full text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            {/* <div className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2"> */}
            <div className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2 transition-transform duration-300 hover:scale-105">
              10K+
            </div>
            <p className="text-muted-foreground">Happy Customers</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2 transition-transform duration-300 hover:scale-105">
              5K+
            </div>
            <p className="text-muted-foreground">Products</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2 transition-transform duration-300 hover:scale-105">
              50+
            </div>
            <p className="text-muted-foreground">Categories</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2 transition-transform duration-300 hover:scale-105">
              99%
            </div>
            <p className="text-muted-foreground">Satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  )
}