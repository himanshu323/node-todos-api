const mongoose=require("mongoose");

mongoose.connect("mongodb://him323:ko12lplp@ds139632.mlab.com:39632/mongodb_test323");

//||"mongodb://localhost:27017/TodosAPP_Mongoose

let db=mongoose.connection;
//db.on('error',console.log("unable to connect"));
db.once('open',()=>{
    console.log("Connected");
})

module.exports={mongoose}