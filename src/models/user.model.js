import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    tenantId: {
        type: String,
        required: true,
        index: true,
    },
}, { timestamps: true });

export default mongoose.model("User", userSchema);