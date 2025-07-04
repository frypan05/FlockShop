// client/pages/_app.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email && router.pathname !== "/login") {
      router.push("/login");
    }
  }, []);

  return <Component {...pageProps} />;
}
