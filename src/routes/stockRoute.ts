import {getStocks,getStocksProducts,getstock,createstock,updatestock,deletestock} from "../services/stockService";
import express from 'express';
const router = express.Router();


router.get('/', getStocks);
router.get('/products', getStocksProducts);
router.get('/:id', getstock);
router.post('/', createstock);
router.put('/:id', updatestock);
router.delete('/:id', deletestock);

export default router;