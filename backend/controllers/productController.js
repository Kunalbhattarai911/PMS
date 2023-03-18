const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const Log = require("../models/productLogModel")
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

// Create Prouct
const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;

  //   Validation
  if (!name || !category || !quantity || !price || !description) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  // Handle Image upload
  let fileData = {};
  if (req.file) {
    // Save image to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Pinvent App",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  // Create Product
  const product = await Product.create({
    user: req.user.id,
    name,
    sku,
    category,
    quantity,
    price,
    description,
    image: fileData,
  });

  // // Log product creation
  // const { itemId, quantityIn, quantityOut} = req.body
  // const log = await ProductLog.create({
  //   productId: req.product.id,
  //   itemid: itemId,
  //   quantityin: quantityIn,
  //   quantityout: quantityOut,
  //   datetime: new Date(),
  //   userId: req.user.userId
  // });

  res.status(201).json(product);
  // res.json(log)  
});


//create log 
// const createLogProduct = asyncHandler(async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   // if product doesnt exist
//   if (!product) {
//     res.status(404);
//     throw new Error("Product not found");
//   }
//   // Match product to its user
//   if (product.user.toString() !== req.user.id) {
//     res.status(401);
//     throw new Error("User not authorized");
//   }

//   // Create a log for accessing the product
//   await Log.create({
//     product: product._id,
//     operation: "accessed",
//     user: req.user.id,
//   });

//   res.status(200).json(product);
// });


// Get all Products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user.id }).sort("-createdAt");
  res.status(200).json(products);
});

// // //Get all product of every user
const getAllProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.find();
    return res.status(200) .json(product)
  } catch (error) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
})

// Get single product
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  // if product doesnt exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Match product to its user
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  res.status(200).json(product);
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  // if product doesnt exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Match product to its user
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  await product.remove();
  res.status(200).json({ message: "Product deleted." });
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const { name, category, price, description } = req.body;
  const { id } = req.params;

  const product = await Product.findById(id);

  // if product doesnt exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Match product to its user
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  // Handle Image upload
  let fileData = {};
  if (req.file) {
    // Save image to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Pinvent App",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  // Update Product
  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: id },
    {
      name,
      category,
      price,
      description,
      image: Object.keys(fileData).length === 0 ? product?.image : fileData,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedProduct);
});

//preview the product data
const productList = asyncHandler ( async (req,res) => {
  const product = await Product.find({ user: req.user._id }).select("id name category price image").sort("-createdAt");
// console.log(product)
if(product) {
  return res.status(200).json(product)
} else {
  res.status(400);
  throw new Error("Product not found")
}
})

//update the quantity only
const fetchProductUpdate = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { id } = req.params;

  const product = await Product.findById(id);

  // if product doesnt exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Match product to its user
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  // Update Product
  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: id },
    {
     quantity
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedProduct);
}); 


//*********Add the quantity of product*****/
const addQuantity = asyncHandler( async (req,res) => {
  try {
    const incrementProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { quantity: 1 } },
      { new: true, setDefaultsOnInsert: true }
    );
     return res.json({
      Updated_Product_Quantity_Data: incrementProduct
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//**********subtraction of Quantity *******/
const subQuantity = asyncHandler ( async (req,res) => {
  try {
    const decrementProduct= await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { quantity: -1 } },
      { new: true, setDefaultsOnInsert: true}
    );
    res.json({
      Updated_Product_Quantity_Data: decrementProduct
    }) 
  } catch (err) {
    return res.status(500) .json({message: err.message})
  }
})

module.exports = {
  createProduct,
  getProducts,
  getAllProduct,
  getProduct,
  deleteProduct,
  updateProduct,
  addQuantity,
  subQuantity,
  productList,
  fetchProductUpdate
  // createLog
};
