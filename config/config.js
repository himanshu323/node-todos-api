

let env=process.env.NODE_ENV || "development";

if(env==="development" || env==="test"){

    const config=require("./config.json");
           let envValue= config[env];

           Object.keys(envValue).forEach((key)=>{
               process.env[key]=envValue[key];
           })
}

// if(env==="test"){
//         port=3000;
//         process.env.MONGO_URI="mongodb://localhost:27017/TodosAPP_Mongoose_TestDB"
// }
// else if(env==="development"){
//     port=3000;
//     process.env.MONGO_URI="mongodb://localhost:27017/TodosAPP_Mongoose"

// }

//heroku config:set MONGODB_URI=somevalue

// if(process.env.NODE_ENV==="production"){
//     port=process.env.PORT;
//     process.env.MONGO_URI="mongodb://him323:kolplp12@ds139632.mlab.com:39632/mongodb_test323"
// }

// else if(process.env.NODE_ENV==="test"){
//     port=3000;
//     process.env.MONGO_URI="mongodb://localhost:27017/TodosAPP_Mongoose_TestDB"
// }
// else{
//     port=3000;
//     process.env.MONGO_URI="mongodb://localhost:27017/TodosAPP_Mongoose"
// }