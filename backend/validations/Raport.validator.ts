import Joi from "joi";

export const RaportValidator = Joi.object({
  work_type: Joi.string(),
  price: Joi.any(),
});
