import { useState, useLayoutEffect } from 'react';

/**
 * Custom hook to get the dimensions (width and height) of the screen/window.
 * It updates the dimensions when the window is resized.
 *
 * @returns An object containing the width and height of the screen/window.
 */
const useDimensions = () => {
  // State to hold the dimensions (width and height)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Effect hook to handle window resize events and update dimensions accordingly
  useLayoutEffect(() => {
    // Function to update dimensions with current window width and height
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth, // Update width with current inner width of window
        height: window.innerHeight, // Update height with current inner height of window
      });
    };

    // Event listener to handle window resize events
    window.addEventListener('resize', updateDimensions);

    // Initial call to update dimensions once when the component mounts
    updateDimensions();

    // Cleanup function to remove event listener when component unmounts
    return () => {
      window.removeEventListener('resize', updateDimensions); // Remove resize event listener
    };
  }, []); // Empty dependency array ensures effect runs only on mount and unmount

  // Return dimensions state, containing width and height
  return dimensions;
};

export default useDimensions;
