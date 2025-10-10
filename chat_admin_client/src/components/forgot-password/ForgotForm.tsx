/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { useForm } from 'react-hook-form'
import authService from '~/services/auth.service'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { toast } from 'react-toastify'

type FormValues = { email: string }

const ForgotForm: React.FC = () => {
  const { register, handleSubmit } = useForm<FormValues>()

  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    try {
      const res = await authService.forgotPassword({ email: data.email })
      if (res.code === 201) {
        toast.success(res.message || 'Nếu email tồn tại, chúng tôi đã gửi OTP.')
        navigate(`/forgot-password?mode=enterotp&email=${encodeURIComponent(data.email)}`)
      } else {
        console.log(res)
        toast.error(res.message || 'Không thể gửi OTP, thử lại sau.')
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err?.response?.data?.message || 'Không thể gửi OTP, thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className='w-full max-w-md border border-white/10 bg-slate-800/70 text-white shadow-lg backdrop-blur-md'>
      <CardHeader>
        <CardTitle>Quên mật khẩu</CardTitle>
        <CardDescription>Nhập email để nhận mã OTP đặt lại mật khẩu</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <Input
            placeholder='Địa chỉ email'
            {...register('email')}
            className='bg-slate-700/60 text-white placeholder-slate-300'
          />
          <Button type='submit' className='w-full bg-sky-600 hover:bg-sky-700' isLoading={loading}>
            Gửi mã OTP
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className='text-sm text-slate-300'>Kiểm tra hộp thư của bạn để nhận mã.</div>
      </CardFooter>
    </Card>
  )
}

export default ForgotForm
