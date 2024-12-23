import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'
import Modal from '@mui/material/Modal'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import CancelIcon from '@mui/icons-material/Cancel'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validator'
import AbcIcon from '@mui/icons-material/Abc'
import FieldAlertError from '~/components/Form/FieldAlertError'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import { createNewBoardsAPI } from '~/apis'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: '12px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300]
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e9f2ff'
  }
}))

const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

function SidebarCreateBoardModal({ afterCreateNewBoard }) {
  const { control, register, handleSubmit, reset, formState: { errors } } = useForm()
  const [isOpen, setIsOpen] = useState(false)
  const handleOpenModal = () => setIsOpen(true)
  const handleCloseModal = () => {
    setIsOpen(false)
    // Reset the entire form when closing the Modal
    reset()
  }

  const submitCreateNewBoard = (data) => {
    createNewBoardsAPI(data).then(() => {
      handleCloseModal()
      afterCreateNewBoard()
    })
  }
  return (
    <>
      <SidebarItem onClick={handleOpenModal}>
        <LibraryAddIcon fontSize="small" />
        Create a new board
      </SidebarItem>

      <Modal open={isOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'white',
          boxShadow: 24,
          borderRadius: '8px',
          border: 'none',
          outline: 0,
          padding: '20px 30px',
          backgroundColor: ( theme) => theme.palette.mode === ' dark' ? ' #1A2027' : ' white'
        }}>
          <Box sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            cursor: 'pointer'
          }}>
            <CancelIcon
              color='error'
              sx={{ '&:hover': { color: 'error.light' } }}
              onClick={handleCloseModal}/>
          </Box>
          <Box id="modal-modal-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LibraryAddIcon />
            <Typography variant="h6" component="h2"> Create a new board</Typography>
          </Box>
          <Box id="modal-modal-description" sx={{ my: 2 }}>
            <form onSubmit={handleSubmit(submitCreateNewBoard)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <TextField
                    fullWidth
                    label="Title"
                    type="text"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AbcIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                    {...register('title', {
                      required: FIELD_REQUIRED_MESSAGE,
                      minLength: { value: 3, message: 'Min Length is 3 characters' },
                      maxLength: { value: 50, message: 'Max Length is 50 characters' }
                    })}
                    error={!!errors['title']}
                  />
                  <FieldAlertError errors={errors} fieldName={'title'} />
                </Box>
                <Box>

                  <TextField
                    fullWidth
                    label="Description"
                    type="text"
                    variant="outlined"
                    multiline
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DescriptionOutlinedIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                    {...register( 'description', {
                      required: FIELD_REQUIRED_MESSAGE,
                      minLength: { value: 3, message: 'Min Length is 3 characters' },
                      maxLength: { value: 255, message: 'Max Length is 255 characters' }
                    })}
                    error={!!errors['description']}
                  />
                  <FieldAlertError errors={errors} fieldName={'description'} />
                </Box>
                {/* Đối với RadioGroup của MUI thì không thể dùng register tương tự TextField được mà phải sử dụng <Controller /> và props controls của react-hook-form như cách dưới đây
                  https://stackoverflow.com/questions/73335872/react-hook-form-with-material-ui-radiogroup-selected-value-is-always-null/73336101#73336101
                  https://mui.com/material-ui/react-radio-button/
                */}
                <Controller
                  name="type"
                  defaultValue={BOARD_TYPES.PUBLIC}
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      row
                      onChange={( event, value ) => field.onChange(value)}
                      value={field.value}
                    >
                      <FormControlLabel
                        value={BOARD_TYPES.PUBLIC}
                        control={<Radio size='small' />}
                        label='Public'
                        labelPlacement='start'
                      />
                      <FormControlLabel
                        value={BOARD_TYPES.PRIVATE}
                        control={<Radio size='small' />}
                        label='Private'
                        labelPlacement='start'
                      />
                    </RadioGroup>
                  )}
                />
                <Box sx={{ alignSelf: 'flex-end' }}>
                  <Button
                    className='intereptor-loading'
                    variant='outlined'
                    type='submit'
                    color='primary'
                  >
                    Create
                  </Button>
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default SidebarCreateBoardModal