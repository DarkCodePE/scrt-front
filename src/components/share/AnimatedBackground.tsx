'use client';
import React, {useState} from 'react';
import Image from 'next/image';

const AnimatedBackground = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-purple-900/80 backdrop-blur-sm z-10"/>

          {/* GIF background */}
          <div className="absolute inset-0">
              <Image
                  src="/background.gif"
                  alt="Background Animation"
                  fill
                  priority
                  className={`object-cover transition-opacity duration-1000 ${
                      isLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoadingComplete={() => setIsLoaded(true)}
                  style={{filter: 'brightness(0.4)'}}
              />
          </div>
      </div>
    );
};

export default AnimatedBackground;