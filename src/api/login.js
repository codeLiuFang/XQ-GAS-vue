import request from '@/utils/request'
import { Base64 } from 'js-base64'

export function loginByUsername(username, password) {
  // password base64加密
  password = Base64.encode(password)
  const data = {
    username,
    password
  }

  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

// export function getUserInfo(token) {
//   return request({
//     url: '/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

export function getUserInfo(id) {
  return request({
    url: `/user/${id}/roles`,
    method: 'get'
  })
}
