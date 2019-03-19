// import axios from '@/utils/request'
// import axios from 'axios'
// 设置getjson同步
// export async function getJson() {
//   try {
//     const response = await axios.get('../../dist/static/config.json')
//     var data = response.data
//     return data.url
//   } catch (error) {
//     console.error(error)
//   }
// }
// export async function getJson() {
//   try {
//     const response = await axios.get('../../static/config.json')
//     return response.data.url
//   } catch (error) {
//     console.error(error)
//   }
//   var ur = ''
//   axios.get('../../dist/static/config.json').then(response => {
//     var data = response.data
//     console.log(data)
//     ur = data.url
//     return ur
//   })
// }
// function mycallback(data) {
//   console.log(data.url)
//   return data.url
// }
// export const data = getJson().then((data) => {
//   console.log(data)
//   return data
// })
// getJson()
import $ from 'jquery'
export function getUrl() {
  var service_url = ''
  // 设置getJson同步
  $.ajaxSettings.async = false
  $.getJSON('../static/config.json', function(res) {
    service_url = res.url
  })
  return service_url
}
