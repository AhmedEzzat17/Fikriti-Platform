import React from "react";
import Hero from "../components/Hero";
import AboutUs from "../components/AboutUs";
import Services from "../components/Services";
import OurGoals from "../components/OurGoals";
import OurPortfolio from "../components/OurPortfolio";
import Contact from "../components/Contact";
import TabsTape from "../components/TabsTape";

/**
 * HomePage wraps all home-page sections in a single component.
 * Loader, Navbar, Footer and FloatingButtons are handled by the
 * parent layout (App.tsx) so they don't need to be repeated here.
 */
const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <AboutUs />
      <Services />
      <OurGoals />
      <OurPortfolio />
      <Contact />
      <TabsTape />
    </>
  );
};

export default HomePage;
