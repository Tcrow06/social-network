import React, { useState, useEffect } from 'react'
import { LayoutDashboard, Users as UsersIcon, FileText, User as UserIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface AdminSidebarProps {
  isOpen: boolean
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen }) => {
  const [selectedItem, setSelectedItem] = useState('')
  const location = useLocation()

  // Sync selected items with current URL
  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setSelectedItem('dashboard')
        break
      case '/users':
        setSelectedItem('users')
        break
      case '/posts':
        setSelectedItem('posts')
        break
      case '/admins':
        setSelectedItem('admins')
        break
      default:
        setSelectedItem('')
    }
  }, [location.pathname])

  const menuItems = [
    {
      id: 'dashboard',
      path: '/',
      label: 'Tổng quan',
      icon: LayoutDashboard
    },
    {
      id: 'users',
      path: '/users',
      label: 'Người dùng',
      icon: UsersIcon
    },
    {
      id: 'posts',
      path: '/posts',
      label: 'Bài viết',
      icon: FileText
    },
    {
      id: 'admins',
      path: '/admins',
      label: 'Admin',
      icon: UserIcon
    }
  ]

  const handleItemClick = (itemId: string) => {
    setSelectedItem(itemId)
  }

  return (
    <div
      className={`flex h-screen flex-col bg-gradient-to-b from-slate-900 to-slate-800 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-60' : 'w-20'
      } overflow-hidden pt-3`}
    >
      {/* Logo Section */}
      <div
        className={`mb-6 flex flex-shrink-0 items-center px-4 transition-all duration-300 ${
          isOpen ? 'justify-center' : 'justify-center'
        }`}
      >
        <img src='/logo-white.svg' alt='Admin Logo' className='h-10 w-10 flex-shrink-0' />
        {isOpen && <h2 className='ml-3 text-base font-semibold whitespace-nowrap text-white'>Teleface</h2>}
      </div>

      {/* Menu Section */}
      <div className='flex min-h-0 flex-1 flex-col overflow-y-auto px-2'>
        <ul className='mb-15 space-y-2 pb-6'>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isSelected = selectedItem === item.id

            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  onClick={() => handleItemClick(item.id)}
                  className={`group relative flex items-center px-4 py-3 transition-all duration-200 ${
                    isSelected
                      ? 'rounded-tl-4xl rounded-bl-4xl bg-slate-700/60 text-sky-300 shadow-inner'
                      : 'rounded-lg text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                  title={!isOpen ? item.label : ''}
                >
                  <Icon className={`h-6 w-6 flex-shrink-0 ${isSelected ? 'text-sky-300' : 'text-white/80'}`} />

                  {isOpen && (
                    <span
                      className={`font-sm ml-3 text-sm whitespace-nowrap transition-opacity duration-300 ${
                        isSelected ? 'text-sky-300' : 'text-white/80'
                      }`}
                    >
                      {item.label}
                    </span>
                  )}

                  {!isOpen && (
                    <div className='absolute left-full z-50 ml-2 rounded bg-gray-800 px-2 py-1 text-sm whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default AdminSidebar
