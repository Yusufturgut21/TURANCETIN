import mongoose, { Schema, models, model, type InferSchemaType } from "mongoose";

const BannerSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    image: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    buttonText: { type: String, trim: true },
    buttonLink: { type: String, trim: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

BannerSchema.index({ isActive: 1, sortOrder: 1 });

export type IBanner = InferSchemaType<typeof BannerSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Banner = models.Banner || model("Banner", BannerSchema);
