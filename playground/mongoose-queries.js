const {mongoose}=require("../server/db/mongoose");
const {Todo}=require("../server/models/todos")
const {ObjectID}=require("mongodb");


let id="6b88d959e6ba656994e5b6fc";

if(!ObjectID.isValid(id)){
    console.log("Not valid ID")
}

// Todo.find({
//     completed:false
// }).then((todos)=>{
//     console.log("Todos", todos)
// })

// Todo.findById(id).then((res)=>{
//     console.log(res);
// })

Todo.findOne({
    _id:id
}).then((res)=>{

    if(!res){
        return console.log("Todo doesn't exist")
    }
    console.log(res);
}).catch((error)=>{
    console.log(error);
})