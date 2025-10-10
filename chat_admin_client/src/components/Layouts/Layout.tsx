import React, { useState, useEffect } from 'react'
import AdminSidebar from '../ui/AdminSidebar'
import AdminHeader from '../ui/AdminHeader'
import { useAuthStore } from '~/store/useAuth.store'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

interface LayoutProps {
  children?: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const auth = useAuthStore((s) => s.data)

  const navigate = useNavigate()

  // check authentication
  useEffect(() => {
    if (!auth) {
      toast.error('Bạn cần đăng nhập để truy cập trang này.')
      navigate('/login')
    }
  }, [auth])

  // Check if mobile
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 1024 // lg breakpoint
      setIsMobile(mobile)
      if (mobile) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Handle overlay click - only close if clicked on overlay, not sidebar content
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsSidebarOpen(false)
    }
  }

  return (
    <div className='relative flex min-h-screen'>
      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className='bg-opacity-50 fixed inset-0 z-40 bg-black transition-opacity duration-300'
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${isMobile ? 'fixed z-50' : 'sticky top-0'} ${
          isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'
        } h-full transition-transform duration-300 ease-in-out`}
        style={{ touchAction: 'pan-y' }} // Allow vertical scrolling on mobile
      >
        <AdminSidebar isOpen={isSidebarOpen} />
      </div>

      {/* Main Content Area */}
      <div className='flex min-h-screen flex-1 flex-col overflow-hidden'>
        {/* Header */}
        <AdminHeader onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Main Content */}
        <main className='flex-1 overflow-auto bg-gradient-to-b from-slate-900 to-slate-800 text-white sm:p-4 lg:p-6'>
          <div className='mx-auto max-w-full'>{children}</div>
        </main>
      </div>
    </div>
  )
}

export default Layout
