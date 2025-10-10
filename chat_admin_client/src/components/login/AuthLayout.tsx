import React from 'react'
import { useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { useAuthStore } from '~/store/useAuth.store'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const AuthLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const auth = useAuthStore((s) => s.data)
  const navigate = useNavigate()

  useEffect(() => {
    if (auth) {
      toast.info('Bạn đã đăng nhập.')
      navigate('/')
    }
  }, [auth, navigate])

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 text-white'>
      <div className='container mx-auto px-6'>
        <div className='grid grid-cols-1 items-center gap-8 md:grid-cols-2'>
          <div className='hidden md:block'>
            <div className='flex h-full flex-col justify-center'>
              <h1 className='mb-4 flex items-center gap-1 text-3xl font-bold'>
                <Avatar>
                  <AvatarImage src='/logo-white.svg' />
                  <AvatarFallback>T</AvatarFallback>
                </Avatar>
                Mạng xã hội Teleface
              </h1>
              <p className='text-gray-300'>Kết nối và chia sẻ với bạn bè của bạn.</p>
            </div>
          </div>
          <div className='flex items-center justify-center'>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
