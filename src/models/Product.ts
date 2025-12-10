import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct {
  title: string;
  price: number;
  stock: number;
  description?: string;
}

export interface IProductDoc extends IProduct, Document {}

const productSchema = new Schema<IProductDoc>({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  description: { type: String }
}, { timestamps: true });

export default mongoose.model<IProductDoc>('Product', productSchema);
