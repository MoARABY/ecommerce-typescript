import mongoose,{Schema, Document} from 'mongoose'


interface IStock extends Document {
    title: string;
    slug: string;
    products: {
        type: Array<mongoose.Schema.Types.ObjectId>,
        default: []
    }
} 


const stockSchema = new Schema<IStock>({
    title: {
    type: String,
    required: true,
    unique: true
},
    slug: {
    type: String,
    lowercase: true
}
});

export default mongoose.model<IStock>("Stock", stockSchema);