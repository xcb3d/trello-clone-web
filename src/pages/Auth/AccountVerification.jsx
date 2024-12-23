import { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/pageLoadingSpinner'
import { verifyUserAPI } from '~/apis'

function AccountVerification() {
  // Lấy email và token từ url
  let [searchParams] = useSearchParams()
  const email = searchParams.get('email')
  const token = searchParams.get('token')

  // Tạo 1 biến state để biết đã verify hay chưa
  const [isVerified, setIsVerified] = useState(false)

  // Gọi API để verify
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => {setIsVerified(true)})
    }
  }, [email, token])

  // Nếu url có vấn đề, không tồn tại 1 trong 2 giá trị email hoặc token thì chuyển hướng sang 404
  if (!email || !token) {
    return <Navigate to="/404" />
  }
  // Néu chưa verify thì hiện loading
  if (!isVerified) {
    return <PageLoadingSpinner caption="Verifing your account"/>
  }
  // Cuối cùng nếu không gặp vấn đề gì và verify thành công thì điều hướng trang login với giá trị verifiedEmail
  return (
    <Navigate to={`/login?verifiedEmail=${email}`} />
  )
}

export default AccountVerification