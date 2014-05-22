/*
    Heavily inspired by the Mixpanel node client
    https://github.com/mixpanel/mixpanel-node
*/

var http            = require('http'),
    querystring     = require('querystring'),
    Buffer          = require('buffer').Buffer;


var create_client = function(username, apikey, env) {
    if (!username) {
        throw new Error("yhat needs a userame: `init(username, apikey)`");
    }
    if (!apikey) {
        throw new Error("yhat needs a apikey: `init(username, apikey)`");
    }
    
    var models = {};
    models.username = username;
    models.apikey = apikey;
    models.env = env || "cloud.yhathq.com";

    models.get = function(endpoint, request_data, fn) {
        fn = fn || function () {};
        
        request_data.username = models.username;
        request_data.apikey = models.apikey;
        
        var auth = request_data.username + ":" + request_data.apikey;
        auth = 'Basic ' + new Buffer(auth).toString('base64');
        
        var request_options = {
            host: models.env, 
            port: 80,
            headers: {
              'Authorization': auth
            }
        }
        var query = querystring.stringify(request_data);
        request_options.path = [endpoint,"?",query].join("");
        
        http.get(request_options, function(res) {
            var data = "";
            res.on('data', function(chunk) {
                data += chunk;
            })
            res.on('end', function() {
                var e = (data != '1') ? new Error("yhat Server Error: " + data) : undefined;
                fn(JSON.parse(data))
            })
        }).on('error', function(e) {
            console.log("Got Error: " + e.message);
            callback(e);
        })
    }

    models.post = function(endpoint, data, request_data, fn) {
        fn = fn || function() {};

        request_data.username = models.username;
        request_data.apikey = models.apikey;

        var auth = request_data.username + ":" + request_data.apikey;
        auth = 'Basic ' + new Buffer(auth).toString('base64');

        var payload = new Buffer(JSON.stringify(data));
        var request_options = {
            host: models.env,
            port: 80,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': payload.length,
                'Authorization': auth
            }
        };

        var query = querystring.stringify(request_data);
        if (models.env!="api.yhathq.com") {
          request_options.path = [
            '/' + request_data.username,
            endpoint,
            request_data.model
          ].join("/") + "/";
        } else {
          request_options.path = [endpoint,"?",query].join("");
        }

        var body = "";
        var req = http.request(request_options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
              body += chunk;
            });
            res.on('end', function() {
              try {
                body = JSON.parse(body);
                fn(body);
              } catch(err) {
                fn({ status: "error", message: err.toString() });
              }
            });
        });
        req.write(JSON.stringify(data));
        req.end();
    }

    models.predict = function(model, version, data, fn) {
        var params = {
            model: model,
            version: version,
        };
        if (models.env=="api.yhathq.com") {
          models.post('/predict', data, params, fn);
        } else {
          models.post('models', data, params, fn);
        }
    }
    
    models.show_models = function(fn) {
        models.get("/showmodels", {}, fn)
    }

    return models;
};

module.exports = {
    init: create_client
}

