const express=require("express");
const bodyParser=require("body-parser"); 
const {ObjectID}=require("mongodb");
const _=require("lodash");


let config=require("../config/config")
let {mongoose}=require("./db/mongoose")
let {Todo}=require("./models/todos")
let {User}=require("./models/users")
let {authenticate}=require("./middlewares/authenticate");


let app=express();

let port=process.env.PORT || 3000;

app.use(bodyParser.json())


app.post("/todos",authenticate,(req,resp)=>{

    let todo=new Todo({
        _creator:req.user._id,
        text:req.body.text,
        });
    todo.save().then((res)=>{
        resp.send(res);
    },(error)=>{
        resp.status(400).send(error);
    })
})

app.get("/todos",authenticate,(req,resp)=>{

    Todo.find({_creator:req.user._id}).then((todos)=>{
        resp.send({
            todos
        })
    },(error)=>{
        resp.status(400).send("Hurray!!!"+error)
    }
)
})

app.get("/todos/:id",authenticate,(req,resp)=>{

    if(!ObjectID.isValid(req.params.id)){
        return resp.status(400).send();
    }

    Todo.findOne({_id:req.params.id,_creator:req.user._id}).then((res)=>{
        if(!res){
          return  resp.status(404).send();
        }
        resp.send({todo:res})
    }).catch((err)=>{
        resp.send("*****"+err);
    })

})

app.delete("/todos/:id",authenticate,(req,resp)=>{
let id=req.params.id;
    if(!ObjectID.isValid(id)){
        return resp.status(400).send();
    }

    Todo.findOneAndRemove({_id:id,_creator:req.user._id}).then((todo)=>{

        if(!todo){
            return resp.status(404).send();
        }
        resp.send({todo});
    })
})

app.patch("/todos/:id",authenticate,(req,resp)=>{

    let id=req.params.id;

    if(!ObjectID.isValid(id)){
        return resp.status(400).send();
    }
        let body=_.pick(req.body,['text','completed']);

        if(body.completed && _.isBoolean(body.completed)){
            body.completedAt=new Date().getTime();
        }
        else{
            body.completed=false;
            body.completedAt=null;
        }

        Todo.findOneAndUpdate({_id:id,_creator:req.user._id},{
            $set:body
        },{new:true}).then((res)=>{

                if(!res){
                    return resp.status(404).send();
                }

                resp.send({todo:res});
        }).catch((e)=>resp.send(e))

})



app.get("/users/me",authenticate,(req,resp)=>{

  
        resp.send(req.user);
    
})

app.post("/users",(req,resp)=>{

  let body=  _.pick(req.body,['email','password']);
  let user=new User(body);

//   let token=user.generateAuthToken().
//   then((token)=>{
//     resp.header("x-auth",token).send(user);
//   })
//   .catch((e)=>resp.status(400).send(e))

  user.generateAuthToken().
  then((token)=>{
    resp.header("x-auth",token).send(user);
  })
  .catch((e)=>resp.status(400).send(e))

//   user.save().then((res)=>{
//       return user.generateAuthToken()}).
      
//       then((token)=>{

//         resp.header("x-auth",token).send(user);
//       })
     
//   .catch((e)=>resp.status(400).send(e))

    })


app.post("/users/login",(req,resp)=>{


   let body= _.pick(req.body,['email','password']);

   User.findByCredentials(body.email,body.password).then((user)=>{
       console.log("Usereee",user)
       return user.generateAuthToken().then((token)=>{
        resp.header('x-auth',token).send(user);
       })

   }).catch((e)=>{
       console.log("Oyyyxs")
       resp.status(400).send();
   })
})

app.delete("/users/me/token",authenticate,(req,resp)=>{
   console.log("Inside",req.user);
 req.user.removeToken(req.token).then(()=>{
     console.log("inside");
     resp.send()
 }).catch((e)=>{
     
   resp.status(400).send(); 
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

//