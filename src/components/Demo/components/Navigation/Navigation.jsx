import Image from 'next/image';

import { NavigationSm, Breadcrumbs, UserMenu } from "components";

import { settings } from '../../settings'

export const Navigation = (props) => {
  const { basePath, crumbs } = props;

  return (
    <header >
      <div className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <NavigationSm />
        <Image
          src={settings.logo_large}
          alt="Logo"
          width={240}
          height={68}
          className='m-9'
        />
        <div className="relative ml-auto flex-1 md:grow-0"/>
        <UserMenu />
      </div>
      <Breadcrumbs
        basePath={basePath}
        crumbs={crumbs}
        className={'ml-12 mt-6'}
      />
    </header>
  )
}
