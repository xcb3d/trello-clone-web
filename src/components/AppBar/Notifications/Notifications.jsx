import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import moment from 'moment'
import DoneIcon from '@mui/icons-material/Done'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import { useDispatch, useSelector } from 'react-redux'
import { addNotification, fetchInvitationAPI, selectCurrentNotifications, updateBoardInvitationAPI } from '~/redux/notifications/notificationsSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useNavigate } from 'react-router-dom'
import { socketIoInstance } from '~/socket'


const BOARD_INVITATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
}

function Notifications() {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const notifications = useSelector(selectCurrentNotifications)
  const user = useSelector(selectCurrentUser)
  const [newNotification, setNewNotification] = useState(false)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchInvitationAPI())

    // Function xử lý khi nhận được sự kiện realtime socketio
    const onReciverNewInvitation = (invitation) => {
      //  Nếu user đang đăng nhập trong redux store là invitee trong invitation thì sẽ được hiển thị lên UI
      if (invitation.inviteeId === user?._id) {
        // Thêm bản ghi invitation mới vào trong redux
        dispatch(addNotification(invitation))
        // Cập nhật trạng thái có thông báo mới
        setNewNotification(true)
      }
    }

    // Lắng nghe sự kiện realtime tên là BE_USER_INVITED_TO_BOARD
    socketIoInstance.on('BE_USER_INVITED_TO_BOARD', onReciverNewInvitation)

    // Cleanup tránh duplicate event handler
    return () => {
      socketIoInstance.off('BE_USER_INVITED_TO_BOARD', onReciverNewInvitation)
    }
  }, [dispatch])

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget)
    setNewNotification(false)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const updateBoardInvitation = (status, invitationId) => {
    dispatch(updateBoardInvitationAPI({ status, invitationId })).then((res) => {
      console.log(res)
      if (res.payload.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED) {
        navigate(`/boards/${res.payload.boardInvitation.boardId}`)
      }
    })
  }

  return (
    <Box>
      <Tooltip title="Notification">
        <Badge
          color="warning"
          variant={newNotification ? 'dot' : 'none'}
          sx={{ cursor: 'pointer' }}
          id="basic-button-open-notification"
          aria-controls={open ? 'basic-menu-open-notification' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleOpen}
        >
          <NotificationsNoneIcon sx={{ color: newNotification ? 'yellow' : 'white' }} />
        </Badge>
      </Tooltip>
      <Menu
        sx={{ mt: 2 }}
        id="basic-notification-drop-down"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button-open-notification' }}
      >
        {(!notifications || notifications.length === 0) && <MenuItem sx={{ minWidth: 200 }}>
          You do not have any notification
        </MenuItem>}
        {notifications?.map((notification, index) =>
          <Box key={index}>
            <MenuItem sx={{
              minWidth: 200,
              maxWidth: 360,
              overflowY: 'auto'
            }}>
              <Box
                sx={{
                  maxWidth: '100%',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box><GroupAddIcon /></Box>
                  <Box><strong>{notification?.inviter?.displayName}</strong> invited you to join a board <strong>{notification?.board?.title}</strong></Box>
                </Box>
                {notification?.boardInvitation?.status === BOARD_INVITATION_STATUS.PENDING &&
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                  <Button
                    className="intereptor-loading"
                    type="submit"
                    variant="outlined"
                    color="success"
                    onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.ACCEPTED, notification?._id)}
                  >
                    Accept
                  </Button>
                  <Button
                    className="intereptor-loading"
                    type="submit"
                    variant="outlined"
                    color="secondary"
                    onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.REJECTED, notification?._id)}
                  >
                    Reject
                  </Button>
                </Box>}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                  {notification?.boardInvitation?.status === BOARD_INVITATION_STATUS.ACCEPTED &&
                  <Chip icon={<DoneIcon />} label="accepted" color="success" size="small" /> }
                  {notification?.boardInvitation?.status === BOARD_INVITATION_STATUS.REJECTED &&
                  <Chip icon={<NotInterestedIcon />} label="rejected" color="secondary" size="small" />}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                  <Typography variant="span" sx={{ fontSize: '14px' }}>
                    {moment(notification?.createdAt).format('llll')}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            {index !== (notifications?.length - 1) && <Divider />}
          </Box>
        )}
      </Menu>
    </Box>
  )
}

export default Notifications