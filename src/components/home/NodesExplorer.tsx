import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Node {
  id: number;
  name: string;
  description: string;
  color: string;
}

const NodesExplorer = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/nodes')
      .then(response => response.json())
      .then(data => setNodes(data))
      .catch(error => console.error('Error fetching nodes:', error));
  }, []);

  const getNodeColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'from-primary-500 to-primary-700';
      case 'purple':
        return 'from-secondary-500 to-secondary-700';
      case 'green':
        return 'from-emerald-500 to-emerald-700';
      default:
        return 'from-gray-500 to-gray-700';
    }
  };

  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-16"
        >
          Explorador de Nodos
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="relative cursor-pointer"
              onClick={() => setSelectedNode(node)}
            >
              <div className={`h-64 rounded-2xl bg-gradient-to-br ${getNodeColor(node.color)} 
                              p-6 flex flex-col justify-end transform transition-all duration-300
                              hover:shadow-lg hover:shadow-${node.color}-500/20`}>
                <h3 className="text-2xl font-bold mb-2">{node.name}</h3>
                <p className="text-gray-200 text-sm">{node.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal para mostrar detalles del nodo */}
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-800 p-8 rounded-2xl max-w-lg w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-3xl font-bold mb-4">{selectedNode.name}</h3>
              <p className="text-gray-300 mb-6">{selectedNode.description}</p>
              <button
                className="btn-primary w-full"
                onClick={() => setSelectedNode(null)}
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default NodesExplorer; 