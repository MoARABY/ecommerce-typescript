import categoryModel from "../models/categoryModel";
import asyncHandler from 'express-async-handler';
import slugify from 'slugify';


const getCategories = asyncHandler(async (req, res) => {
    const categories=await categoryModel.find({});
    categories?res.status(200).json(categories):res.status(404).json({message:"No categories found"});
});

const getCategoriesProducts = asyncHandler(async (req, res) => {
    const categories=await categoryModel.find({}).populate({path:"Product",select:"title"});
    categories?res.status(200).json(categories):res.status(404).json({message:"No categories found"});
});

const getCategory = asyncHandler(async (req, res) => {
    const category=await categoryModel.findById(req.params.id);
    category?res.status(200).json(category):res.status(404).json({message:"Category not found"});
})

const createCategory = asyncHandler(async (req:any, res:any) => {
    const {title}=req.body;
    if(!title){
        return res.status(400).json({message:"Please fill all fields"});
    }
    const category=await categoryModel.create({title,slug:slugify(title)});
    category?res.status(201).json(category):res.status(400).json({message:"Category not created"});
})

const updateCategory = asyncHandler(async (req:any, res:any) => {
    const {title}=req.body;
    const category=await categoryModel.findByIdAndUpdate(req.params.id,{title,slug:slugify(title)},{new:true});
    category?res.status(200).json(category):res.status(400).json({message:"Category not updated"});
})

const deleteCategory = asyncHandler(async (req, res) => {
    const category=await categoryModel.findByIdAndDelete(req.params.id);
    category?res.status(200).json({message:"Category deleted"}):res.status(400).json({message:"Category not deleted"});
})

export {getCategories,getCategoriesProducts,getCategory,createCategory,updateCategory,deleteCategory};