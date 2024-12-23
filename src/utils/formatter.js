export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column?._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}

// Kỹ thuật dùng css pointer-event để chặn user spam click vào bất kì chỗ nào có hành động click gọi api
// Đây là kĩ thuật sử dụng tận dụng Axios Interceptor và CSS pointer-event để chỉ code xử lý 1 lần cho toàn dự án
// Cách sử dụng thêm tất cả cái link và button có hành động gọi api class 'intereptor-loading'
export const interceptorLoadingElement = (calling) => {
  const elements = document.querySelectorAll('intereptor-loading')
  for (let i = 0; i < elements.length; i++) {
    if (calling) {
      // Nếu đang trong thời gian chờ API (calling === true) thì sẽ làm mờ phần tử và chặn click bằng css pointer-event
      elements[i].style.opacity = '0.5'
      elements[i].style.pointerEvents = 'none'
    } else {
      // Ngược lại trả về như ban đầu
      elements[i].style.opacity = 'initial'
      elements[i].style.pointerEvents = 'initial'
    }
  }
}