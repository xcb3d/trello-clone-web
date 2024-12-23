import Zoom from '@mui/material/Zoom'
import Box from '@mui/material/Box'
import { Card as MuiCard } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import PageviewIcon from '@mui/icons-material/Pageview'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FIELD_REQUIRED_MESSAGE, EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '../../utils/validator'
import FieldAlertError from '~/components/Form/FieldAlertError'
import { registerUserAPI } from '~/apis'
import { toast } from 'react-toastify'

function RegisterForm() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const navigate = useNavigate()
  const submitRegister = (data) => {
    const { email, password } = data
    toast.promise(
      registerUserAPI({ email, password }),
      { pending: 'Registering...' }
    ).then(user => {
      navigate(`/login?registeredEmail=${user.email}`)
    })
  }
  return (
    <form onSubmit={handleSubmit(submitRegister)}>
      <Zoom in={true} style={{ transitionDelay: '200ms', padding: '1em' }}>
        <MuiCard
          sx={{
            minWidth: 400,
            maxWidth: 400,
            marginTop: '6em'
          }}
        >
          <Box
            sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, margin: '1em'
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
            sx={{marginTop: '1em', display: 'flex', justifyContent: 'center', color: 'text.secondary', fontSize: '1.4em'
            }}
          >
            Author : ZCode
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
            <TextField label="Enter Password Confirmation" variant="outlined" type="password" error={!!errors['password_confirmation']} {...register('password_confirmation' ,{
              validate: (value) => value === watch('password') ? null : 'Password confirmation does not match.'
            })}/>
            <FieldAlertError errors={errors} fieldName='password_confirmation' />
          </Box>
          <Box>
            <Button className='intereptor-loading' type='submit'variant="contained" size='large' fullWidth>Register</Button>
          </Box>
          <Box sx={{ marginTop: '1em', textAlign: 'center' }}>
            <Typography>Alreader have an account?</Typography>
            <Link to='/login'>Login</Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default RegisterForm