import request from '@/utils/request'
// 用户api
export function getuserlist(params) {
  return request({
    url: `/users`,
    method: 'get',
    params
  })
}

export function adduser(dataform) {
  return request({
    url: `/user`,
    method: 'post',
    data: dataform
  })
}

export function updateuser(dataform) {
  return request({
    url: `/user`,
    method: 'put',
    data: dataform
  })
}

export function deleteuser(ids) {
  return request({
    url: `/user`,
    method: 'delete',
    data: ids
  })
}

export function getuserbydept(id) {
  return request({
    url: `/department/${id}/users`,
    method: 'get'
  })
}

export function assignactorbyid(id, actorids) {
  return request({
    url: `/user/${id}/roles`,
    method: 'post',
    data: actorids
  })
}
