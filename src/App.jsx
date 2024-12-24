import NotFound from './pages/404/NotFound'
import AccountVerification from './pages/Auth/AccountVerification'
import Auth from './pages/Auth/Auth'
import Board from './pages/Boards/_id'
import { Routes, Route, Navigate, Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Settings from './pages/Settings/Settings'
import Boards from './pages/Boards'

export const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to="/login" replace={true} />
  }
  return <Outlet />
}

function App() {
  const user = useSelector(selectCurrentUser)
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Navigate to="/boards" replace={true} />,
    },
    {
      element: <ProtectedRoute user={user} />,
      children: [
        {
          path: '/settings/account',
          element: <Settings />,
        },
        {
          path: '/settings/security',
          element: <Settings />,
        },
        {
          path: '/boards',
          element: <Boards />,
        },
        {
          path: '/boards/:boardId',
          element: <Board />,
        },
      ],
    },
    {
      path: '/login',
      element: <Auth />,
    },
    {
      path: '/register',
      element: <Auth />,
    },
    {
      path: '/account/verification',
      element: <AccountVerification />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);
  

  return (
  <RouterProvider router={router} />
    // <Routes>
    //   <Route path='/' element={
    //     <Navigate to="/boards" replace={true} />
    //   }>
    //   </Route>
    //   <Route element={<ProtectedRoute user={user} />}>
    //     {/* <Outlet /> của react-router-dom sẽ chạy vào các child route trong này*/}
    //     {/* User settings */}
    //     <Route path="/settings/account" element={<Settings />} />
    //     <Route path="/settings/security" element={<Settings />} />
    //     {/* Boards */}
    //     <Route path="/boards" element={<Boards />} />
    //     <Route path="/boards/:boardId" element={<Board />} />
    //   </Route>
    //   <Route path="login" element={<Auth />} />
    //   <Route path="register" element={<Auth />} />
    //   <Route path="account/verification" element={<AccountVerification />} />
    //   <Route path="*" element={<NotFound />} />
    // </Routes>
  )
}

export default App
