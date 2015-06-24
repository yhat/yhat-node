var yhat = require("./lib/index");

data = {
    name: "Greg"
}


yh = yhat.init("{}",
               "{}",
               "https://sandbox.yhathq.com/");

yh.predict("HolaWorld", data, function(err, rsp) {
    if (err) {
        console.log("Error connecting to server: " + err);
    } else {
        console.log("this is the result:", JSON.stringify(rsp, null, 2));
    }
});

