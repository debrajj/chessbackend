const jwt = require('jsonwebtoken');
const fs=require("fs");
require("dotenv").config();
const {redisClient} = require("../Redis/redis")

const authentication= async (req,res,next)=>{
  
    const token=req.headers.authorization?.split(" ")[1]
    
    // const redistoken =await redisClient.GET("token")
    // const redisname =await redisClient.GET("name");
    // console.log(redistoken)
    // if(redistoken){
    //   res.send("Please Login Again")
    // }

    if(!token){
       return res.send({msg:"please loginn"})
    }
        jwt.verify(token, process.env.JWTTOKEN_KEY, async(err, decoded)=> {
            if(err){
                return res.send({msg:err.message,status:"error"})
            }

          console.log("decode:-",decoded)
          const redistoken =await redisClient.GET("token")
          const redisname =await redisClient.GET("name");
          console.log(redisname)

            const mainid=decoded.id;
            req.body.userid=mainid;
            req.body.name=redisname;
    
            
            next()
          });

  
}


module.exports={authentication}



