import productModel from "../models/productModel";
import stockModel from "../models/stockModel";
import categoryModel from "../models/categoryModel";
import asyncHandler from 'express-async-handler';
import slugify from 'slugify';


const getProducts = asyncHandler(async (req, res) => {
    const page=req.query.page?+req.query.page:1;
    const limit=req.query.limit?+req.query.limit:10;
    const skip=(page-1)*limit;
    const products=await productModel.find({}).skip(skip).limit(limit).populate({path:"category",select:"name"});
    products?res.status(200).json(products):res.status(404).json({message:"No products found"});
});

const getProduct = asyncHandler(async (req, res) => {
    const product=await productModel.findById(req.params.id).populate({path:"category",select:"name"});
    product?res.status(200).json(product):res.status(404).json({message:"Product not found"});
});

const createProduct = asyncHandler(async (req:any, res:any) => {
    const {title,price,stock,category,quantity}=req.body;
    if(!title || !price || !stock || !category || !quantity){
        console.log(req.body);
        return res.status(400).json({message:"Please fill all fields"});
    }
    const image=req.file?req.file.path:'';
    if(image){
        req.body.image=image;
    }
    const existStock=await stockModel.findById(stock);
    if(!existStock){
        return res.status(400).json({message:"Stock not found"});
    }
    const existCategory=await categoryModel.findById(category);
    if(!existCategory){
        return res.status(400).json({message:"Category not found"})
    }
    const product=await productModel.create({title,slug:slugify(title),price,stock,image,category,quantity});    
    if(stock){
        stock.products.push(product._id);
        await stock.save();
    }
    product?res.status(201).json(product):res.status(400).json({message:"Product not created"});
});

const updateProduct = asyncHandler(async (req:any, res:any) => {
    const {title,price,category}=req.body;
    if(!title || !price || !category){
        return res.status(400).json({message:"Please fill all fields"});
    }
    const image=req.file?req.file.path:'';
    if(image){
        req.body.image=image;
    }

    const product=await productModel.findByIdAndUpdate(req.params.id,{title,slug:slugify(title),price,category,image},{new:true});
    product?res.status(200).json(product):res.status(400).json({message:"Product not updated"});
});

const deleteProduct = asyncHandler(async (req, res) => {
    const product=await productModel.findByIdAndDelete(req.params.id);
    product?res.status(200).json({message:"Product deleted"}):res.status(400).json({message:"Product not deleted"});
});


export {getProducts,getProduct,createProduct,updateProduct,deleteProduct};
