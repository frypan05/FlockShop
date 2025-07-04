// client/pages/login.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    
    console.log("Login button clicked, email:", email);
    
    if (!email.includes("@")) {
      alert("Please enter a valid email.");
      return;
    }
    
    // Only use localStorage on client side
    if (isClient && typeof window !== 'undefined') {
      try {
        localStorage.setItem("userEmail", email);
        console.log("Email saved to localStorage");
      } catch (error) {
        console.error("localStorage error:", error);
      }
    }
    
    // Navigate to dashboard
    console.log("Navigating to dashboard...");
    router.push("/dashboard").then(() => {
      console.log("Navigation successful");
    }).catch((error) => {
      console.error("Navigation error:", error);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md px-6">
        <div className="border border-gray-800 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light mb-2">Welcome Back</h1>
            <p className="text-gray-400 text-sm font-light">Enter your email to continue</p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors duration-200"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-white text-black py-3 px-6 font-medium hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors duration-200"
            >
              Continue to Dashboard
            </button>
          </form>
          
          {/* Footer */}
          <div className="mt-8 text-center">
            <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors duration-200">
              ← Back to Home
            </Link>
          </div>
        </div>
        
        {/* Bottom text */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm font-light">
            Simple wishlist management
          </p>
        </div>
      </div>
    </div>
  );
}