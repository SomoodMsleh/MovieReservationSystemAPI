import { Schema, Types, model } from "mongoose";
import mongoose from "mongoose";


const paymentSchema = new Schema({
    reservationId: {
        type:Types.ObjectId,
        ref: "Reservation",
        required: true
    },
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    transactionId: {
        type: String,
        trim: true,
        unique: true,
        sparse: true // allows multiple nulls if transactionId is optional
    }, 
    paymentMethod: {
        type: String,
        required: true,
        enum: ["credit_card", "paypal", "cash"],
        trim: true
    }, 
    status: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending"
    },
    paymentDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const paymentModel = mongoose.models.Payment || model("Payment", paymentSchema);

export default paymentModel;