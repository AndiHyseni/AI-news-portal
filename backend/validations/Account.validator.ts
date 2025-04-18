import Joi from "joi";

export const AccountValidator = Joi.object({
  username: Joi.string(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .trim()
    .required()
    .label("Email"),
  password_hash: Joi.string().trim().min(8).required().label("Password"),
});
