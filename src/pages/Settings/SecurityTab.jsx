import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useConfirm } from 'material-ui-confirm'
import { useForm } from 'react-hook-form'
import LogoutIcon from '@mui/icons-material/Logout'
import PasswordIcon from '@mui/icons-material/Password'
import LockIcon from '@mui/icons-material/Lock'
import LockResetIcon from '@mui/icons-material/LockReset'
import { FIELD_REQUIRED_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validator'
import FieldAlertError from '~/components/Form/FieldAlertError'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { logoutUserAPI, updateUserAPI } from '~/redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

function SecurityTab() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const confirmChangePassword = useConfirm()
  const submitChangePassword = (data) => {
    confirmChangePassword({
      title: <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LogoutIcon sx={{ color: 'warning.dark' }}/> Change Password
      </Box>,
      description: 'You have to log in again after successfully change password',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(() => {
      const { current_password, new_password } = data

      // Gọi API để cập nhật password
      toast.promise(
        dispatch(updateUserAPI({ current_password, new_password })),
        { pending: 'Updating...' }
      ).then((res) => {
        if (!res.error) {
          toast.success('Your account has been updated successfully!', { theme : 'colored' })
          dispatch(logoutUserAPI(false))
        } else {
          toast.error(res.error)
        }
      })
    }).catch(() => {})
  }
  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Box sx={{
        maxWidth: '1200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3
      }}>
        <Box>
          <Typography variant="h5">Security Dashboard</Typography>
        </Box>
        <form onSubmit={handleSubmit(submitChangePassword)}>
          <Box sx={{ width: '400px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box display='flex' flexDirection='column' gap={1}>
              <TextField fullWidth variant='outlined' type='password' label='Current Password' InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <PasswordIcon />
                  </InputAdornment>
                )
              }}
              {...register('current_password', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: PASSWORD_RULE,
                  message: PASSWORD_RULE_MESSAGE
                }
              })}
              error={!!errors['current_password']}
              />
              <FieldAlertError errors={errors} fieldName={['current_password']}/>
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <TextField fullWidth variant='outlined' type='password' label='Current Password' InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <LockIcon />
                  </InputAdornment>
                )
              }}
              {...register('new_password', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: PASSWORD_RULE,
                  message: PASSWORD_RULE_MESSAGE
                }
              })}
              error={!!errors['new_password']}
              />
              <FieldAlertError errors={errors} fieldName={['new_password']}/>
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <TextField fullWidth variant='outlined' type='password' label='Current Password' InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <LockResetIcon />
                  </InputAdornment>
                )
              }}
              {...register('new_password_confirmation', {
                validate: (value) => value === watch('new_password') ? null : 'Password confirmation does not match.'
              })}
              error={!!errors['new_password_confirmation']}
              />
              <FieldAlertError errors={errors} fieldName={['new_password_confirmation']}/>
            </Box>
            <Box>
              <Button type='submit' variant='contained' size='medium' fullWidth>
                Change
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default SecurityTab