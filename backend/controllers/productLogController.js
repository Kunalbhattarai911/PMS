// // const asyncHandler = require("express-async-handler");
// // const ProductLog = require("../models/productLogModel")
// // const Product = require("../models/productModel")

// // const logProduct = asyncHandler(async (req, res) => {
// //     const { productId, quantity, operation } = req.body;
  
// //     //Finding Product log for this Product    
// //     const productLog = await ProductLog.findOne({ productId }).sort({ createdAt: -1})
  
// //     // If no product log found, return an error
// //     if (!productLog) {
// //       return res.status(404).json({error: "Product log not found"})
// //     }
  
// //     //calculate the new quantity based on the operations
// //     let newQuantity;
// //     if(operation === "increment") {
// //         newQuantity = productLog.quantity + quantity;
// //     } else if (operation ==="decrement") {
// //         newQuantity = productLog.quantity - quantity;
// //     } else {
// //         return res.status(500) .json({error: "Internal Server Error"})
// //     }
  
// //     //update the product log with the quantity
// //     const newLog = new ProductLog({
// //         productId,
// //         name: productLog.name,
// //         quantity: newQuantity,
// //         operation
// //     })
// //     await newLog.save();
  
// //     //update the product with the new quantity
// //     await Product.updateOne({ _id: productId }, {$set: {quantity:newQuantity } });
// //     return res.json(newLog);
// //   })
  
// // module.exports = logProduct;


// // const asyncHandler = require("express-async-handler");
// // const ProductLog = require("../models/productLogModel")
// // const shortId = require("shortid")
// // const product = require("../models/productModel")

// // const createProductLog = asyncHandler (async(req,res) => {
// //     try {
// //         const logId = shortId.generate()
// //         const { productId, quantityIn, quantityOut } = req.body;
// //         const productLog = new ProductLog({ 
// //             productId,
// //             logId,
// //             quantityIn,
// //             quantityOut
// //         })
// //         const savedLog = await productLog.save();
// //         return res.status(201) .json(savedLog)
// //     } catch (error) {
// //         return res.status(400) .json({
// //             message:error.message
// //         })
// //     }
// // })

// // module.exports = createProductLog

// // productLogController.js

// const ProductLog = require('../models/productLogModel');
// const Product = require('../models/productModel');
// const shortId = require("shortid")

// const createProductLog = async (req, res) => {
//   try {
//         const { logId, quantityIn, quantityOut } = req.body;
//         const { productId } = req.params;
    
//         // Find the product by ID
//         const product = await Product.findById(productId);
    
//         // Throw an error if the product does not exist
//         if (!product) {
//           return res.status(404).json({ message: "Product not found" });
//         }
    
//         // Update the product quantity and save it
//         product.quantity -= quantityOut;
//         product.quantity += quantityIn;
//         await product.save();
    
//         // Create a new product log and save it
//         const productLog = new ProductLog({
//           productId: product._id,
//           logId,
//           quantityIn,
//           quantityOut,
//         });
//         const savedProductLog = await productLog.save();
    
//         // Return the saved product log and updated product
//         res.status(201).json({ productLog: savedProductLog, product });
//       } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error" });
//       }
//     });
// module.exports = createProductLog


const ProductLog = require('../models/productLogModel');
const Product = require('../models/productModel');
const shortId = require("shortid")

// async function updateProductQuantity(productId, logId, quantity, transactionType) {
const createProductLog = async (req, res) => {
    try {
        const { productId, quantity, transactionType } = req.body
      let product = await Product.findById(productId);
//   console.log(product)
      if (transactionType === 'in') {
        product.quantity += quantity;
      } else if (transactionType === 'out') {
        if (product.quantity < quantity) {
          throw new Error('Insufficient quantity');
        }
        product.quantity -= quantity;
      } else {
        throw new Error('Invalid transaction type');
      }
  
      await product.save();
      const logId = shortId.generate();
      let productLog = new ProductLog({
        productId: productId,
        logId,
        quantityIn: transactionType === 'in' ? quantity : 0,
        quantityOut: transactionType === 'out' ? quantity : 0
      });
    //   console.log(productLog)
  
      await productLog.save();
  
      return res.status(201).json({
        message:'Product quantity updated and log created successfully',
        productLog
    });
    } catch (error) {
      console.error(error.message);
    }
  }
  module.exports = createProductLog
  