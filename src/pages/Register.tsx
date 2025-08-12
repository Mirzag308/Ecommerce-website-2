import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/users/register/`, formData);

      alert("Registered successfully!");
    } catch (error: any) {
      console.error("Registration error:", error.response?.data || error.message);
      alert("Registration failed!");
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="username"
              placeholder="Username"
              onChange={handleChange}
              value={formData.username}
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              value={formData.email}
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              value={formData.password}
            />
            <Button type="submit" className="w-full bg-gradient-primary">
              Create Account
            </Button>
            <div className="text-center mt-2">
              <Link to="/login" className="text-sm text-blue-600 hover:underline">
                login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
