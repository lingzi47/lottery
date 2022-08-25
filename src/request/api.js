import request from '@/request/request'

// 请求首页的数据
export const GetHomeList = () => request.post('/newapi/luck/luck')
export const GetcrowdList = (params) => request.get('/goodto', { params })
// export const GetcrowdList=()=>request.get('/goodto?goods_id=89')
