import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, FIELD_REQUIRED_MESSAGE } from '~/utils/validator'
import FieldAlertError from '~/components/Form/FieldAlertError'
import { inviteUserToBoard } from '~/apis'
import { socketIoInstance } from '~/socket'

function InviteBoardUser({ boardId }) {
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'card-all-users-popover' : undefined
  const handleTogglePopover = (e) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(e.currentTarget)
    else setAnchorPopoverElement(null)
  }

  const { register, handleSubmit, setValue, formState: { errors } } = useForm()
  const submitInviteUserToBoard = (data) => {
    const { inviteeEmail } = data
    // console.log(inviteeEmail)

    // Gọi API để invite user
    inviteUserToBoard({ inviteeEmail: inviteeEmail.trim(), boardId: boardId }).then((invitation) => {
      setValue('inviteeEmail', null)
      setAnchorPopoverElement(null)

      // Mời một người vào board xong thì cũng sẽ gửi/emit sự kiện socket lên server (Tính năng realtime)
      socketIoInstance.emit('FE_USER_INVITED_TO_BOARD', invitation)
    })


  }
  return (
    <Box>
      <Tooltip title="Invite user to this board">
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          onClick={handleTogglePopover}
          sx={{
            color: 'white',
            borderColor: 'white',
            ':hover': {
              borderColor: 'white'
            }
          }}
        >
          Invite
        </Button>
      </Tooltip>

      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <form onSubmit={handleSubmit(submitInviteUserToBoard)} style={{ width: '320px' }}>
          <Box sx={{ p: '15px 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="span" sx={{ fontWeight: 600, fontSize: '20px'}} >
              Invite user to this board
            </Typography>
            <Box display='flex' flexDirection='column' gap={1}>
              <TextField
                autoFocus
                fullWidth
                type='text'
                variant='outlined'
                label="Enter email to invite"
                error={!!errors['inviteeEmail']} {...register('inviteeEmail', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: EMAIL_RULE,
                    message: EMAIL_RULE_MESSAGE
                  }
                })}
              />
              <FieldAlertError errors={errors} fieldName={['inviteeEmail']}/>
            </Box>
            <Button variant='contained' sx={{ alignSelf: 'flex-end' }} type='submit' className='intereptor-loading'>
              Invite
            </Button>
          </Box>
        </form>
      </Popover>
    </Box>
  )
}

export default InviteBoardUser