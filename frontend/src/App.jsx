import React from 'react';
import Navbar from './components/navbar';
import Hero from './components/hero';
import Features from './components/features';
import StorySection from './components/storysection';
import CategoriesSection from './components/categoriessection';
import ReservationSection from './components/reservationsection';
import Footer from './components/footer';

function App() {
  return (
    <div className="min-h-screen bg-[#F6F1E7]">
      <Navbar />
      <Hero />
      <Features/>
      <StorySection/>
      <CategoriesSection/>
      <ReservationSection/>
      <Footer/>
      
    </div>
  )
}

export default App;