import { getCategories, getCategoriesProducts, getCategory, createCategory, updateCategory, deleteCategory } from "../services/categoryService";    
import express from 'express';
import { verifyToken, verifyAdmin } from '../utils/verifyToken';
const router = express.Router();


router.get('/', getCategories);
router.get('/products', getCategoriesProducts);
router.get('/:id', getCategory);
router.post('/admin/', verifyAdmin, createCategory);
router.put('/admin/:id', verifyAdmin, updateCategory);
router.delete('/admin/:id', verifyAdmin, deleteCategory);


export default router;