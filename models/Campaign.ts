import mongoose, { Schema, models, model, type InferSchemaType } from "mongoose";

const CampaignSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    banner: {
      url: String,
      publicId: String,
    },
    startDate: { type: Date },
    endDate: { type: Date },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    isActive: { type: Boolean, default: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true }
);

export type ICampaign = InferSchemaType<typeof CampaignSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Campaign = models.Campaign || model("Campaign", CampaignSchema);
