import { styled } from '@mui/material/styles'
import React from 'react'

const HiddenInputStyles = styled('input')({
  display: 'none',
})

function VisuallyHiddenInput({ ...props }) {
  return (
    <HiddenInputStyles {...props} />
  )
}

export default VisuallyHiddenInput