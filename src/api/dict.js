import request from '@/utils/request'

// 字典接口
export function adddict(dictform) {
  return request({
    url: `/dictionary`,
    method: 'post',
    data: dictform
  })
}

export function getdictlist(params) {
  return request({
    url: `/dictionary`,
    method: 'get',
    params
  })
}

export function deletedict(ids) {
  return request({
    url: `/dictionary`,
    method: 'delete',
    data: ids
  })
}

export function updatedict(dictform) {
  return request({
    url: `/dictionary`,
    method: 'put',
    data: dictform
  })
}
// 字典数据接口
export function getdictdatalist(params) {
  return request({
    url: `/dictionaryData`,
    method: 'get',
    params
  })
}

export function adddictdata(dictform) {
  return request({
    url: `/dictionaryData`,
    method: 'post',
    data: dictform
  })
}

export function updatedictdata(dictform) {
  return request({
    url: `/dictionaryData`,
    method: 'put',
    data: dictform
  })
}

export function deletedictdata(ids) {
  return request({
    url: `/dictionaryData`,
    method: 'delete',
    data: ids
  })
}
