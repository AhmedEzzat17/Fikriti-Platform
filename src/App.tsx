import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { useFadeIn } from "./hooks/useFadeIn";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./admin/components/AdminLayout";

// Shared components
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

// Admin Pages (Lazy Loaded for performance)
const Dashboard = lazy(() => import("./admin/pages/Dashboard"));
const UsersPage = lazy(() => import("./admin/pages/UsersPage"));
const ProjectsPage = lazy(() => import("./admin/pages/ProjectsPage"));
const TechnologiesPage = lazy(() => import("./admin/pages/TechnologiesPage"));
const MessagesPage = lazy(() => import("./admin/pages/MessagesPage"));
const SettingsPage = lazy(() => import("./admin/pages/SettingsPage"));

import "./index.css";

const HomeLayout: React.FC = () => {
  useFadeIn();
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

const SubPageLayout: React.FC = () => {
  useFadeIn();
  return <MainLayout />;
};

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Home page */}
            <Route path="/" element={<HomeLayout />} />

            {/* Sub-pages */}
            <Route element={<SubPageLayout />}>
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:id" element={<ServiceDetailPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/portfolio/:id" element={<ProjectDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            {/* Admin Dashboard */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="technologies" element={<TechnologiesPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;

