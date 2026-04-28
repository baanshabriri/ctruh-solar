import Joi from "joi";
export const nearbyHostsSchema = Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    radius: Joi.number().min(1).max(20000).default(5000),
    limit: Joi.number().min(1).max(50).default(20),
});