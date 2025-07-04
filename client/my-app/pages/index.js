import React from 'react';
import Link from 'next/link';

export default function Homepage() {
  const features = [
    {
      icon: '📝',
      title: 'Create & Share',
      description: 'Build wishlists and share them with friends instantly'
    },
    {
      icon: '👥',
      title: 'Collaborate',
      description: 'Multiple users can add and manage items together'
    },
    {
      icon: '⚡',
      title: 'Real-time',
      description: 'See updates from your group members instantly'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="container mx-auto px-6 py-8 text-center max-w-4xl">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-6xl md:text-7xl font-light mb-6 tracking-tight">
            Shared Wishlist
          </h1>
          <p className="text-xl text-gray-400 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
            Create, share, and manage wishlists with friends and family. 
            Plan your shopping together.
          </p>
          
          <Link 
            href="/login" 
            className="inline-block bg-white text-black py-4 px-8 text-lg font-medium hover:bg-gray-100 transition-colors duration-200 border border-white hover:border-gray-300"
          >
            Build Wishlist
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-6 border border-gray-800 hover:border-gray-700 transition-colors duration-200 group"
            >
              <div className="text-2xl mb-4 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed font-light">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom text */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-sm text-gray-500 font-light">
            Simple. Collaborative. Efficient.
          </p>
        </div>
      </div>
    </div>
  );
}