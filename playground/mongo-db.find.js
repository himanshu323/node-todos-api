const {MongoClient,ObjectID}=require("mongodb")



MongoClient.connect("mongodb://localhost:27017",(err,client)=>{


    if(err){
        return console.log("Unable to connect to the MongoDB server");
    }

    console.log("Connected to the mongo DB server successfully");

   let db= client.db("TodosApp")

//    db.collection("Todos").find().toArray().then((res)=>{
//        console.log(JSON.stringify(res))
//    },(error)=>{
//        console.log(error);
//    })
   
//    db.collection("Users").find().count().then((count)=>{
//        console.log("Documents count:"+count)
//    },(error)=>{
//        console.log('error');
//    })

//    db.collection("Todos").find({completed:true}).toArray().then((res)=>{
//        console.log(JSON.stringify(res));
//    })

   db.collection("Todos").find({_id:new ObjectID("5b87afc75f3a085a57a7eddf")}).toArray().then((res)=>{
       console.log(JSON.stringify(res));
   })
   

    //client.close();
})