let apiRoot = ''
// console.log('process.env.BUILD_MODE', process.env)
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}
if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-api-8qng.onrender.com'
}
// export const API_ROOT = 'http://localhost:8017'
export const API_ROOT = apiRoot

export const CARD_MEMBER_ACTIONS = {
  REMOVE: 'remove',
  ADD: 'add'
}