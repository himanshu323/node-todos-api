const mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/TodosAPP_Mongoose");

let db=mongoose.connection;
//db.on('error',console.log("unable to connect"));
db.once('open',()=>{
    console.log("Connected");
})

module.exports={mongoose}