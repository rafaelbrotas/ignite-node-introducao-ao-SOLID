import { Router } from "express";

import { UsersRepository } from "../modules/users/repositories/implementations/UsersRepository";
import { createUserController } from "../modules/users/useCases/createUser";
import { listAllUsersController } from "../modules/users/useCases/listAllUsers";
import { showUserProfileController } from "../modules/users/useCases/showUserProfile";
import { turnUserAdminController } from "../modules/users/useCases/turnUserAdmin";

const usersRoutes = Router();

function checksUserIsAdmin(request, response, next) {
  const usersRepository = UsersRepository.getInstance();
  const { user_id } = request.headers;

  const user = usersRepository.findById(user_id);

  if (!user || !user.admin) {
    return response.status(400).json({ error: "Invalid acess!" });
  }
  return next();
}

usersRoutes.post("/", (request, response) =>
  createUserController.handle(request, response)
);

usersRoutes.patch("/:user_id/admin", (request, response) =>
  turnUserAdminController.handle(request, response)
);

usersRoutes.get("/:user_id", (request, response) =>
  showUserProfileController.handle(request, response)
);

usersRoutes.get("/", checksUserIsAdmin, (request, response) =>
  listAllUsersController.handle(request, response)
);

export { usersRoutes };
