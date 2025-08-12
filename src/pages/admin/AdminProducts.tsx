// AdminProducts.tsx 
import { useEffect, useState } from "react"
import { fetchProducts, deleteProduct } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { toast } from "@/hooks/use-toast"

const AdminProducts = () => {
  const [products, setProducts] = useState([])

  const loadProducts = async () => {
    const data = await fetchProducts()
    setProducts(data)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleDelete = async (id: string) => {
    await deleteProduct(id)
    toast({ title: "Product deleted" })
    loadProducts()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Button asChild>
          <Link to="/admin/products/new">Add Product</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product: any) => (
          <div key={product.id} className="border rounded-xl p-4">
            <img src={product.image} alt={product.name} className="h-40 w-full object-cover rounded-lg mb-4" />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-muted-foreground mb-2">${product.price}</p>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to={`/admin/products/edit/${product.id}`}>Edit</Link>
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(product.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminProducts
