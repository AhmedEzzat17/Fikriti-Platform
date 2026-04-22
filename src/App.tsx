import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { useFadeIn } from "./hooks/useFadeIn";

// Layout
import MainLayout from "./layouts/MainLayout";

// Shared components used on the home page directly
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingButtons from "./components/FloatingButtons";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/subPages/ServicesPage";
import ServiceDetailPage from "./pages/subPages/ServiceDetailPage";
import PortfolioPage from "./pages/subPages/PortfolioPage";
import ProjectDetailPage from "./pages/subPages/ProjectDetailPage";
import ContactPage from "./pages/subPages/ContactPage";

import "./index.css";

// ---------------------------------------------------------------------------
// HomeLayout – wraps the home page with its own layout (no top-padding
// because the Hero section handles that itself with 100vh).
// ---------------------------------------------------------------------------
const HomeLayout: React.FC = () => {
  useFadeIn(); // Initialize fade-in animations site-wide
  return (
    <>
      <Loader />
      <Navbar />
      <HomePage />
      <Footer />
      <FloatingButtons />
    </>
  );
};

// ---------------------------------------------------------------------------
// SubPageLayout – wraps sub-pages; fade-in is also initialized here.
// ---------------------------------------------------------------------------
const SubPageLayout: React.FC = () => {
  useFadeIn();
  return <MainLayout />;
};

// ---------------------------------------------------------------------------
// App root
// ---------------------------------------------------------------------------
function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Home page – has its own dedicated layout */}
          <Route path="/" element={<HomeLayout />} />

          {/* Sub-pages share the MainLayout (Navbar + Footer) */}
          <Route element={<SubPageLayout />}>
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:id" element={<ServiceDetailPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/portfolio/:id" element={<ProjectDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
