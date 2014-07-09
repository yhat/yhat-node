yhat-node
=========

A node js client for the yhat ScienceOps API

Installation
=========

```
$ npm install yhat
```

Examples
=========

```javascript
var yhat = require("yhat");

data = {
    'address_type': 2.5,
    'building_age': 4.5,
    'floor_space': 50.5,
    'floor_space2': 1.5,
    'has_bathroom': 0.5,
    'has_central_heating': 1.5,
    'has_hot_water': 0.5,
    'kitchen_type': 0.5,
    'neighborhood_type': 2.0,
    'rooms': 1.0,
    'tiled_bathroom': 0.5,
    'window_type': 0.5,
    'year_built': 1971.5,
    'years_on_lease': 2.5
}


yh = yhat.init("{YOUR USERNAME}",
               "{YOUR API KEY}",
               "http://cloud.yhathq.com/");

yh.predict("rentPredictor", data, function(err, rsp) {
    if (err) {
        console.log("Error connecting to server: " + err);
    } else {
        console.log("this is the result:", JSON.stringify(rsp));
    }
});
```

[![Analytics](https://ga-beacon.appspot.com/UA-46996803-1/yhat-node/README.md)](https://github.com/yhat/yhat-node) 
