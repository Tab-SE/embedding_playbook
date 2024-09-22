/**
 * Retrieves layout properties for a given breakpoint from the layouts object.
 * If the specific breakpoint properties are not found, it falls back to the wildcard properties.
 * If neither are available, it throws an error.
 *
 * @param {Object} layouts - The layouts object containing properties for various breakpoints.
 * @param {string} breakpoint - The specific breakpoint key to retrieve properties for (e.g., 'xs', 'sm', 'md').
 * @returns {Object} - The layout properties for the specified breakpoint or wildcard.
 * @throws {Error} - Throws an error if neither the specified breakpoint nor wildcard properties are found.
 */
export const getLayoutProps = (layouts, breakpoint) => {
  const layoutProps = layouts[breakpoint] || layouts['*'];

  if (!layoutProps) {
    throw new Error(`Layout properties for '${breakpoint}' and/or wildcard '*' are not defined.`);
  }

  return layoutProps;
};


/**
 * Parses the className string and extracts CSS properties for each breakpoint.
 *
 * @param {string} className - The className string containing CSS properties.
 * @param {Object} layouts - The existing layouts object to be updated.
 * @returns {Object} - The updated layouts object with extracted width and height.
 */
export const parseClassNameForLayouts = (className, layouts) => {
  const breakpointMap = {
    '': 'xs',
    'sm:': 'sm',
    'md:': 'md',
    'lg:': 'lg',
    'xl:': 'xl',
    '2xl:': 'xl2'
  };
  const updatedLayouts = { ...layouts };

  Object.entries(breakpointMap).forEach(([prefix, layoutKey]) => {
    const regex = new RegExp(`${prefix}min-w-\\[(\\d+)px\\]\\s*${prefix}min-h-\\[(\\d+)px\\]`);
    const match = className.match(regex);

    if (match) {
      const width = parseInt(match[1], 10);
      const height = parseInt(match[2], 10);

      if (!updatedLayouts[layoutKey]) {
        updatedLayouts[layoutKey] = {};
      }

      updatedLayouts[layoutKey] = {
        ...updatedLayouts[layoutKey],
        width,
        height
      };
    }
  });

  return updatedLayouts;
};

