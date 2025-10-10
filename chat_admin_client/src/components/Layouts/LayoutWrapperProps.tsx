import React from 'react'
import Layout from './Layout'
import AuthLayout from '../login/AuthLayout'
import { useLocation } from 'react-router-dom'

interface LayoutWrapperProps {
  children?: React.ReactNode
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const location = useLocation()

  // Identify layout based on route
  if (location.pathname.startsWith('/login') || location.pathname.startsWith('/forgot-password')) {
    return <AuthLayout>{children}</AuthLayout>
  }
  // Default layout for other pages
  return <Layout>{children}</Layout>
}

export default LayoutWrapper
