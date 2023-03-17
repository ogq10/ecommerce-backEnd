const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    design: { type: String, required: true },
    details: [
      {
        title: {
          type: String,
          required: true,
        },
        detail: {
          type: String,
          required: true,
        },
        preview: {
          type: String,
          required: true,
        },
      },
    ],
    colorHex: { type: String, required: false },

    colorWord: { type: String, required: true },
    size: [
      {
        sizeType: {
          type: String,
          required: true,
        },

        count: {
          type: Number,
          required: true,
        },
      },
    ],

    main_img: { type: String, required: true },
    slide_images: { type: Array, required: true },
    drop: { type: Array, required: true },
    filter: { type: Array, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
