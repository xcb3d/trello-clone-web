import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Modal from '@mui/material/Modal'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { singleFileValidator } from '~/utils/validator'
import { toast } from 'react-toastify'
import CancelIcon from '@mui/icons-material/Cancel'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import Grid from '@mui/material/Unstable_Grid2'
import CardUserGroup from './CardUserGroup'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
import CardDescriptionMdEditor from './CardDescriptionMdEditor'
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined'
import CardActivitySection from './CardActivitySection'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined'
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined'
import AddToDriveOutlinedIcon from '@mui/icons-material/AddToDriveOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import AutoAwesomeMotionOutlinedIcon from '@mui/icons-material/AutoAwesomeMotionOutlined'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { useDispatch, useSelector } from 'react-redux'
import { hideModalActiveCard, selectCurrentActiveCard, selectIsShowModalActiveCard, updateCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'
import { updateCardDetailsAPI } from '~/apis'
import { updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { CARD_MEMBER_ACTIONS } from '~/utils/constants'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
  padding: '10px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
    '&.active': {
      color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
      backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
    }
  }
}))

function ActiveCard() {
  // const [isOpen, setIsOpen] = useState(true)
  // const handleOpenModal = () => setIsOpen(true)
  const activeCard = useSelector(selectCurrentActiveCard)
  const isShowModalActiveCard = useSelector(selectIsShowModalActiveCard)
  const user = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const handleCloseModal = () => {
    // setIsOpen(false)
    dispatch(hideModalActiveCard())
  }

  // Function dùng chung cho các tác vụ cập nhật dữ liệu của card
  const handleUpdateCard = async (updateData) => {
    const updateCard = await updateCardDetailsAPI(activeCard?._id, updateData)

    // Cập nhật lại card đang active trong modal hiện tại
    dispatch(updateCurrentActiveCard(updateCard))
    // Cập nhật lại bản ghi card trong activeBoard
    dispatch(updateCardInBoard(updateCard))

    return updateCard
  }

  const onUpdateCardTitle = (newTitle) => {
    handleUpdateCard({ title: newTitle.trim() })
  }

  const onUpdateCardDescription = (newDescription) => {
    handleUpdateCard({ description: newDescription })
  }


  const onUploadCardCover = (event) => {
    // console.log(event.target?.files[0])
    const error = singleFileValidator(event.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }

    let reqData = new FormData()
    reqData.append('cardCover', event.target?.files[0])
    // console.log('reqData:', reqData)

    // Gọi API ở đây
    toast.promise(
      handleUpdateCard(reqData).finally(() => {
        event.target.value = ''
      }),
      { pending: 'Updating...' }
    )
  }

  const onAddCardComment = (commentToAdd) => {
    handleUpdateCard({ commentToAdd })
  }

  const onUpdateCardMembers = (incomingMemberInfo) => {
    handleUpdateCard({ incomingMemberInfo })
  }

  return (
    <Modal
      disableScrollLock
      open={isShowModalActiveCard}
      onClose={handleCloseModal}
      sx={{ overflowY: 'auto' }}>
      <Box sx={{
        position: 'relative',
        width: 900,
        maxWidth: 900,
        bgcolor: 'white',
        boxShadow: 24,
        borderRadius: '8px',
        border: 'none',
        outline: 0,
        padding: '40px 20px 30px',
        margin: '50px auto',
        backgroundColor: ( theme) => theme.palette.mode === ' dark' ? ' #1A2027' : ' white'
      }}>
        <Box sx={{
          position: 'absolute',
          top: '12px',
          right: '10px',
          cursor: 'pointer'
        }}>
          <CancelIcon color='error' sx={{ '&:hover': { color: 'error.light' } }} onClick={handleCloseModal}/>
        </Box>

        {activeCard?.cover &&
        <Box sx={{ mb: 4 }}>
          <img
            style={{ width: '100%', height: '320px', borderRadius: '8px', objectFit: 'cover' }}
            src={activeCard?.cover}
            alt='Card cover'
          />
        </Box>}

        <Box sx={{ mb:1, mt: -3, pr: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditCardIcon />
          {/* Xử lý tiêu đề card */}
          <ToggleFocusInput inputFontSize='22px' value={activeCard?.title} onChangedValue={onUpdateCardTitle}/>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Left side */}
          <Grid xs={12} sm={9}>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: '600', color: 'primary.main', mb:1 }}>
                Member
              </Typography>
              {/* Xử lý danh sách member */}
              <CardUserGroup
                cardMemberIds={activeCard?.memberIds}
                onUpdateCardMembers={onUpdateCardMembers}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems:'center', gap: 1.5 }}>
                <SubjectRoundedIcon />
                <Typography variant='span' sx={{ fontWeight: '600', fontSize: '20px' }}>
                  Description
                </Typography>
              </Box>
              {/* Xử lý phần mô tả card */}
              <CardDescriptionMdEditor
                cardDescriptionProp={activeCard?.description}
                onChangedValue={onUpdateCardDescription}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems:'center', gap: 1.5 }}>
                <DvrOutlinedIcon />
                <Typography variant='span' sx={{ fontWeight: '600', fontSize: '20px' }}>
                  Activity
                </Typography>
              </Box>
              {/* Xử lý phần hoạt động của card */}
              <CardActivitySection
                cardComments={activeCard?.comments}
                onChangedValue={onAddCardComment}
              />
            </Box>

          </Grid>
          {/* Right side */}
          <Grid xs={12} sm={3}>
            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Add to card</Typography>
            <Stack direction='column' spacing={1}>
              {!activeCard?.memberIds?.includes(user?._id) &&
              <SidebarItem className='active' onClick={() => {
                onUpdateCardMembers({
                  userId: user._id,
                  action: CARD_MEMBER_ACTIONS.ADD
                })
              }}>
                <PersonOutlineOutlinedIcon fontSize='small'/>
                Join
              </SidebarItem>}
              {activeCard?.memberIds?.includes(user?._id) &&
              <SidebarItem className='active' onClick={() => {
                onUpdateCardMembers({
                  userId: user._id,
                  action: CARD_MEMBER_ACTIONS.REMOVE
                })
              }}>
                <LogoutOutlinedIcon fontSize='small'/>
                Leave
              </SidebarItem>}
              <SidebarItem className='active' component='label'>
                <ImageOutlinedIcon fontSize='small'/>
                Cover
                <VisuallyHiddenInput type='file' onChange={onUploadCardCover}/>
              </SidebarItem>
              <SidebarItem><AttachFileOutlinedIcon fontSize='small'/>Attachment</SidebarItem>
              <SidebarItem><LocalOfferOutlinedIcon fontSize='small'/>Label</SidebarItem>
              <SidebarItem><TaskAltOutlinedIcon fontSize='small'/>Task</SidebarItem>
              <SidebarItem><WatchLaterOutlinedIcon fontSize='small'/>Due Date</SidebarItem>
              <SidebarItem><AutoFixHighOutlinedIcon fontSize='small'/>Priority</SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }}/>
            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Powers-up</Typography>
            <Stack direction='column' spacing={1}>
              <SidebarItem><AspectRatioOutlinedIcon fontSize='small'/>Card Size</SidebarItem>
              <SidebarItem><AddToDriveOutlinedIcon fontSize='small'/>Google Drive</SidebarItem>
              <SidebarItem><AddOutlinedIcon fontSize='small'/>Add powers-up</SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }}/>
            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Action</Typography>
            <Stack direction='column' spacing={1}>
              <SidebarItem><ArrowForwardIosOutlinedIcon fontSize='small'/>Move</SidebarItem>
              <SidebarItem><ContentCopyOutlinedIcon fontSize='small'/>Copy</SidebarItem>
              <SidebarItem><AutoAwesomeMotionOutlinedIcon fontSize='small'/>Make template</SidebarItem>
              <SidebarItem><ShareOutlinedIcon fontSize='small'/>Share</SidebarItem>
              <SidebarItem><ArchiveOutlinedIcon fontSize='small'/>Archive</SidebarItem>
            </Stack>
          </Grid>
        </Grid>
      </Box>

    </Modal>
  )
}

export default ActiveCard
