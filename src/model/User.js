import mongoose,{Schema} from "mongoose";

const messageSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const userSchema = new Schema({
    username:{
        type:String,
        required:true
        // unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:[/.+\@.+\..+/, 'Please use a valid email address']
    },
    password:{
        type:String,
        required:true
    },
    messages:[messageSchema],
    createdAt:{
        type:Date,
        default:Date.now
    },
    verifyCode:{
        type:String,
        required:true
    },
    verifyCodeExpiry:{
        type:Date,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessages:{
        type:Boolean,
        default:true
    }
})

const UserModel = mongoose.models.User || mongoose.model('User',userSchema);
export default UserModel;