export const generateBreadcrumbs = (crumbs) => {
  const breadcrumbItems = [];

  const traverse = (obj) => {
    for (const key in obj) {
      breadcrumbItems.push(key);
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        traverse(obj[key]);
      }
    }
  };

  traverse(crumbs);
  return breadcrumbItems;
};
