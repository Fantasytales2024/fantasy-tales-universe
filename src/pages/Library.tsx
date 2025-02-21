import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

interface Story {
  id: number;
  title: string;
  author: string;
  cover: string;
  excerpt: string;
  node: string;
  genre: string;
}

const Library = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedNode, setSelectedNode] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/stories')
      .then(response => response.json())
      .then(data => {
        setStories(data);
        setFilteredStories(data);
      })
      .catch(error => console.error('Error fetching stories:', error));
  }, []);

  useEffect(() => {
    const filtered = stories.filter(story => {
      const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          story.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = !selectedGenre || story.genre === selectedGenre;
      const matchesNode = !selectedNode || story.node === selectedNode;
      return matchesSearch && matchesGenre && matchesNode;
    });
    setFilteredStories(filtered);
  }, [searchTerm, selectedGenre, selectedNode, stories]);

  const genres = Array.from(new Set(stories.map(story => story.genre)));
  const nodes = Array.from(new Set(stories.map(story => story.node)));

  return (
    <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Barra de herramientas */}
      <div className="sticky top-16 z-40 bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Buscador */}
            <div className="relative flex-grow">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título o autor..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtros */}
            <div className="flex gap-4">
              <select
                className="bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="">Todos los géneros</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>

              <select
                className="bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                value={selectedNode}
                onChange={(e) => setSelectedNode(e.target.value)}
              >
                <option value="">Todos los nodos</option>
                {nodes.map(node => (
                  <option key={node} value={node}>{node}</option>
                ))}
              </select>

              <button
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                <AdjustmentsHorizontalIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de historias */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStories.map((story) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`card cursor-pointer ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                <img
                  src={story.cover}
                  alt={story.title}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {story.title}
              </h3>
              <p className="text-gray-500 text-sm mb-2">por {story.author}</p>
              <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {story.excerpt}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-primary-600">{story.node}</span>
                <span className="text-secondary-600">{story.genre}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library; 