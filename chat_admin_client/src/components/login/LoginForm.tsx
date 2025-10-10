/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '~/store/useAuth.store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { toast } from 'react-toastify'
import userService from '~/services/auth.service'

type FormValues = {
  email: string
  password: string
}

const LoginForm: React.FC = () => {
  const { register, handleSubmit } = useForm<FormValues>()
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    try {
      const res = await userService.login(data)

      console.log(res)

      if (res.data && res.code === 201) {
        const { accessToken, refreshToken, admin } = res.data
        if (!accessToken || !refreshToken) {
          throw new Error('Đăng nhập thất bại')
        }
        useAuthStore.getState().setData({
          accessToken,
          refreshToken,
          name: admin?.name,
          email: admin?.email
        })
        // navigate to dashboard
        navigate('/')
        return
      } else {
        toast.error(res.message || 'Đăng nhập thất bại')
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Đăng nhập thất bại !')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className='w-full max-w-md border border-white/10 bg-slate-800/70 text-white shadow-lg backdrop-blur-md'>
      <CardHeader>
        <CardTitle>Chào mừng trở lại</CardTitle>
        <CardDescription>Đăng nhập để truy cập trang quản trị</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <Input
              placeholder='Địa chỉ email'
              {...register('email')}
              className='bg-slate-700/60 text-white placeholder-slate-300'
            />
          </div>
          <div>
            <Input
              placeholder='Mật khẩu'
              type='password'
              {...register('password')}
              className='bg-slate-700/60 text-white placeholder-slate-300'
            />
          </div>
          <div>
            <Button
              type='submit'
              className='w-full bg-sky-600 hover:bg-sky-700'
              isLoading={loading}
              startIcon={<img src='/logo-white.svg' alt='logo' className='h-4 w-4' />}
            >
              Đăng nhập
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <div className='text-sm text-slate-300'>
          <Link to='/forgot-password' className='text-sky-300 hover:underline'>
            Quên mật khẩu?
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

export default LoginForm
