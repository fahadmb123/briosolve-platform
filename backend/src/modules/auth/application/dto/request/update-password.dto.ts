type updatePassword = {
    currentPassword : string;
    newPassword : string;
}
export type UpdatePasswordInputDto = {
    id:string,
    data:updatePassword
}