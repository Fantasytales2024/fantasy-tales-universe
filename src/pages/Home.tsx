import React from 'react';
import HeroBanner from '../components/home/HeroBanner';
import FeaturedStories from '../components/home/FeaturedStories';
import NodesExplorer from '../components/home/NodesExplorer';

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroBanner />
      <FeaturedStories />
      <NodesExplorer />
    </div>
  );
};

export default Home; 