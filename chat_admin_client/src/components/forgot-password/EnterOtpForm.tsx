/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import authService from '~/services/auth.service'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '~/components/ui/input-otp'
import { toast } from 'react-toastify'

type FormValues = { email: string; otp: string }

const EnterOtpForm: React.FC<{ defaultEmail?: string }> = ({ defaultEmail = '' }) => {
  const { handleSubmit } = useForm<FormValues>({ defaultValues: { email: defaultEmail } })
  const [otp, setOtp] = React.useState('')
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    try {
      const res = await authService.verifyOtp({ email: data.email, otp })
      if (res.code !== 201) {
        throw new Error(res.message || 'Xác thực OTP thất bại')
      }
      toast.success(res.message || 'Bạn có thể đặt lại mật khẩu.')
      // navigate to reset password page
      navigate(`/reset-password?email=${encodeURIComponent(data.email)}&otp=${encodeURIComponent(otp)}`)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Xác thực OTP thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className='w-full max-w-md border border-white/10 bg-slate-800/70 text-white shadow-lg backdrop-blur-md'>
      <CardHeader>
        <CardTitle>Nhập mã OTP</CardTitle>
        <CardDescription>Chào {defaultEmail} ,Nhập mã OTP đã được gửi tới email của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='flex justify-center'>
            <InputOTP maxLength={6} value={otp} onChange={(val) => setOtp(val)}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button type='submit' className='w-full bg-sky-600 hover:bg-sky-700' isLoading={loading}>
            Xác thực OTP
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className='text-sm text-slate-300'>Nếu không nhận được mã, quay lại gửi lại mã.</div>
      </CardFooter>
    </Card>
  )
}

export default EnterOtpForm
