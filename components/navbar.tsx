import React from 'react'
import Link from 'next/link'
import { MenuItems } from '@/types/types'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const Navbar = async () => {
  const session = await getServerSession(authOptions)

  const menuItems: MenuItems[] = [
    { name: 'Home', path: '/' },
    { name: 'User Profiles', path: '/userprofiles' },
    { name: 'Proposal Dashboard', path: '/proposaldashboard' },
    { name: 'Collaboration Tools', path: '/collaborationtools' },
    { name: 'Grants and Funding', path: '/grantsandfunding' },
    { name: 'Events Dashboard', path: '/eventsdashboard' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <header className="bg-gray-900 text-neutral-content shadow-md">
      <div className="mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-slate-300">
          Scholar Connect
        </Link>

        {/* Hamburger Menu */}
        <input
          type="checkbox"
          id="menu-toggle"
          className="peer hidden"
        />
        <label
          htmlFor="menu-toggle"
          className="block lg:hidden text-gray-300 cursor-pointer"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </label>

        {/* Navigation */}
        <nav className="peer-checked:block hidden lg:flex items-left lg:space-x-6 absolute lg:static top-16 left-0 w-full lg:w-auto bg-neutral lg:bg-transparent text-gray-300 lg:text-inherit peer-checked:bg-gray-900">
          <ul className="flex flex-col lg:flex-row lg:space-x-4 text-gray-300 peer-checked:space-y-4 lg:space-y-0 lg:text-left text-left">
            {menuItems.map((item) => (
              <li key={item.name} className="">
                <Link
                  href={item.path}
                  className="block px-4 py-2 lg:p-0 hover:text-cyan-400"
                >
                  {item.name}
                </Link>
              </li>
            ))}

            {/* Conditionally render login, register, logout */}
            {!session ? (
              <>
                <li className="">
                  <Link
                    href="/login"
                    className="block px-4 py-2 lg:p-0 hover:text-cyan-400"
                  >
                    Login
                  </Link>
                </li>
                <li className="text-center lg:text-left">
                  <Link
                    href="/register"
                    className="block px-4 py-2 lg:p-0 hover:text-cyan-400"
                  >
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <li className="">
                <Link
                  href="/api/auth/signout"
                  className="block px-4 py-2 lg:p-0 hover:text-cyan-400"
                >
                  Logout
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
