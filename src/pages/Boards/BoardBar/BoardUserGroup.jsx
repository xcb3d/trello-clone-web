// import { Avatar, Box, Popover, Tooltip } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import Tooltip from '@mui/material/Tooltip'
import { useState } from 'react'

function BoardUserGroup({ boardUsers = [], limit = 8 }) {

  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'board-all-users-popover' : undefined
  const handleTogglePopover = (e) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(e.currentTarget)
    else setAnchorPopoverElement(null)
  }
  return (
    <Box sx={{ display: 'flex', gap: '4px' }}>
      {boardUsers.map((_, index) => {
        if (index < limit) {
          return (
            <Tooltip title={_.displayName} key={index}>
              <Avatar
                sx={{ width: 40, height: 40, cursor: 'pointer' }}
                alt='userAvatar'
                src={_.avatar} />
            </Tooltip>
          )
        }
      })}

      {boardUsers.length > limit &&
      (
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
              fontSize: '1rem',
              fontWeight: '500',
              borderRadius: '50%',
              color: 'white',
              backgroundColor: '#a4b0be'
            }}
          >
            +{boardUsers.length - limit}
          </Box>
        </Tooltip>
      )}

      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box
          sx={{ p:2, maxWidth: '270px', display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {boardUsers.map((_, index) => 
            <Tooltip title={_.displayName} key={index}>
              <Avatar sx={{
                width: 40,
                height: 40,
                cursor: 'pointer'
              }}
              alt='userAvatar'
              src={_.avatar}
              />
            </Tooltip>)}
        </Box>

      </Popover>
    </Box>
  )
}

export default BoardUserGroup