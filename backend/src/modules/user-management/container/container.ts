import GetCustomersUseCase from "../application/use-cases/getCustomers.useCase.js";
import UpdateUserStatusUseCase from "../application/use-cases/updateUser.useCase.js";
import { UserRepository } from "../infrastructure/repositories/prismaUser.repository.js";
import { UserController } from "../presentation/controller/user.controller.js";


const userRepository = new UserRepository()

const getCustomerUseCase = new GetCustomersUseCase(userRepository)
const updateUserStatusUseCase = new UpdateUserStatusUseCase(userRepository)



export const userController = new UserController(
    updateUserStatusUseCase,
    getCustomerUseCase
)