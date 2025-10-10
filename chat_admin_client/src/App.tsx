import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LayoutWrapper from './components/Layouts/LayoutWrapperProps'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import LoginPage from './pages/login'
import ForgotPasswordPage from './pages/forgot-password/index'
import User from './pages/users/index'
import Posts from './pages/posts/index'
import Admin from './pages/admins/index'

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route path='/' element={<Dashboard />} />
          <Route path='/users/*' element={<User />} />
          <Route path='/posts/*' element={<Posts />} />
          <Route path='/admins/*' element={<Admin />} />
          {/* Catch-all route will be 404 */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  )
}

export default App
