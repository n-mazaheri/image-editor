import { useState, useLayoutEffect } from 'react';

const useDimensions = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions(); // Initial call
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return dimensions;
};
export default useDimensions;
