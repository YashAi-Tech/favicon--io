import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Showcase from "./components/Showcase";
import Platform from "./components/Platform";
import TrustedBrands from "./components/TrustedBrands";
import CustomerStories from "./components/CustomerStories";
import Stats from "./components/Stats";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import { Toaster } from "./components/ui/toaster";

const Home = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <TrustedBrands />
      <Showcase />
      <Platform />
      <CustomerStories />
      <Stats />
      <FinalCTA />
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
