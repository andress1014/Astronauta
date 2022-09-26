import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    owner: {
        type: String,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
});

export default model('Product', productSchema);