import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElement } from './formatter'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'

// Không thể import { store } from '~/redux/store' theo cách thông thường ở đây
// Giải pháp: Inject store: Là 1 kỹ thuật sử dụng khi cần sử dụng biến redux store ở các file ngoài phạm vi component như file authorizeAxios.js
// Hiểu đơn giản: Hiểu đơn giản khi ứng dụng bắt đầu chạy vào main.jsx đầu tiên, từ bên đó chúng ta gọi hàm injectStore ngay lập tức để gán biến mainStore vào biến axiosReduxStore cục bộ trong file này

let axiosReduxStore
export const injectStore = mainStore => { axiosReduxStore = mainStore }


const authorizeAxiosInstance = axios.create()
//Thời gian chờ tối đa 1 request
authorizeAxiosInstance.defaults.timeout = 1000*60*10
//withCredentials cho phép axios tự động gửi cookies trong mỗi request tới BE (Phục vụ cho JWT)
authorizeAxiosInstance.defaults.withCredentials = true


//Interceptor request: Can thiệp vào giữa những request API
authorizeAxiosInstance.interceptors.request.use((config) => {
  // Kỹ thuật chặn spam click
  interceptorLoadingElement(true)
  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

// Khởi tạo promise cho việc tạo api refresh token
// Mục đích tạo promise này để khi nào gọi api refresh token xong thì sẽ retry lại nhiều api bị lỗi trước đó

let refreshTokenPromise = null

//Interceptor response: Can thiệp vào giữa những response API
authorizeAxiosInstance.interceptors.response.use( (response) => {
  interceptorLoadingElement(false)
  return response
}, (error) => {

  interceptorLoadingElement(false)

  // Trường hợp 1: Nếu như nhận mã 401 từ BE, thì gọi api đăng xuất

  if (error?.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUserAPI(false))
  }

  // Trường hợp 2: Nếu như nhân mã 410 từ BE, thì gọi api refresh token
  // Đầu tiên lấy được các request api đang bị lỗi thông qua error.config
  const originalRequests = error.config
  if (error?.response?.status === 410 && !originalRequests._retry) {
    originalRequests._retry = true

    // Kiểm tra nếu chưa có refreshTokenPromise thì thực hiện gán việc gọi api refresh_token đồng thời gán vào cho cái refreshTokenPromise
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(data => {
          return data?.accessToken
        })
        .catch((_error) => {
          // Nếu nhận bất cứ lỗi nào thì chủ động đăng xuất
          axiosReduxStore.dispatch(logoutUserAPI(false))
          return Promise.reject(_error)
        })
        .finally(() => {
          // Dù có thành công hay lỗi vẫn gán refreshTokenPromise vào null
          refreshTokenPromise = null
        })
    }

    // Cần return trường hợp refreshTokenPromise chạy thành công và xử lý ở đây
    return refreshTokenPromise.then(accessToken => {
      // Bước 1: Với trường hợp dự án lưu accessToken vào localStorage thì viết logic xử lý ở đây
      // Hiện tại không cần bước 1 vì đưa accessToken vào cookie sau khi api refreshToken được gọi thành công


      // Bước 2: Bước quan trọng: Return lại axios instance của chúng ta kết hợp với những originalRequest để gọi lại những api ban đầu bị lỗi
      return authorizeAxiosInstance(originalRequests)
    })
  }
  // Xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây

  let errorMessage = error.message
  if (error.response.data.message) {
    errorMessage = error.response.data.message
  }

  if (error.response.status !== 410) {
    toast.error(errorMessage)
  }

  // if (error.response.status === 404) {
  //   window.history.replaceState({}, '', '/404')
  //   window.dispatchEvent(new PopStateEvent('popstate'))
  // }

  return Promise.reject(error)
})

export default authorizeAxiosInstance