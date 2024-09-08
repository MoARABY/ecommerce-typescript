import mongoose,{Schema, Document} from 'mongoose'


interface IUser extends Document {
    fullName:string,
    userName:string,
    email:string,
    password:string,
    role:string,
    emailConfirmed:boolean,
    confirmationCode:string,
    confirmationCodeExpires:Date,
    resetPasswordCode:string,
    resetPasswordExpires:Date | number
} 


const userSchema = new Schema<IUser>({
    fullName: {
    type: String,
    required: true,
    unique: true
},
    userName: {
    type: String,
    required: true,
    unique: true
},
    email: {
    type: String,
    required: true,
    unique: true
},
    role: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
},
    password: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
},
    emailConfirmed: {
    type: Boolean,
    default: false,
},
    confirmationCode: {
    type: String,
    default: () => Math.floor(100000 + Math.random() * 900000).toString() // generates a 6-digit code
},
    confirmationCodeExpires: {
    type: Date,
    default: () => Date.now() + 3600000 // 1 hour from now
},
    resetPasswordCode: {
    type: String,
    default: ''
},
    resetPasswordExpires: {
    type: Date
}
}, { timestamps: true });

export default mongoose.model<IUser>("User", userSchema);