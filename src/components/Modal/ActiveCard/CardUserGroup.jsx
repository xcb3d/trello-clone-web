import { Badge } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import Tooltip from '@mui/material/Tooltip'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { CARD_MEMBER_ACTIONS } from '~/utils/constants'


function CardUserGroup({ cardMemberIds = [], onUpdateCardMembers }) {

  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'card-all-users-popover' : undefined
  const handleTogglePopover = (e) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(e.currentTarget)
    else setAnchorPopoverElement(null)
  }

  const board = useSelector(selectCurrentActiveBoard)
  const FE_cardMember = board?.FE_allUsers.filter(user => cardMemberIds.includes(user._id))

  const handleUpdateCardMembers = (user) => {
    const incomingMemberInfo = {
      userId: user._id,
      action: cardMemberIds.includes(user._id) ? CARD_MEMBER_ACTIONS.REMOVE : CARD_MEMBER_ACTIONS.ADD
    }
    onUpdateCardMembers(incomingMemberInfo)
  }
  return (
    <Box sx={{ display: 'flex', gap: '4px' }}>
      {FE_cardMember.map((user, index) => 
        <Tooltip title={user.displayName} key={index}>
          <Avatar
            sx={{ width: 40, height: 40, cursor: 'pointer' }}
            alt='ZCode'
            src={user.avatar} />
        </Tooltip>
      )}


      <Tooltip title='Show more'>
        <Box
          aria-describedby={popoverId}
          onClick={handleTogglePopover}
          sx={{
            width: 40,
            height: 40,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: '400',
            borderRadius: '50%',
            color: 'white',
            backgroundColor: '#a4b0be',
          }}
        >
          +
        </Box>
      </Tooltip>

      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box
          sx={{ p:2, maxWidth: '270px', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {board.FE_allUsers.map((user, index) =>
            <Tooltip title={user.displayName} key={index}>
              <Badge
                sx={{ cursor: 'pointer'}}
                overlap='rectangular'
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={cardMemberIds.includes(user._id) && <CheckCircleIcon fontSize='small' color='success' />}
                onClick={() => handleUpdateCardMembers(user)}
              >
                <Avatar sx={{
                  width: 40,
                  height: 40,
                  cursor: 'pointer'
                }}
                alt='ZCode'
                src={user.avatar}
                />
              </Badge>
            </Tooltip>)}
        </Box>

      </Popover>
    </Box>
  )
}

export default CardUserGroup