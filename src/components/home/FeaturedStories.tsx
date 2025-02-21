import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Story {
  id: number;
  title: string;
  author: string;
  cover: string;
  excerpt: string;
  node: string;
  genre: string;
}

const FeaturedStories = () => {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/stories?featured=true')
      .then(response => response.json())
      .then(data => setStories(data))
      .catch(error => console.error('Error fetching stories:', error));
  }, []);

  return (
    <section className="py-20 px-4 bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-12"
        >
          Historias Destacadas
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="card group cursor-pointer"
            >
              <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                <img
                  src={story.cover}
                  alt={story.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
              <p className="text-gray-400 text-sm mb-2">por {story.author}</p>
              <p className="text-gray-300 mb-4">{story.excerpt}</p>
              <div className="flex justify-between items-center">
                <span className="text-primary-400">{story.node}</span>
                <span className="text-secondary-400">{story.genre}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedStories; 