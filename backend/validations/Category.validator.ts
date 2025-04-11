import Joi from "joi";

export const CategoryValidator = Joi.object({
  name: Joi.string(),
  show_online: Joi.boolean(),
});
