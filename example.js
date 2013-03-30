var yhat = require("./lib/yhat");

data = {
    "data": {
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
}


yh = yhat.init("{YOUR USERNAME}", "{YOUR API KEY}")

yh.predict("rentPredictor", data, function(rsp) {
    console.log("this is the result:", rsp)
})

yh.show_models(console.log)
