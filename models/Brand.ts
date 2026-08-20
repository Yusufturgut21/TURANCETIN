import mongoose, { Schema, models, model, type InferSchemaType } from "mongoose";

const BrandSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    logo: {
      url: String,
      publicId: String,
    },
    description: { type: String, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true }
);

export type IBrand = InferSchemaType<typeof BrandSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Brand = models.Brand || model("Brand", BrandSchema);
