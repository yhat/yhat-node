/*
    Heavily inspired by the Mixpanel node client
    https://github.com/mixpanel/mixpanel-node
*/

var http            = require('http'),
    querystring     = require('querystring'),
    Buffer          = require('buffer').Buffer;

/*
 * Check to make sure the user had provided a valid username/apikey combination
 * and throw an exception if not.
 */
var authenticate = function(username, apikey, env) {
    var auth = username + ":" + apikey;
    auth = "Basic " + new Buffer(auth).toString("base64");

    var query = {
        username: username,
        apikey: apikey
    };
    // data is passed as url params, not a payload
    var endpoint = "/verify?" + querystring.stringify(query);
    
    var requestOptions = {
        headers: {
            "Authorization": auth,
            "Content-Type": "application/json"
        },
        host: env,
        method: "POST",
        path: endpoint,
        port: 80
    };

    http.request(requestOptions, function(res) {
        var data = "";
        res.on('data', function(chunk) {
            data += chunk;
        });
        res.on('end',function(){
            try {
                data = JSON.parse(data);
            } catch (err) {
                throw "Bad response from host " + env + ": " + e;
            }
            if (data.success !== "true") {
                throw "Incorrect username/apikey!"
            }
        });
    }).on('error', function(e){
        throw "Could not connect to host " + env + ": " + e;
    }).end();
}

var createClient = function(username, apikey, env) {
    if (!username) {
        throw new Error("yhat needs a userame: `init(username, apikey)`");
    }
    if (!apikey) {
        throw new Error("yhat needs a apikey: `init(username, apikey)`");
    }
    
    var client = {};
    client.username = username;
    client.apikey = apikey;
    client.env = env || "cloud.yhathq.com";
    // Remove "http://" and trailing "/"
    client.env = client.env.replace(/^http:\/\//, "").replace(/\/$/, "")

    // Authenticate the user
    authenticate(client.username, client.apikey, client.env);

    /*
     * Query a ScienceOps server for a prediction
     */
    client.predict = function(modelName, data, fn) {
        fn = fn || function() {};

        var auth = client.username + ":" + client.apikey;
        auth = 'Basic ' + new Buffer(auth).toString('base64');

        // The data to be predicted upon is passed as a payload
        var payload = new Buffer(JSON.stringify(data));
        var requestOptions = {
            host: client.env,
            path: "/" + client.username + "/models/" + modelName + "/",
            port: 80,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': payload.length,
                'Authorization': auth
            }
        };

        var body = "";
        // Construct a request
        var req = http.request(requestOptions, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                body += chunk;
            });
            // Parse JSON response from the server and return it to the user
            res.on('end', function() {
                try {
                    body = JSON.parse(body);
                    fn(null, body);
                } catch(err) {
                    fn(new Error("Bad respsonse from host " + client.env + ": " + err.toString()), null);
                }
            });
        });
        req.on("error", function(e){
            fn(new Error("Could not connect to host " + client.env + ": " + e.toString()), null);
        });
        // Pass the payload (data to be predicted on) to the server
        req.write(payload);
        req.end();
    }
    
    return client;
};

module.exports = {
    init: createClient
}

