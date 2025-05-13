import Joi from "joi";

export const CategoryValidator = Joi.object({
  id: Joi.string(),
  name: Joi.string(),
  description: Joi.string(),
  show_online: Joi.boolean(),
});
