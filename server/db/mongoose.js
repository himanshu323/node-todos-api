const mongoose=require("mongoose");

mongoose.connect(process.env.PORT?"mongodb://him323:kolplp12@ds139632.mlab.com:39632/mongodb_test323":"mongodb://localhost:27017/TodosAPP_Mongoose");

//||"mongodb://localhost:27017/TodosAPP_Mongoose

let db=mongoose.connection;
//db.on('error',console.log("unable to connect"));
db.once('open',()=>{
    console.log("Connected");
})

module.exports={mongoose}