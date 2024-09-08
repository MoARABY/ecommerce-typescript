import mongoose,{Schema, Document} from 'mongoose'


interface ICategory extends Document {
    title: string;
    slug: string;
    products: {
        type: Array<mongoose.Schema.Types.ObjectId>,
        default: []
    }
} 


const categorySchema = new Schema<ICategory>({
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

export default mongoose.model<ICategory>("Category", categorySchema);