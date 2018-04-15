var http = require("http");

var options = {
  "method": "POST",
  "hostname": "localhost",
  "port": "8080",
  "path": "/api/v1/watch/begin",
  "headers": {
    "content-type": "application/json",
    "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzSW4iOiIxIGRheSIsImRhdGEiOnsidXNlcm5hbWUiOiJ1c2VyMSIsInVzZXJJZCI6MSwidW5pb25JZCI6MSwiZW1haWwiOiJ1c2VyMUBlbWFpbC5jb20iLCJmaXJzdE5hbWUiOiJIZWxsbyIsImxhc3ROYW1lIjoiV29ybGQgMSIsInBlcm1pc3Npb25zIjo2NzEwODg2M30sImlhdCI6MTUyMzgwNjAyMH0.lGJ2o-4JpxPo3KQygjKsyQT3h3DlhJQY5QNIHo_R2zw"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.write(JSON.stringify({ startMessage: 'Hello world. Lets rock n roll!' }));
req.end();