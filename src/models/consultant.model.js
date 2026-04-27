import mongoose from "mongoose";

const consultantSchema = new mongoose.Schema({
    name: String,
    tenantId: {
        type: String,
        required: true,
        index: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    lastLocation: {
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: [Number], // [lng, lat]
    },
}, { timestamps: true });

// optional index
consultantSchema.index({ tenantId: 1 });

export default mongoose.model("Consultant", consultantSchema);