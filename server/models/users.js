const mongoose=require("mongoose")
const validator=require("validator")
const jwt=require("jsonwebtoken")
const _=require("lodash");
const bcrypt=require("bcryptjs");

let UserSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        minlength:1,
        trim:true,
        unique:true,
        validate:{

            validator:validator.isEmail,
            message:'{VALUE} is not valid email'
        }


    },

    password:{
        type:String,
        required:true,
        minlength:6
    },
    tokens:[{

        access:{
            type:String,
            required:true
        },
        token:{
            type:String
            ,required:true
        }
    }]
})

// var user = this;
//   var access = 'auth';
//   var token = jwt.sign({_id:user._id.toHexString(), access}, 'abc123').toString();

//   user.tokens.push({access, token});

//   return user.save().then(() => {
//     return token;
//   });

UserSchema.methods.generateAuthToken=function (){
    console.log("HEllo ")
    let user=this;
    let access="auth";
    let token=jwt.sign({_id:user._id.toHexString(),access},process.env.JWT_SECRET);
    user.tokens.push({access,token});
    console.log("Tojen ",token)

     return user.save().then(()=>{
        return token;
    })

}

UserSchema.methods.toJSON=function(){

    let user=this;
    let body=_.pick(user,['email','_id']);
    return body;



}

UserSchema.statics.findToken=function (token){

    let User=this;
    let decoded;
    try{
   decoded= jwt.verify(token,process.env.JWT_SECRET);

    }
    catch(e){
        return  Promise.reject();

    }
    return User.findOne({
        _id:decoded._id,
        'tokens.token':token,
        'tokens.access':decoded.access
    })


}

UserSchema.statics.findByCredentials=function (email,password){
    console.log("Inside CPL")
let User=this;
return User.findOne({email}).then((user)=>{
    console.log("Hljkljl")
if(!user){
    return Promise.reject();
}
console.log(password);

 return new Promise((resolve,reject)=>{

    bcrypt.compare(password,user.password,(error,res)=>{

        console.log("jJJJJ$$$")
        
        if(res){
            console.log("Successs$$$")
            resolve(user)
        }
        else{
            reject();
        }
    })

 })

 
 //eturn new Promise((resolve,reject)=>{

    // bcrypt.compare(password,user.password,(error,res)=>{

    //     console.log("jJJJJ$$$")
        
        
    //     if(res){
    //         console.log("Successs$$$")
    //         return Promise.resolve(user)
    //     }else{ return Promise.reject();
    //     }
    // })



})


}

UserSchema.methods.removeToken=function(token){
    let user=this;
console.log("knklnlk"+token);
    return user.update({
        $pull:{
            tokens:{
                token
            }
        }
    })
}

UserSchema.pre("save",function (next){

    let user=this;
if(user.isModified('password')){
    
    bcrypt.genSalt(10,(err,salt)=>{

        bcrypt.hash(user.password,salt,(err,hash)=>{
            user.password=hash;
            
            next();
        })
    })
}
else{

    next();
}

})
let User=mongoose.model("User",UserSchema)

module.exports={
    User
}