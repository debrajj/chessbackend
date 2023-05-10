const express = require('express');
const cors = require('cors')
const app = express();

const {connection}=require("./Configs/db");

const {userRouter}=require("./Routes/user.routes");
const { socketserver } = require("./Server/Script");

// const {authentication} = require("./Middleware/Auth")

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/",(req,res)=>{
  return res.send("welcome to chess game")
})
app.use(express.json());

app.use("/user",userRouter)

// app.use(authentication)


const http=require("http");
const httpserver=http.createServer(app);

const Server=require("socket.io");
const io= Server(httpserver,{ cors: { origin: "*" } });
app.use("/chess",express.static('public'));



socketserver(io);

const port = process.env.PORT || 3000;

httpserver.listen(port, async ()=> {

  try{
    await connection
    console.log("connect with db")
  }
  catch(err){
    console.log(err)
  }

  console.log('listening to port: ' + port);
});
