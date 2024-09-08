import {getProducts,getProduct,createProduct,updateProduct,deleteProduct} from '../services/productService';
import express from 'express';
const router = express.Router();


router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;