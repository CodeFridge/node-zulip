// Generated by CoffeeScript 1.7.1
(function() {
  "use strict";
  var https, querystring;

  https = require('https');

  querystring = require('querystring');

  module.exports = {
    send: function(email, key, _arg, cb) {
      var content, req, requestOptions, subject, to, type, _ref;
      type = _arg.type, to = _arg.to, subject = _arg.subject, content = _arg.content;
      if ((_ref = !type) === 'stream' || _ref === 'private') {
        return cb("type must be stream or private");
      }
      if (type === 'stream' && (subject == null)) {
        return cb("subject is required for a stremed message");
      }
      if ((email == null) || (key == null)) {
        return cb("bot_key and bot_email are required");
      }
      if (content == null) {
        return cb("content is required");
      }
      requestOptions = {
        host: 'api.zulip.com',
        port: 443,
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + new Buffer(email + ':' + key).toString('base64')
        }
      };
      req = https.request(requestOptions, function(res) {
        var data;
        data = "";
        res.on('error', cb);
        res.on('data', function(chunk) {
          return data += chunk;
        });
        return res.on('end', function() {
          var e;
          if (res.headers['content-type'] === 'application/json') {
            try {
              data = JSON.parse(data);
            } catch (_error) {
              e = _error;
              cb(e, data);
            }
          }
          if (res.statusCode !== 200) {
            return cb(data);
          } else {
            return cb(null, data);
          }
        });
      });
      req.on('error', cb);
      req.write(querystring.stringify({
        type: type,
        to: to,
        subject: subject,
        content: content
      }));
      return req.end();
    }
  };

}).call(this);
