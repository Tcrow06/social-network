import { Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Popover, PopoverTrigger, PopoverContent } from './popover'
import { Button } from './button'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { useAuthStore } from '~/store/useAuth.store'

interface AdminHeaderProps {
  onToggleSidebar: () => void
  isSidebarOpen: boolean
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate()
  const authStore = useAuthStore()

  const auth = useAuthStore((s) => s.data)

  const handleLogout = () => {
    authStore.setData(null)
    navigate('/login')
  }

  return (
    <header
      className={`border-b bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-100 px-3 py-3 shadow-sm transition-all duration-300 sm:px-6 lg:px-10 ${
        isSidebarOpen ? '' : 'ml-0 rounded-bl-none sm:ml-7 sm:rounded-bl-[60px]'
      }`}
    >
      <div className='flex items-center justify-between'>
        <div className='flex min-w-0 flex-1 items-center'>
          <button
            onClick={onToggleSidebar}
            className='mr-2 rounded-lg p-2 text-white transition-colors duration-200 hover:bg-white/10 sm:mr-4'
            aria-label={isSidebarOpen ? 'Đóng sidebar' : 'Mở sidebar'}
          >
            {isSidebarOpen ? (
              <X strokeWidth={3} className='h-5 w-5 sm:h-6 sm:w-6' />
            ) : (
              <Menu strokeWidth={3} className='h-5 w-5 sm:h-6 sm:w-6' />
            )}
          </button>
        </div>

        <div className='flex items-center space-x-2 sm:space-x-4'>
          <Popover>
            <PopoverTrigger asChild>
              <div className='flex cursor-pointer items-center gap-3 rounded-full px-3 py-1 transition-colors hover:bg-white/5'>
                <Avatar>
                  <AvatarImage src='/logo-white.svg' />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <span className='hidden max-w-[140px] truncate text-sm font-medium text-black sm:inline-block'>
                    {auth?.name}
                  </span>
                  <p className='hidden text-xs text-slate-600 sm:block'>{auth?.email}</p>
                </div>
              </div>
            </PopoverTrigger>

            <PopoverContent className='w-40 border border-white/10 bg-slate-900 text-white'>
              <div className='flex flex-col'>
                <Button
                  variant='destructive'
                  className='w-full justify-start border-none bg-red-600 text-sm text-white hover:bg-red-700'
                  onClick={handleLogout}
                >
                  Đăng xuất
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
