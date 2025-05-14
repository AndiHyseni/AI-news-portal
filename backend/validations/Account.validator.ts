import Joi from "joi";

export const AccountValidator = Joi.object({
  id: Joi.any(),
  username: Joi.string(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .trim()
    .required()
    .label("Email"),
  password: Joi.string().trim().min(8).required().label("Password"),
  password_hash: Joi.string().trim().min(8).label("Password"),
  role: Joi.any(),
});
