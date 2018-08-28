import request from '@/utils/request'

export function fetchorglazy(parentId) {
  return request({
    url: `/department/${parentId}/sub`,
    method: 'get'
  })
}

export function deleteorgbyid(ids) {
  return request({
    url: '/department',
    method: 'delete',
    data: ids
  })
}

export function updateorgbyid(orgform) {
  return request({
    url: '/department',
    method: 'put',
    data: orgform
  })
}

export function saveorgbypid(orgform) {
  return request({
    url: '/department',
    method: 'post',
    data: orgform
  })
}
