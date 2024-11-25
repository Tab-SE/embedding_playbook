import React from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from 'components/ui';
import Link from 'next/link';

import { cn } from 'utils';

export const Breadcrumbs = (props) => {
  const { basePath, crumbs, className } = props;

  const breadcrumbItems = generateBreadcrumbs(basePath, crumbs);

  return (
    <Breadcrumb className={cn("hidden md:flex mb-6", className)}>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={item.href}>
                  {item.title}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};


const generateBreadcrumbs = (basePath, crumbs) => {
  const breadcrumbItems = [];
  let currentPath = basePath;

  const traverse = (obj) => {
    for (const key in obj) {
      if (obj[key].path) {
        currentPath += obj[key].path;

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
  return breadcrumbItems;
};
