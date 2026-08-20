import mongoose, { Schema, models, model, type InferSchemaType } from "mongoose";

const SpecificationSchema = new Schema(
  {
    key: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const ProductImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    brand: { type: String, trim: true },
    brandRef: { type: Schema.Types.ObjectId, ref: "Brand" },
    model: { type: String, trim: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: Schema.Types.ObjectId, ref: "Category" },
    shortDescription: { type: String, trim: true },
    description: { type: String, trim: true },
    warranty: { type: String, trim: true },
    specifications: { type: [SpecificationSchema], default: [] },
    price: { type: Number, min: 0 },
    discountedPrice: { type: Number, min: 0 },
    images: {
      type: [ProductImageSchema],
      required: true,
      validate: {
        validator: (v: unknown[]) => Array.isArray(v) && v.length > 0,
        message: "En az bir ürün görseli gereklidir.",
      },
    },
    isCampaign: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    seoTitle: String,
    seoDescription: String,
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  }
);

ProductSchema.index({ title: "text", brand: "text", model: "text", shortDescription: "text" });
ProductSchema.index({ isActive: 1, isFeatured: 1 });
ProductSchema.index({ isActive: 1, isCampaign: 1 });
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ brand: 1, isActive: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });

export type IProduct = InferSchemaType<typeof ProductSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Product = models.Product || model("Product", ProductSchema);
