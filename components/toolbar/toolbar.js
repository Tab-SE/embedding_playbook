import { useState } from 'react'
import { useConfig } from 'nextra-theme-docs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import Logo from '../logo/logo'
import Avatar from '../avatar/avatar'
import Cart  from './components/cart'

function Toolbar(props) {
  const { nextThemes } = useConfig();
  console.log(nextThemes);
  

  return (
    <section>
      <div className="navbar bg-sfneutral mt-8 rounded">
        <div className="flex-auto">
          <a className="btn btn-ghost normal-case text-xl outline-transparent text-white">
          <Logo
            src='svg/logo_color.svg?w=40&h=40'
            alt='Superstore Analytics (logo)'
            name='Superstore Analytics'
          />
          </a>
        </div>
        <div className="flex-auto justify-end">
          <Cart />
          <div className="dropdown dropdown-end">
            <span tabIndex={0} className="btn btn-ghost">
              <Avatar
                src="img/stock/mackenzie_day.png"
                alt="sample user"
                height={48}
                width={48}
              />
            </span>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge badge-accent">New</span>
                </a>
              </li>
              <li><a>Settings</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Toolbar;
