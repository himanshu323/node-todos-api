const {MongoClient,ObjectID}=require("mongodb")



MongoClient.connect("mongodb://localhost:27017",(err,client)=>{


    if(err){
        return console.log("Unable to connect to the MongoDB server");
    }

    console.log("Connected to the mongo DB server successfully");

   let db= client.db("TodosApp")


//    db.collection("Todos").deleteOne({text:"Hello Note"}).then((res)=>{
//        console.log(res);
//    })


//    db.collection("Todos").deleteMany({text:"Hello Note"}).then((res)=>{
//        console.log(res);
//    })

db.collection("Todos").findOneAndDelete({text:"Bye Note"}).then((res)=>{
    console.log(res);
})
})