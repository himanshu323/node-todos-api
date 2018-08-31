if(process.env.NODE_ENV==="production"){
    port=process.env.PORT;
    process.env.MONGO_URI="mongodb://him323:kolplp12@ds139632.mlab.com:39632/mongodb_test323"
}

else if(process.env.NODE_ENV==="test"){
    port=3000;
    process.env.MONGO_URI="mongodb://localhost:27017/TodosAPP_Mongoose_TestDB"
}
else{
    port=3000;
    process.env.MONGO_URI="mongodb://localhost:27017/TodosAPP_Mongoose"
}