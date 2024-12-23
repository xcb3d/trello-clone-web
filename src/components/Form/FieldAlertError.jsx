import Alert from '@mui/material/Alert'

function FieldAlertError({ errors, fieldName }) {
  if (!errors || !errors[fieldName]) {
    return null
  }
  return (
    <Alert severity='error' sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
      {errors[fieldName].message}
    </Alert>
  )
}

export default FieldAlertError