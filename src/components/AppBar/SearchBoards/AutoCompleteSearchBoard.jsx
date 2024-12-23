import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import { fetchBoardsAPI } from '~/apis'
import { useDebounceFn } from '~/customHooks/useDebounceFn'


function AutoCompleteSearchBoard() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [boards, setBoards] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) {
      setBoards(null)
    }
  }, [open])

  // Xử lý nhận data từ input và gọi API trả về kết quả
  const handleInputSearchChange = (event) => {
    const searchValue = event?.target.value
    if (!searchValue) return
    // console.log('searchValue: ', searchValue)

    // Dùng createSearchParams để tạo searchPath chuẩn với q[title] gọi API
    const searchPath = `?${createSearchParams({ 'q[title]': searchValue })}`
    // console.log('searchPath: ', searchPath)

    setLoading(true)

    fetchBoardsAPI(searchPath)
      .then(res => {
        setBoards(res.boards || [])
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const debounceSearchBoard = useDebounceFn(handleInputSearchChange, 1000)

  // useEffect(() => {
  //   navigate(location.pathname)
  // }, [location])

  // Chọn board sẽ điều hướng tới nó
  const handleSelectedBoard = (event, selectedBoard) => {
    if (selectedBoard) {
      navigate(`/boards/${selectedBoard._id}`)
      // navigate(`/boards/${selectedBoard._id}`, { replace: true })
    }
  }
  return (
    <Autocomplete
      isOptionEqualToValue={(option, value) => option._id === value._id}
      sx={{ width: 220 }}
      id="asynchoronous-search-board"
      noOptionsText={!boards ? 'Type to search board' : 'No board found'}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      getOptionLabel={(board) => board?.title}
      options={boards || []}
      loading={loading}
      onInputChange={debounceSearchBoard}
      onChange={handleSelectedBoard}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Type to search"
          size="small"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="white"/>
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? <CircularProgress sx={{ color: 'white' }} size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
          sx={{
            '& label': { color: 'white' },
            '& input': { color: 'white' },
            '& label.Mui-focused': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' }
            },
            '.MuiSvgIcon-root': { color: 'white' }
          }}
        />
      )}
    />

  )
}

export default AutoCompleteSearchBoard