import mongoose,{Schema, Document} from 'mongoose'


interface IProduct extends Document {
    title: string;
    image: string;
    price: number;
    category: mongoose.Schema.Types.ObjectId;
    stock: mongoose.Schema.Types.ObjectId;
    quantity: number;
} 


const productSchema = new Schema<IProduct>({
    title: {
    type: String,
    required: true,
    unique: true
},
    image: {
    type: String,
    default: '',
},
    price: {
    type: Number,
    required: true,
    unique: true
},
    stock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock',
    required: [true, 'Product stock is required']
},
    category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
},
    quantity: {
        type: Number,
        required: [true, 'Product quantity is required'],
        default: 0
},
},{timestamps: true});

export default mongoose.model<IProduct>("Product", productSchema);