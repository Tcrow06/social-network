import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import authService from '~/services/auth.service'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'

type FormValues = { newPassword: string; confirmPassword: string }

const ResetPasswordPage: React.FC = () => {
  const [search] = useSearchParams()
  const email = search.get('email') || ''
  const otp = search.get('otp') || ''
  const navigate = useNavigate()

  const { register, handleSubmit } = useForm<FormValues>()
  const [loading, setLoading] = React.useState(false)

  const onSubmit = async (data: FormValues) => {
    if (data.newPassword !== data.confirmPassword) {
      const { showToast } = await import('~/lib/toast')
      showToast({ title: 'Lỗi', description: 'Mật khẩu xác nhận không khớp.' })
      return
    }

    setLoading(true)
    try {
      const res = await authService.resetPassword({ email, otp, newPassword: data.newPassword })
      const { showToast } = await import('~/lib/toast')
      showToast({ title: 'Thành công', description: res.message || 'Mật khẩu đã được đặt lại. Vui lòng đăng nhập.' })
      navigate('/login')
    } catch (err) {
      console.error(err)
      const { showToast } = await import('~/lib/toast')
      showToast({ title: 'Thất bại', description: 'Không thể đặt lại mật khẩu. Vui lòng thử lại.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className='w-full max-w-md border border-white/10 bg-slate-800/70 text-white shadow-lg backdrop-blur-md'>
      <CardHeader>
        <CardTitle>Đặt lại mật khẩu</CardTitle>
        <CardDescription>Đặt mật khẩu mới cho {email}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <Input
            type='password'
            placeholder='Mật khẩu mới'
            {...register('newPassword')}
            className='bg-slate-700/60 text-white placeholder-slate-300'
          />
          <Input
            type='password'
            placeholder='Xác nhận mật khẩu'
            {...register('confirmPassword')}
            className='bg-slate-700/60 text-white placeholder-slate-300'
          />
          <Button type='submit' className='w-full bg-sky-600 hover:bg-sky-700' isLoading={loading}>
            Đặt lại mật khẩu
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className='text-sm text-slate-300'>Sau khi đặt lại, bạn sẽ được chuyển đến trang đăng nhập.</div>
      </CardFooter>
    </Card>
  )
}

export default ResetPasswordPage
