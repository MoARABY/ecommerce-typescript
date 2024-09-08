import mongoose,{Schema, Document} from 'mongoose'


interface IOrder extends Document {
    fullName:string,
    userName:string,
    email:string,
    password:string
} 


const orderSchema = new Schema<IOrder>({
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

export default mongoose.model<IOrder>("Order", orderSchema);