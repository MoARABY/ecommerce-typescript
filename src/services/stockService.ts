import stockModel from "../models/stockModel";
import asyncHandler from 'express-async-handler';
import slugify from 'slugify';


const getStocks = asyncHandler(async (req, res) => {
    const stocks=await stockModel.find({});
    stocks?res.status(200).json(stocks):res.status(404).json({message:"No stocks found"});
});

const getStocksProducts = asyncHandler(async (req, res) => {
    const stocks=await stockModel.find({}).populate({path:"Product",select:"title"});
    stocks?res.status(200).json(stocks):res.status(404).json({message:"No categories found"});
});

const getstock = asyncHandler(async (req, res) => {
    const stock=await stockModel.findById(req.params.id);
    stock?res.status(200).json(stock):res.status(404).json({message:"stock not found"});
})

const createstock = asyncHandler(async (req:any, res:any) => {
    const {title}=req.body;
    if(!title){
        return res.status(400).json({message:"Please fill all fields"});
    }
    const stock=await stockModel.create({title,slug:slugify(title)});
    stock?res.status(201).json(stock):res.status(400).json({message:"stock not created"});
})

const updatestock = asyncHandler(async (req:any, res:any) => {
    const {title}=req.body;
    const stock=await stockModel.findByIdAndUpdate(req.params.id,{title,slug:slugify(title)},{new:true});
    stock?res.status(200).json(stock):res.status(400).json({message:"stock not updated"});
})

const deletestock = asyncHandler(async (req, res) => {
    const stock=await stockModel.findByIdAndDelete(req.params.id);
    stock?res.status(200).json({message:"stock deleted"}):res.status(400).json({message:"stock not deleted"});
})

export {getStocks,getStocksProducts,getstock,createstock,updatestock,deletestock};