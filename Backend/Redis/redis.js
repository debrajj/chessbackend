const redis = require("redis");

require("dotenv").config();


const redisClient = redis.createClient({url:`redis://default:${process.env.redispass}@redis-13208.c212.ap-south-1-1.ec2.cloud.redislabs.com:13208`})

redisClient.on("error",(err)=>console.log(err))

redisClient.on("ready",()=>{
    console.log("Connected to redis")
})


   let red =  async ()=>{
        await redisClient.connect()
    }
    red()
module.exports = {
    redisClient
}