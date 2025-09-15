"use client";
import { forwardRef, useRef, useEffect, useId } from 'react';

import { TableauAuth } from 'components';

// forwardRef HOC receives ref from parent and sets placeholder
export const TableauEmbed = forwardRef(function TableauEmbed(props, ref) {
  const {
    src,
    className,
    height,
    width,
    hideTabs,
    toolbar,
    isPublic,
    WebEdit = false,
    customToolbar = true,
    layouts
  } = props;

  // to be used if parent did not forward a ref
  const localRef = useRef(null);
  // Use the forwarded ref if provided, otherwise use the local ref
  const innerRef = ref || localRef;

  // Check if this is a Tableau Public URL
  const isTableauPublic = src && src.includes('public.tableau.com');

  // Tableau Public component logic - uses Embedding API v3 with <tableau-viz> web component
  const TableauPublicEmbed = forwardRef(function TableauPublicEmbed(props, ref) {
    const { src, className, height = '600px', width = '100%' } = props;
    const id = `viz-${useId().replace(/:/g, '')}`;

    useEffect(() => {
      // Load Tableau Embedding API v3 for Public
      const loadTableauAPI = () => {
        return new Promise((resolve, reject) => {
          // Check if already loaded
          if (document.querySelector('script[src*="tableau.embedding.3.latest.min.js"]')) {
            resolve();
            return;
          }

          const script = document.createElement('script');
          script.type = 'module';
          script.src = 'https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Tableau Embedding API'));
          document.head.appendChild(script);
        });
      };

      loadTableauAPI().catch(error => {
        console.error('Error loading Tableau Embedding API:', error);
      });
    }, []);

    return (
      <div className={className} style={{ width, height }}>
        <tableau-viz
          ref={ref}
          id={id}
          src={src}
          width={width}
          height={height}
          hide-tabs="true"
          toolbar="hidden"
          class="flex justify-center items-center rounded"
        />
      </div>
    );
  });

  return (
    <div className={className}>
      {isTableauPublic ? (
        <TableauPublicEmbed
          src={src}
          ref={innerRef}
          className={className}
          height={height}
          width={width}
        />
      ) : (
        <TableauAuth
          src={src}
          ref={innerRef}
          className={className}
          height={height}
          width={width}
          hide-tabs={hideTabs ? true : false}
          toolbar={toolbar}
          isPublic={isPublic}
          WebEdit={WebEdit}
          customToolbar={customToolbar}
          layouts={layouts}
        />
      )}
    </div>
  )
});
