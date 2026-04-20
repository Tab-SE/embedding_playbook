import React from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from 'components/ui';
import Link from 'next/link';

import { generateBreadcrumbs } from '../../utils';

export const Breadcrumbs = (props) => {
  const {
    base_path,
    crumbs,
    app_name,
    header_brand_logo,
  } = props;

  const breadcrumbItems = generateBreadcrumbs(base_path, crumbs);

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={item.href} className="text-breadcrumbs inline-flex items-center">
                  {header_brand_logo && index === 0 ? (
                    <img
                      src={header_brand_logo}
                      alt={app_name || ''}
                      className="h-7 w-auto max-w-[min(100%,280px)] object-contain object-left"
                    />
                  ) : (
                    item.title
                  )}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator className="text-breadcrumbs" />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
