const express=require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const cookieParser = require("cookie-parser");
const {redisClient} = require("../Redis/redis")

const {Usermodel}=require("../Models/user.model");
// const { authentication } = require("../Middleware/Auth");


const userRouter=express.Router();

userRouter.use(express.json());
userRouter.use(cookieParser());

//Get Routes
userRouter.get("/",(req,res)=>{
    res.status(200).send("Hello User")
})


//Register Routes
userRouter.post("/signup",async(req,res)=>{
    const {name,email,password}=req.body;

    const useravailable= await Usermodel.findOne({email});

    if(useravailable){
       return  res.status(500).send({msg:"you are already available , please login"});
    }

    bcrypt.hash(password, 5, async function(err, hash) {
        if(err){
            res.status(500).send({msg:"something is wrong",status:"error"})
        }
        const user= new Usermodel({name,email,password:hash});
        await user.save();
        return res.status(200).send({msg:"signup successful",status:"success"});
    });
})


//Login Routes
userRouter.post("/login",async(req,res)=>{
    
    const {email,password}=req.body;
    
    const useravailable= await Usermodel.findOne({email});
    const userid=useravailable?._id;
    const username=useravailable?.name;
    const hashpassword=useravailable?.password

    if(useravailable){
        bcrypt.compare(password, hashpassword, async (err, result)=> {
            
            if(err){
                return res.status(500).send("try again")
            }
            if(result==false){
               return res.status(500).send({msg:"login failed",status:"error"})
            }
            const token = jwt.sign({ id: userid },process.env.JWTTOKEN_KEY);

            res.cookie("name",username,{ maxAge: 900000, httpOnly: true })
            res.cookie("token",token,{ maxAge: 900000, httpOnly: true })

         await redisClient.SET("name",username);
           
            await redisClient.SET("token",token);
            await redisClient.EXPIRE("token",21600)
            // const redistoken =await redisClient.GET("token")
            // const redisname =await redisClient.GET("name");
            // console.log(redistoken,redisname)
            return res.status(200).send({msg:"login successful","token":token,status:"success","name":username});

            
        });
        
    }
    else{
        return res.status(500).send({msg:"please signup",status:"error"})
    }
    
})

//for testing
// usern.get("/red",authentication,(req,res)=>{
//     return res.send("red")
// })



module.exports={userRouter}