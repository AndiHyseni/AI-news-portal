import { StatusCodeEnums } from "../../interfaces/enums";
import UserDbModel from "../../models/Users.model";
import { failure, found } from "../../utils";

export const UserService = {
  me: async (id: string) => {
    try {
      const result = await UserDbModel.query()
        .findById(id)
        .select("id", "username", "email");

      return found({ ...result }, "Not found User with this id!");
    } catch (error) {
      return failure(error, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
  checkIsActive: async (id: string) => {
    try {
      const result = await UserDbModel.query().findById(id);

      return found(
        { active: result?.username },
        "Not found User with this id!"
      );
    } catch (error) {
      return failure(error, StatusCodeEnums.UNPROCESSABLE_ENTITY);
    }
  },
};
