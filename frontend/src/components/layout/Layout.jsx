import React, { useEffect } from "react";
import axios from "axios";
import Footer from "./Footer";
import Header from "./Header";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";

function Layout({
  children,
  title = "PCREX: COMPUTER HARDWARE",
  description = "Computer hardware online",
  keywords = "computer hardware",
  author = "Taslim",
}) {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        await axios.post(`${import.meta.env.VITE_API}/api/v1/auth/track-visit`);
      } catch (error) {
        console.error("Error tracking visit:", error);
      }
    };

    trackVisit();
  }, []);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <meta charSet="utf-8" />
          <meta name="description" content={description} />
          <meta name="keywords" content={keywords} />
          <meta name="author" content={author} />
          <title>{title}</title>
        </Helmet>
      </HelmetProvider>
      <Header />

      <main style={{ minHeight: "80vh" }}>
        {children}
        <Toaster />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
