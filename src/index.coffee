https = require('https')
querystring = require('querystring')

module.exports =
  send : (email, key, {type, to, subject, content}, cb)->
    if !type in ['stream', 'private']
      return cb("type must be stream or private")

    if type == 'stream' and !subject?
      return cb("subject is required for a stremed message")

    if !email? or !key?
      return cb("bot_key and bot_email are required")

    if !content?
      return cb("content is required")

    requestOptions = {
      host: 'api.zulip.com'
      port: 443
      path: '/v1/messages'
      method: 'POST'
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + new Buffer(email + ':' + key).toString('base64')
      }
    }

    req = https.request requestOptions, (res)->
      data = ""

      res.on 'error', cb

      res.on 'data', (chunk)->
        data+= chunk

      res.on 'end', ()->
        if res.headers['content-type'] == 'application/json'
          try
            data = JSON.parse data

          catch e
            cb e, data

        if res.statusCode != 200
          cb data
        else
          cb null, data

    req.on 'error', cb
    req.write querystring.stringify {type, to, subject, content}
    req.end()
