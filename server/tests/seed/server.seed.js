const {ObjectID}=require("mongodb");
const {Todo}=require("../../models/todos")
const {User}=require("../../models/users");
const jwt=require("jsonwebtoken");



let userOneId=new ObjectID();
let userTwoId=new ObjectID();
let users=[{
    _id:userOneId,
    email:"him@test.com",
    password:"test1234",
    tokens:[{
        token:jwt.sign({_id:userOneId,access:"auth"},process.env.JWT_SECRET),
        access:"auth"
    }]},{

        _id:userTwoId,
        email:"rohan@test.com",
        password:"roh1238",
        tokens:[{
            token:jwt.sign({_id:userTwoId,access:"auth"},process.env.JWT_SECRET),
            access:"auth"
        }]
    }

]

let todos=[{
    _id:new ObjectID(),
    text:"Complete Angular"
    ,_creator:userOneId
},{
    _id:new ObjectID(),
    _creator:userTwoId,
    text:"Complete NodeJS",
    completed:true,
    completedAt:88899
}]


let populateTodosData=(done)=>{

    Todo.remove({}).then(()=>{
       return Todo.insertMany(todos)
    }).then(()=>{
        done();
    })
}

let populateUsers=(done)=>{

    User.remove({}).then(()=>{

       let userOne= new User(users[0]).save();
       let userTwo=new User(users[1]).save();

       Promise.all([userOne,userTwo]).then(()=>{
           done();
       })
    })
}

module.exports={todos,populateUsers,populateTodosData,users}