import { User } from "lucide-react"

const Account = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-4">My Account</h1>
      <p className="text-muted-foreground">Manage your account settings</p>
    </div>
  )
}

export default Account