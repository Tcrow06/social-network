import React from 'react'
import { useSearchParams } from 'react-router-dom'
import ForgotForm from '~/components/forgot-password/ForgotForm'
import EnterOtpForm from '~/components/forgot-password/EnterOtpForm'

const ForgotPasswordPage: React.FC = () => {
  const [search] = useSearchParams()
  const mode = search.get('mode')
  const email = search.get('email') || undefined

  if (mode === 'enterotp') {
    return <EnterOtpForm defaultEmail={email} />
  }

  return <ForgotForm />
}

export default ForgotPasswordPage
