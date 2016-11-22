import request from 'request-promise'
import credentials from '../../credentials.json'
export default function getWechatAccessToken (code) {
  const options = {
    method: 'get',
    url: 'https://api.weixin.qq.com/sns/oauth2/access_token',
    json: true,
    qs: {
      appid: credentials.wechatAppID,
      secret: credentials.wechatSecret,
      grant_type: 'authorization_code',
      code
    }
  }

  return request(options).then((res) => {
    if (res.errcode !== undefined) {
      throw new Error(res.errmsg)
    }
    return res
  })

}
