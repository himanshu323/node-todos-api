let {User}=require("../models/users");

let authenticate=(req,resp,next)=>{

    let token=req.header("x-auth");
    console.log("Tojen",token);
    User.findToken(token).then((user)=>{
        if(!user){
            console.log("Hurray;kjkl;j")
            return  Promise.reject();
        }

        console.log("Hurray")
       req.user=user;
       req.token=token;
       next();
    }).catch((error)=>{

        console.log("Hurray;ljl;l;j;j;")
        resp.status(401).send(error);
    })
}

module.exports={authenticate}