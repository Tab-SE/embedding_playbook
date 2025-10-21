import React from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from 'components/ui';
import Link from 'next/link';
import Image from 'next/image';

import { generateBreadcrumbs } from '../../utils';

export const Breadcrumbs = (props) => {
  const {
    base_path,
    crumbs,
    app_logo
  } = props;

  const breadcrumbItems = generateBreadcrumbs(base_path, crumbs);

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={item.href} className="text-breadcrumbs flex items-center gap-2">
                  {index === 0 && app_logo ? (
                    <Image
                      src={app_logo}
                      alt={item.title}
                      width={48}
                      height={48}
                      className="h-12 w-auto"
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
