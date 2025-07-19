import express from "express";
import {
  registerSeller,
  sellerLogin,
  sellerLogout,
  isSellerAuth,
  verifySellerEmail,
} from "../controllers/sellerController.js";
import authSeller from "../middlewares/authSeller.js";

const sellerRouter = express.Router();

// ✅ Seller registration & verification
sellerRouter.post("/register", registerSeller);
sellerRouter.post("/verify", verifySellerEmail);

// ✅ Seller login/logout/auth check
sellerRouter.post("/login", sellerLogin);
sellerRouter.get("/logout", sellerLogout);
sellerRouter.get("/is-auth", authSeller, isSellerAuth);

export default sellerRouter;
