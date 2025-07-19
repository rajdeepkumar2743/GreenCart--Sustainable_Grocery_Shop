import express from "express";
import {
  getSellerProducts,
  addProduct,
  productList,
  productById,
  changeStock,
} from "../controllers/productController.js";
import { verifySeller } from "../middlewares/verifySeller.js";
import multer from "multer";

const storage = multer.diskStorage({});
const upload = multer({ storage });

const router = express.Router();

// ✅ Add product by seller
router.post("/add", verifySeller, upload.array("images"), addProduct);

// ✅ Get all products (for public)
router.get("/list", productList);

// ✅ Get a product by ID
router.post("/id", productById);

// ✅ Update stock (seller only)
router.post("/stock", verifySeller, changeStock);

// ✅ Get only seller's own products
router.get("/seller-products", verifySeller, getSellerProducts);

export default router;
