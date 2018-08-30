const {MongoClient,ObjectID}=require("mongodb")



MongoClient.connect("mongodb://localhost:27017",(err,client)=>{


    if(err){
        return console.log("Unable to connect to the MongoDB server");
    }

    console.log("Connected to the mongo DB server successfully");

   let db= client.db("TodosApp")


    // db.collection("Todos").findOneAndUpdate({_id:ObjectID("5b87d54c3f684ebbd1b47fb7")},{
    //     $set:{
    //         text:"Welcome to Note"
    //     }
    // },{
    //     returnOriginal:false
    // }).then((res)=>{
    //     console.log(res);
    // })

    db.collection("Users").findOneAndUpdate({_id:ObjectID("5b87b0f365c1fb5a8ea6591e")},{
        $inc:{
            age:9
        }
    },{
        returnOriginal:false
    }).then((res)=>{
        console.log(res);
    })

})