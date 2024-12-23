import Zoom from '@mui/material/Zoom'
import Box from '@mui/material/Box'
import { CardActions, Card as MuiCard } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import PageviewIcon from '@mui/icons-material/Pageview'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FIELD_REQUIRED_MESSAGE, EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '../../utils/validator'
import FieldAlertError from '~/components/Form/FieldAlertError'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { loginUserAPI } from '~/redux/user/userSlice'

function LoginForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()
  let [searchParams] = useSearchParams()
  const registeredEmail = searchParams.get('registeredEmail')
  const verifiedEmail = searchParams.get('verifiedEmail')
  const submitLogIn = (data) => {
    const { email, password } = data
    toast.promise(
      dispatch(loginUserAPI({ email, password })),
      { pending: 'Logging in...' }
    ).then(res => {
      console.log(res)
      // Đăng nhập thành công thì điều hướng
      if (!res.error) navigate('/')
    })
  }
  return (
    <form onSubmit={handleSubmit(submitLogIn)}>
      <Zoom in={true} style={{ transitionDelay: '200ms', padding: '1em' }}>
        <MuiCard
          sx={{
            minWidth: 400,
            maxWidth: 400,
            marginTop: '6em'
          }}
        >
          <Box
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, margin: '1em'
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'primary.main', width: 48, height: 48
              }}
            >
              <PageviewIcon />
            </Avatar>
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
              <PageviewIcon />
            </Avatar>
          </Box>
          <Box
            sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center', color: 'text.secondary', fontSize: '1.4em'
            }}
          >
            Author : ZCode
          </Box>
          <Box sx={{ marginTop: '1em' }}>
            {verifiedEmail && <Alert severity="success">
              Your email <Typography variant='span' sx={{ fontWeight: 'bold', '&:hover': { cursor: 'pointer', color: '#fdba26'}}} color="text.primary">
                {verifiedEmail}
              </Typography> has been verified.
            </Alert>}
            {registeredEmail && <Alert severity="info">
              An email has been sent to <Typography variant='span' sx={{ fontWeight: 'bold', '&:hover': { cursor: 'pointer', color: '#fdba26'}}} color="text.primary">
                {registeredEmail}
              </Typography>. Please check your inbox.
            </Alert>}
          </Box>
          <Box sx={{ marginY: '1em', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
            <TextField autoFocus label="Enter Email" variant="outlined" error={!!errors['email']} {...register('email', {
              required: FIELD_REQUIRED_MESSAGE,
              pattern: {
                value: EMAIL_RULE,
                message: EMAIL_RULE_MESSAGE
              }
            })}/>
            <FieldAlertError errors={errors} fieldName='email' />
            <TextField label="Enter Password" variant="outlined" type="password" error={!!errors['password']} {...register('password', {
              required: FIELD_REQUIRED_MESSAGE,
              pattern: {
                value: PASSWORD_RULE,
                message: PASSWORD_RULE_MESSAGE
              }
            })}/>
            <FieldAlertError errors={errors} fieldName='password' />
          </Box>
          <Box>
            <Button className='intereptor-loading' type="submit" variant="contained" size='large' fullWidth>Login</Button>
          </Box>
          <Box sx={{ marginTop: '1em', textAlign: 'center' }}>  
            <Typography>Don't have an account?</Typography>
            <Link to='/register'>Register</Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default LoginForm
