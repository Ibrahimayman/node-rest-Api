/**
 * Created by Ibrahim Ayman on 29/06/2017.
 */
var mongoose = require("mongoose");

mongoose.promise = global.promise;
mongoose.connect("mongodb://localhost/bookAPI", function (err) {
    if (err) {
        console.log(err)
    }
    else {
        console.log("connected to Db");
    }
}); // mongoose contains connection all time

module.exports = {mongoose};