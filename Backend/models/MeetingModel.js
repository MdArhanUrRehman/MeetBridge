import mongoose, { Schema } from "mongoose";

const meetingModel = new Schema({
    user_id : {type : String},
    meetingCode : {type:String, required : true},
    date : {type : Date, default : Date.now, required: true}
})

const Meeting = new mongoose.model("Meeting", meetingModel);

export default Meeting;