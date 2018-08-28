import request from '@/utils/request'
// 角色api
export function getactorlist(params) {
  return request({
    url: `/role`,
    method: 'get',
    params
  })
}

export function addactor(dataform) {
  return request({
    url: `/role`,
    method: 'post',
    data: dataform
  })
}

export function updateactor(dataform) {
  return request({
    url: `/role`,
    method: 'put',
    data: dataform
  })
}

export function deleteactor(ids) {
  return request({
    url: `/role`,
    method: 'delete',
    data: ids
  })
}

export function getusersbyactorid(id) {
  return request({
    url: `/role/${id}/users`,
    method: 'get'
  })
}

export function assignusersbyactorid(id, userids) {
  return request({
    url: `/roles/${id}/user`,
    method: 'post',
    data: userids
  })
}

export function unassignusersbyactorid(id, userids) {
  return request({
    url: `/roles/${id}/user`,
    method: 'delete',
    data: userids
  })
}
