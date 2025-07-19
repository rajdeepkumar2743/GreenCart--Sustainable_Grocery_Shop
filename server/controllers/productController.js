import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js"; // ✅


// ✅ Add Product : /api/product/add
export const addProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData);
    const images = req.files;

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    await Product.create({
      ...productData,
      image: imagesUrl,
      sellerId: req.seller._id, // 👈 Ensure product is linked to logged-in seller
    });

    res.json({ success: true, message: "✅ Product Added Successfully" });
  } catch (error) {
    console.error("❌ Error adding product:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get All Products (public/admin): /api/product/list
export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.error("❌ Error fetching products:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get Single Product By ID: /api/product/id
export const productById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error("❌ Error getting product by ID:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Change Product In-Stock Status (seller-only): /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;

    const product = await Product.findById(id);

    if (!product || product.sellerId.toString() !== req.seller._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized or invalid product" });
    }

    await Product.findByIdAndUpdate(id, { inStock });
    res.json({ success: true, message: "✅ Stock Updated" });
  } catch (error) {
    console.error("❌ Error updating stock:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get Only Seller's Own Products: /api/product/seller-products
export const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.seller._id });
    res.json({ success: true, products });
  } catch (error) {
    console.error("❌ Error fetching seller's products:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
