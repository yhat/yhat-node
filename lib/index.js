var request = require('request');

function createClient(username, apikey, env) {
    var client = {};
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
    client.env = client.env.replace(/\/$/, "")
                           .replace("://", "://" + username + ":" + apikey + "@");

    // authenticate
    request.get(client.env + "/", function(err, response, body) {
      if (response.statusCode > 300) {
        throw "Incorrect username/apikey!"
      }
    });

    client.predict = function(modelName, data, fn) {
      var endpoint = "/" + client.username + "/models/" + modelName + "/";
      request.post({ uri: client.env + endpoint, json: data }, function(err, response, body) {
        try {
          fn(null, body);
        } catch(err) {
          fn(new Error("Bad respsonse from host: " + err.toString()), null);
        }        
      });
    }
    return client;
}

module.exports = {
    init: createClient
}