import React from 'react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from 'components/ui';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "components/ui";
import Link from 'next/link';

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
                    <Avatar className="h-16 w-32 bg-logoBackground">
                      <AvatarImage src={app_logo} alt={`${item.title} logo`} />
                      <AvatarFallback className="text-xs">{item.title.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <span>{item.title}</span>
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
