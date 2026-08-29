import React from 'react';
import Hero from '../components/hero';
import Features from '../components/features';
import StorySection from '../components/storysection';
import CategoriesSection from '../components/categoriessection';
import ReservationSection from '../components/reservationsection';

function App() {
  return (
    <div className="min-h-screen bg-[#F6F1E7]">
      <Hero />
      <Features/>
      <StorySection/>
      <CategoriesSection/>
      <ReservationSection/>
    </div>
  )
}

export default App;