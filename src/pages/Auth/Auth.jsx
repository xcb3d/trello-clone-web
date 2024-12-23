import { Navigate, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'


function Auth() {
  const location = useLocation()
  const isLogin = location.pathname.includes('login')
  const isRegister = location.pathname.includes('register')
  const user = useSelector(selectCurrentUser)
  if (user) {
    return <Navigate to='/' replace={true} />
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'start',
        backgroundImage: 'url(https://res.cloudinary.com/dvbosn50d/image/upload/v1734970034/users/xqyxgg7zjcnt4u07uuor.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.2)'
      }}>
      {isLogin && <LoginForm />}
      {isRegister && <RegisterForm />}
    </Box>
  )
}

export default Auth