import { userRepository } from "../../../../modules/auth/infrastructure/composition/repositories";
import { UserStatus } from "../../../domain/constants/user-status.constant";
import { AuthErrorCode, AuthErrorMessage, HttpStatus } from "../constants/auth.constants";
import { User } from "../../../../modules/auth/domain/entities/user.entity";

export interface AccountStatusCheckResult {
    isAllowed: boolean;
    statusCode?: number;
    code?: string;
    message?: string;
    user?: User;
}

export const checkAccountStatus = async (userId: string): Promise<AccountStatusCheckResult> => {
    const user = await userRepository.findById(userId);

    if (!user) {
        return {
            isAllowed: false,
            statusCode: HttpStatus.UNAUTHORIZED,
            code: AuthErrorCode.USER_NOT_FOUND,
            message: AuthErrorMessage.USER_NOT_FOUND,
        };
    }

    if (user.status === UserStatus.BLOCKED) {
        return {
            isAllowed: false,
            statusCode: HttpStatus.FORBIDDEN,
            code: AuthErrorCode.ACCOUNT_BLOCKED,
            message: AuthErrorMessage.ACCOUNT_BLOCKED,
            user,
        };
    }

    if (user.status === UserStatus.INACTIVE) {
        return {
            isAllowed: false,
            statusCode: HttpStatus.FORBIDDEN,
            code: AuthErrorCode.ACCOUNT_INACTIVE,
            message: AuthErrorMessage.ACCOUNT_INACTIVE,
            user,
        };
    }

    return {
        isAllowed: true,
        user,
    };
};
