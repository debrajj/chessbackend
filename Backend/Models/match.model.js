const mongoose=require("mongoose");

const matchSchema=mongoose.Schema({
    matchcode:{type:String,required:true},
    partner1:{type:String,required:true},
    partner2:{type:String,required:true}
});


const Matchmodel=mongoose.model("match",matchSchema);

module.exports={Matchmodel}