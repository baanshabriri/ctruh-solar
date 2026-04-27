import mongoose from "mongoose";

const hostSchema = new mongoose.Schema({
    name: String,
    tenantId: {
        type: String,
        required: true,
        index: true,
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number], // [lng, lat]
            required: true,
        },
    },
});

hostSchema.index({ location: "2dsphere" });

export default mongoose.model("Host", hostSchema);