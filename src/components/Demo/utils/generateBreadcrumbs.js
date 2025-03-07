export const generateBreadcrumbs = (basePath, crumbs) => {
  const breadcrumbItems = [];
  let currentPath = basePath;

  console.log('*** basePath ***', basePath);

  const traverse = (obj) => {
    for (const key in obj) {
      if (obj[key].path) {
        currentPath += obj[key].path;

        console.log('*** currentPath ***', currentPath);

        // Push the breadcrumb item with title and path
        breadcrumbItems.push({
          title: key,
          href: currentPath,
        });
      }

      // Check for child and continue traversing if it exists
      if (obj[key].child) {
        traverse(obj[key].child);
      } else {
        // Stop traversing if no child
        break;
      }
    }
  };

  traverse(crumbs);

  console.log('*** breadcrumbItems ***', breadcrumbItems);
  return breadcrumbItems;
};
