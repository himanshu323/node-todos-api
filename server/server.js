const express=require("express");
const bodyParser=require("body-parser"); 
const {ObjectID}=require("mongodb");

let {mongoose}=require("./db/mongoose")
let {Todo}=require("./models/todos")
let {User}=require("./models/users")


let app=express();

let port=process.env.PORT || 3000;

app.use(bodyParser.json())


app.post("/todos",(req,resp)=>{

    let todo=new Todo({text:req.body.text});
    todo.save().then((res)=>{
        resp.send(res);
    },(error)=>{
        resp.status(400).send(error);
    })
})

app.get("/todos",(req,resp)=>{

    Todo.find().then((todos)=>{
        resp.send({
            todos
        })
    },(error)=>{
        resp.status(400).send("Hurray!!!"+error)
    }
)
})

app.get("/todos/:id",(req,resp)=>{

    if(!ObjectID.isValid(req.params.id)){
        return resp.status(400).send();
    }

    Todo.findById(req.params.id).then((res)=>{
        if(!res){
          return  resp.status(404).send();
        }
        resp.send({todo:res})
    }).catch((err)=>{
        resp.send("*****"+err);
    })

})




app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})

module.exports={app};
















// let newTodo=new Todo({text:" Hello Lunch Time",completed:"true"});

// newTodo.save().then((res)=>{
//     console.log("Saved:",res)
// },(err)=>{
//     console.log("unable to add" , err);
// })





// let newUser=new User
// ({email:"j"})

// newUser.save().then((res)=>{
//     console.log("res saved",res)
// },(err)=>{
//     console.log("Unabel to add",err);
// })