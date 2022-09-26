import { Router } from "express";
import { addProduct, getAll, updateProduct, deleteProduct } from "../Controllers/ProductController";
import { verifyToken, verifyProduct } from "../middleware/verifyToken"

const router = Router();


router.post('/addProduct', verifyToken, addProduct);
router.get('/allProduct', getAll);
router.put('/updateProduct/:idProduct', verifyToken, verifyProduct, updateProduct);
router.delete('/deleteProduct/:idProduct', verifyToken, verifyProduct, deleteProduct);

export default router;
