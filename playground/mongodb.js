const {MongoClient,ObjectId}=require("mongodb")

let testId=new ObjectId();
console.log(testId);

MongoClient.connect("mongodb://localhost:27017",(err,client)=>{


    if(err){
        return console.log("Unable to connect to the MongoDB server");
    }

    console.log("Connected to the mongo DB server successfully");

    client.db("TodosApp").collection("Todos").insertOne({
        text:"Hello Note",
        completed:false
    },(err,res)=>{
        if(err){
           return console.log("Unable to insert record");
        }
        console.log(JSON.stringify(res.ops));
    })

    client.db("TodosApp").collection("Users").insertOne({_id:testId,name:"TestUser",age:32,location:"New york"},(err,res)=>{
        
        if(err){
            return console.log("Error inserting record ",err.errmsg)
        }
        console.log(JSON.stringify(res.ops))
        console.log(res.ops[0]._id.getTimestamp());
    })

    //client.close();
})