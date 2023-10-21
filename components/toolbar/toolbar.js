import { useState } from 'react'
import { useConfig } from 'nextra-theme-docs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloud, faTruckFast } from '@fortawesome/free-solid-svg-icons'
import Avatar from './components/avatar'
import Vertical from './components/verticals'
import Cart  from './components/cart'
import Download from './components/download'
import Filter from './components/filter'

function Toolbar(props) {
  const { nextThemes } = useConfig();
  console.log(nextThemes);
  

  return (
    <section>
      <div className="flex justify-between navbar bg-sfneutral mt-8 pr-6 rounded">
        <div className="flex-1">
          <Vertical />
        </div>
        <div className="flex-1 justify-center space-x-10">
          <Filter />
          <Download />
          <Cart />
        </div>
        <div className='flex justify-end'>
          <Avatar
            src="img/stock/mackenzie_day.png"
            alt="sample user"
            height={48}
            width={48}
            className="btn btn-ghost"
          />
        </div>
      </div>
    </section>
  )
}

export default Toolbar;
