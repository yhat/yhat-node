

var yhat = require("./lib/yhat-node")

var yh = yhat.init("greg", "blah", "yhat-aa02a554-732313416.us-west-1.elb.amazonaws.com")
var data = {
  home_lead: [10],
  time_remaining: [342]
};

data = {"home_lead": [1], "time_remaining": [2000]}
yh.predict('nbaPredictor', 1, data, function(data) {
  console.log(data);
});
