import mongoose,{Schema, Document} from 'mongoose'


interface ICart extends Document {
    fullName:string,
    userName:string,
    email:string,
    password:string
} 


const cartSchema = new Schema<ICart>({
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
    password: {
    type: String,
    required: true,
    unique: true
},
});

export default mongoose.model<ICart>("Cart", cartSchema);