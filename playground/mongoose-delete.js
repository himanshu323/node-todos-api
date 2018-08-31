const {mongoose}=require("../server/db/mongoose");
const {Todo}=require("../server/models/todos")
const {ObjectID}=require("mongodb");


// Todo.findOneAndRemove({_id:"5b88efc210087b6c81069da7"}).then((res)=>{
//    console.log("klhkl");
//     console.log(res);
// })

// Todo.findByIdAndRemove("5b89136d40dab26fbeaa752d").then((res)=>{
//     console.log(res);
// })


Todo.remove({}).then((res)=>{
    console.log(res);
})