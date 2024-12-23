import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { selectCurrentUser, updateUserAPI } from '~/redux/user/userSlice'
import { FIELD_REQUIRED_MESSAGE, singleFileValidator } from '~/utils/validator'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import MailIcon from '@mui/icons-material/Mail'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import FieldAlertError from '~/components/Form/FieldAlertError'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'


function AccountTab() {
  const user = useSelector(selectCurrentUser)
  const dispatch = useDispatch()

  const initialGeneralForm = {
    displayName: user?.displayName
  }

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialGeneralForm
  })

  const submitChangeGeneralInfomation = (data) => {
    const { displayName } = data
    console.log('🚀 ~ submitChangeGeneralInfomation ~ displayName:', displayName)
    if (displayName === user?.displayName) return

    // Gọi API để cập nhật thông tin
    toast.promise(
      dispatch(updateUserAPI({ displayName })),
      { pending: 'Updating...' }
    ).then((res) => {
      if (!res.error) {
        toast.success('Your account has been updated successfully!', { theme : 'colored' })
      } else {
        toast.error(res.error)
      }
    })
  }

  const uploadAvatar = (e) => {
    console.log('🚀 ~ uploadAvatar ~ e:', e.target?.files[0])
    const error = singleFileValidator(e.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }

    let reqData = new FormData()
    reqData.append('avatar', e.target?.files[0])
    console.log('🚀 ~ uploadAvatar ~ reqData:', reqData)

    for (const value of reqData.values()) {
      console.log('🚀 ~ uploadAvatar ~ value:', value)
    }
    // Gọi API
    toast.promise(
      dispatch(updateUserAPI(reqData)),
      { pending: 'Updating...' }
    ).then((res) => { 
      if (!res.error) {
        toast.success('Your account has been updated successfully!', { theme : 'colored' })
      }
      // Dù có lỗi hay không thì cũng phải clear giá trị file input, nếu không thì sẽ không thể chọn cùng 1 file liên tiếp được
      e.target.value = ''
    })
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
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Box>
            <Avatar sx={{ width: 90, height: 90, mb: 1 }} src={user?.avatar} />
            <Tooltip title="Upload a new image for your profile">
              <Button component="label" variant='contained' size='small' startIcon={<CloudUploadIcon />}>
                Upload
                <VisuallyHiddenInput type='file' onChange={uploadAvatar} />
              </Button>
            </Tooltip>
          </Box>
          <Box>
            <Typography variant='h6'>{user?.displayName}</Typography>
            <Typography sx={{ color: 'gray' }}>{user?.email}</Typography>
          </Box>
        </Box>
        <form onSubmit={handleSubmit(submitChangeGeneralInfomation)}>
          <Box sx={{ width: '400px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <TextField disabled defaultValue={user?.email} fullWidth variant='filled' type='text' label='Your Email' InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <MailIcon />
                  </InputAdornment>
                )
              }} />
            </Box>
            <Box>
              <TextField disabled defaultValue={user?.username} fullWidth variant='filled' type='text' label='Your Username' InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <AccountBoxIcon />
                  </InputAdornment>
                )
              }} />
            </Box>
            <Box display='flex' flexDirection='column' gap={1}>
              <TextField fullWidth variant='outlined' type='text' label='Your Display Name' InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <AssignmentIndIcon />
                  </InputAdornment>
                )
              }}
              {...register('displayName', {
                required: FIELD_REQUIRED_MESSAGE
              })}
              error={!!errors['displayName']}
              />
              <FieldAlertError errors={errors} fieldName={['displayName']}/>
            </Box>
            <Box>
              <Button type='submit' variant='contained' size='medium' fullWidth>
                Update
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default AccountTab