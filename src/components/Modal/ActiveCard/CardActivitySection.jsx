import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

function CardActivitySection({ cardComments=[], onChangedValue }) {
  const user = useSelector(selectCurrentUser)

  const handleAddCardComment = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault() // Enter không bị xuống dòng
      if (!event.target?.value) return

      const commentToAdd = {
        userAvatar: user?.avatar,
        userDisplayName: user?.displayName,
        content: event.target.value.trim()
      }
      onChangedValue(commentToAdd)
      event.target.value = ''
      console.log('commentToAdd: ', commentToAdd)
    }
  }
  return (
    <Box sx={{ mt: 2 }}>
      {/* Xử lý thêm comment vào card */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Avatar
          sx={{ width: 40, height: 40, cursor: 'pointer' }}
          alt='userAvatar'
          src={user?.avatar}
        />
        <TextField
          fullWidth
          placeholder='Add a comment...'
          type="input"
          variant="outlined"
          multiline
          onKeyDown={handleAddCardComment}
        />
      </Box>

      {/* HIển thị comments */}
      {cardComments.length === 0 &&
      <Typography sx={{ pl: '45px', fontSize: '14px', fontWeight: '500', color: '#b1b1b1' }}>No Activity Found</Typography>}
      {cardComments.map((comment, index) =>
        <Box sx={{ display: 'flex', gap: 1, width: '100%', mb: 1.5, alignItems: 'center' }} key={index}>
          <Tooltip title={comment?.displayName}>
            <Avatar
              sx={{ width: 40, height: 40, cursor: 'pointer' }}
              alt="userAvatar"
              src={comment?.userAvatar}
            />
          </Tooltip>
          <Box sx={{ width: 'inherit' }}>
            <Typography variant="span" sx={{ fontWeight: 'bold', mr: 1 }}>
              {comment?.displayName}
            </Typography>
            <Typography variant="span" sx={{ fontSize: '12px' }}>
              {moment(comment?.commentAt).format('llll')}
            </Typography>

            <Box sx={{
              display: 'block',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#33485D' : '#091e420f',
              p: '8px 12px',
              mt: '4px',
              border: '0.5px solid rgba(0, 0 ,0, 0.2)',
              borderRadius: '8px',
              wordBreak: 'break-word',
              boxShadow: '0 0 1px rgba(0, 0, 0, 0.2)'
            }}>
              {comment?.content}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default CardActivitySection