const mongoose = require("mongoose")

const productLogSchema = mongoose.Schema(
  {
    productId: {
       type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
         required: true
       },
    logId: { 
        type: String,
         required: true 
        },
    quantityIn: {
       type: Number,
        default: 0 
      },
    quantityOut: {
       type: Number,
        default: 0
       },
      
    },
    {
    timestamps: true,
  }
);

const ProductLog = mongoose.model("ProductLog", productLogSchema);
module.exports = ProductLog;
