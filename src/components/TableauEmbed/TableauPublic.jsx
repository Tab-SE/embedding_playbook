"use client";
import { useEffect, useRef, forwardRef, useId } from 'react';

// Component for embedding Tableau Public dashboards using JavaScript API v2
export const TableauPublic = forwardRef(function TableauPublic(props, ref) {
  const { src, className, height = '600px', width = '100%' } = props;
  const containerRef = useRef(null);
  const vizRef = useRef(null);
  const id = `viz-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    // Load Tableau JavaScript API v2 if not already loaded
    if (!window.tableau) {
      const script = document.createElement('script');
      script.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
      script.async = true;
      document.head.appendChild(script);
    }

    // Create the viz when component mounts
    const createViz = () => {
      if (containerRef.current && window.tableau) {
        // Clear any existing content
        containerRef.current.innerHTML = '';

        const options = {
          hideTabs: true,
          hideToolbar: true,
          width: width,
          height: height,
          onFirstInteractive: () => {
            console.log('Tableau Public viz loaded');
          }
        };

        try {
          vizRef.current = new window.tableau.Viz(containerRef.current, src, options);
        } catch (error) {
          console.error('Error creating Tableau viz:', error);
        }
      }
    };

    // Wait for Tableau API to load
    if (window.tableau) {
      createViz();
    } else {
      const checkTableau = setInterval(() => {
        if (window.tableau) {
          clearInterval(checkTableau);
          createViz();
        }
      }, 100);
    }

    // Cleanup
    return () => {
      if (vizRef.current) {
        try {
          if (typeof vizRef.current.dispose === 'function') {
            vizRef.current.dispose();
          } else if (typeof vizRef.current.removeEventListener === 'function') {
            // Alternative cleanup if dispose doesn't exist
            vizRef.current.removeEventListener('firstinteractive', () => {});
          }
        } catch (error) {
          console.warn('Error during Tableau viz cleanup:', error);
        }
        vizRef.current = null;
      }
    };
  }, [src, height, width]);

  return (
    <div
      ref={containerRef}
      id={id}
      className={className}
      style={{ width, height }}
    />
  );
});
