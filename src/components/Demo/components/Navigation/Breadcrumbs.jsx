import React from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from 'components/ui';
import Link from 'next/link';
import Image from 'next/image'; // 1. Import Image

import { generateBreadcrumbs } from '../../utils';

export const Breadcrumbs = (props) => {
  const {
    base_path,
    crumbs
  } = props;

  const breadcrumbItems = generateBreadcrumbs(base_path, crumbs);
  const logoPath = "/img/themes/omnicell/omnicellbglogo.png";

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={item.href} className="text-breadcrumbs">
                  {index === 0 ? (
                    <Image
                      src={logoPath}
                      alt="Omnicell Logo"
                      width={400}
                      height={400}
                      style={{ marginTop: '80px' }}
                    />
                  ) : (
                    item.label
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
