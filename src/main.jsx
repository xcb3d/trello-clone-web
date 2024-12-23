import CssBaseline from '@mui/material/CssBaseline'
// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from './theme'

//React toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


//Material UI dialog confirm
import { ConfirmProvider } from 'material-ui-confirm'

//Redux
import { store } from './redux/store'
import { Provider } from 'react-redux'

//React router DOM
import { BrowserRouter } from 'react-router-dom'

// Cấu hình redux-persist
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
const persistor = persistStore(store)

// Kỹ thuật inject store
import { injectStore } from './utils/authorizeAxios.js'
injectStore(store)



ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter basename='/'>
        <CssVarsProvider theme={theme}>
          <ConfirmProvider>
            <CssBaseline />
            <App />
            <ToastContainer position='bottom-left' theme='colored' />
          </ConfirmProvider>
        </CssVarsProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
  // </React.StrictMode>
)
