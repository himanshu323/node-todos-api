const {SHA256}=require("crypto-js");
const jwt=require("jsonwebtoken");
const bcrypt=require('bcryptjs');

let data={
    id:4
}

// console.log(SHA256(JSON.stringify(data)+"secret").toString())

// data.id=5;

// console.log(SHA256(JSON.stringify(data)+"secret").toString())

// let token=jwt.sign(data,"secret");

// console.log(token);

// let tokenAB=jwt.sign({id:6},"hello");

// let test=jwt.verify(token,"secret");

// console.log(test);

let password="testABC";
let hashPassword;

bcrypt.genSalt(10,(err,salt)=>{
    console.log("Salt",salt);

    bcrypt.hash(password,salt,(err,hash)=>{
        hashPassword= hash;
        bcrypt.compare(password,hashPassword,(err,res)=>{
            console.log(res);
        });
    })
})

// bcrypt.compare(password,hashPassword,(err,res)=>{
//     console.log(res);
// });

