import React, { lazy, Suspense } from "react";
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

import "./index.css";

// the current page; each screen is loaded only when its route is visited.
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ServicesPage = lazy(() => import("./pages/subPages/ServicesPage"));
const ServiceDetailPage = lazy(
  () => import("./pages/subPages/ServiceDetailPage"),
);
const PortfolioPage = lazy(() => import("./pages/subPages/PortfolioPage"));
const ProjectDetailPage = lazy(
  () => import("./pages/subPages/ProjectDetailPage"),
);
const ContactPage = lazy(() => import("./pages/subPages/ContactPage"));
const BlogDetailPage = lazy(() => import("./pages/subPages/BlogDetailPage"));
const ClientProjectView = lazy(
  () => import("./pages/client/ClientProjectView"),
);

const Dashboard = lazy(() => import("./admin/pages/Dashboard"));
const UsersPage = lazy(() => import("./admin/pages/UsersPage"));
const ProjectsPage = lazy(() => import("./admin/pages/ProjectsPage"));
const ClientProjectsPage = lazy(
  () => import("./admin/pages/ClientProjectsPage"),
);
const ServicesManager = lazy(() => import("./admin/pages/ServicesManager"));
const BlogManager = lazy(() => import("./admin/pages/BlogManager"));
const TechnologiesPage = lazy(() => import("./admin/pages/TechnologiesPage"));
const MessagesPage = lazy(() => import("./admin/pages/MessagesPage"));
const SettingsPage = lazy(() => import("./admin/pages/SettingsPage"));

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
            {/* Public Website Routes */}
            <Route path="/" element={<HomeLayout />} />
            <Route path="/login" element={<LoginPage />} />

            <Route element={<SubPageLayout />}>
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:id" element={<ServiceDetailPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/portfolio/:id" element={<ProjectDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blog/:id" element={<BlogDetailPage />} />
            </Route>

            {/* Client Portal View */}
            <Route
              path="/client/projects/:id"
              element={<ClientProjectView />}
            />

            {/* Admin Dashboard Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="client-projects" element={<ClientProjectsPage />} />
              <Route path="services" element={<ServicesManager />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="portfolios" element={<ProjectsPage />} />
              <Route path="blog" element={<BlogManager />} />
              <Route path="technologies" element={<TechnologiesPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>

            {/* Explicit 404 Route */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
