import axios from 'axios'
export const bgInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'dev' ? '/bing' : 'https://cn.bing.com',
  timeout: 10000
})
export const requestBgList = (): Promise<any> => {
  return bgInstance.request({
    url: '/HPImageArchive.aspx?format=js&idx=0&n=3',
    method: 'get'
  })
}
