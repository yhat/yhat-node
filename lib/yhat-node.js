var http            = require('http'),
    querystring     = require('querystring'),
    Buffer          = require('buffer').Buffer;


var create_client = function(username, apikey) {
    if (!username) {
        throw new Error("yhat needs a userame: `init(username, apikey)`");
    }
    if (!apikey) {
        throw new Error("yhat needs a apikey: `init(username, apikey)`");
    }
    
    var models = {};
    models.username = username;
    models.apikey = apikey;

    models.get = function(endpoint, request_data, fn) {
        fn = fn || function () {};
        
        request_data.username = models.username;
        request_data.apikey = models.apikey;
        
        var request_options = {
            host: 'api.yhathq.com', 
            port: 80,
            headers: {}
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

        var payload = new Buffer(JSON.stringify(data));
        var request_options = {
            host: 'api.yhathq.com',
            port: 80,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': payload.length
            }
        };

        var query = querystring.stringify(request_data);
        request_options.path = [endpoint,"?",query].join("");

        var req = http.request(request_options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
              fn(JSON.parse(chunk))
            });
        });
        req.write(payload);
        req.end();
    }

    models.predict = function(model, version, data, fn) {
        var params = {
            model: model,
            version: version,
        };
        models.post('/predict', data, params, fn)
    }
    
    models.show_models = function(fn) {
        models.get("/showmodels", {}, fn)
    }

    return models;
};

module.exports = {
    init: create_client
}

