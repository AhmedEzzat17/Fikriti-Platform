import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FloatingButtons from "../components/FloatingButtons";

/**
 * MainLayout: wraps sub-pages with the same Navbar and Footer
 * as the home page.
 */
const MainLayout: React.FC = () => {
  return (
    <>
      <Navbar />
      {/* Give top padding so content isn't hidden behind the fixed navbar */}
      <div style={{ paddingTop: "80px" }}>
        <Outlet />
      </div>
      <Footer />
      <FloatingButtons />
    </>
  );
};

export default MainLayout;
