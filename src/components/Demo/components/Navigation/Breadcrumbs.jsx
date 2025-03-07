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
    crumbs
  } = props;

  const breadcrumbItems = generateBreadcrumbs(base_path, crumbs);

  return (
    <Breadcrumb className="hidden md:flex">
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
