import { TextField } from '@mui/material'
import { useState } from 'react'

function ToggleFocusInput({ value, onChangedValue, inputFontSize = '16px', ...props }) {
  const [inputValue, setInputValue] = useState(value)

  const triggerBlur = () => {
    setInputValue(inputValue.trim())
    if (!inputValue || inputValue.trim() === value) {
      setInputValue(value)
      return
    }

    if (inputValue === value) return
    // console.log('value: ', value)
    // console.log('inputValue: ', inputValue)
    onChangedValue(inputValue)
  }
  // Ý tưởng là css TextField về dạng Typography khi không click (non-focus) và chuyển về dạng TextField khi click (focus) để không cần dùng state chuyển đổi
  return (
    <TextField
      id='toggle-focus-input-controlled'
      fullWidth
      variant="outlined"
      size="small"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={triggerBlur}
      {...props}
      sx={{
        '& label': {},
        '& input': { fontSize: inputFontSize, fontWeight: 'bold' },
        '& .MuiOutlinedInput-root': {
          background: 'transparent',
          '& fieldset': { borderColor: 'transparent' }
        },
        '& .MuiOutlinedInput-root:hover': {
          borderColor: 'transparent',
          '& fieldset': { borderColor: 'transparent' }
        },
        '& .MuiOutlinedInput-root.Mui-focused': {
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#33485D' : 'white',
          '& .fieldset': { borderColor: 'primary.main' }
        },
        '& .MuiOutlinedInput-input': {
          px: '6px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }
      }}
    />
  )
}

export default ToggleFocusInput