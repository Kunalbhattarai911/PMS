const express = require("express");
const router = express.Router();
const protect = require("../middleWare/authMiddleware");
const {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
  getAllProduct,
  addQuantity,
  subQuantity,
  productList,
  fetchProductUpdate,
  // createLogProduct,
} = require("../controllers/productController");
const { upload } = require("../utils/fileUpload");

router.post("/", protect, upload.single("image"), createProduct,);
router.get("/product-preview", protect, productList);
router.patch("/fetch-product-update/:id", protect,fetchProductUpdate);
// router.get("/:id", protect, createLogProduct,);
router.patch("/:id", protect, upload.single("image"), updateProduct);
router.get("/", protect, getProducts);
router.get("/all", protect, getAllProduct);
router.get("/:id", protect, getProduct);
router.delete("/:id", protect, deleteProduct);
router.patch("/add/:id", protect, addQuantity);
router.put("/sub/:id",protect, subQuantity)

module.exports = router;
