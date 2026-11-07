import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { updatePasswordSchema, type UpdatePasswordInputType } from '../../schemas/providerSettings.schema';
import { useUpdatePassword } from '../../hooks/provider/useUpdatePassword';
import { PasswordInput } from '../../../../shared/components/ui/PasswordInput/PasswordInput';

export const ChangePasswordForm: React.FC = () => {
    const updatePassword = useUpdatePassword();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<UpdatePasswordInputType>({
        resolver: zodResolver(updatePasswordSchema),
        mode: "onChange",
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    });

    const onSubmit = (data: UpdatePasswordInputType) => {
        updatePassword.mutate(
            {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            },
            {
                onSuccess: (response) => {
                    reset();
                    toast.success(response.message || "Password updated successfully");
                }
            }
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="card p-6 flex flex-col">
                    <h3 className="h6 mb-4 border-bottom pb-3 font-bold">Verify It's You</h3>
                    <div className="form-group mb-0">
                        <label className="form-label text-xs" htmlFor="curr-pwd">Current Password</label>
                        <PasswordInput
                            id="curr-pwd"
                            icon=""
                            placeholder="••••••••"
                            error={errors.currentPassword?.message}
                            {...register("currentPassword")}
                        />
                    </div>
                </div>

                <div className="card p-6 flex flex-col">
                    <h3 className="h6 mb-4 border-bottom pb-3 font-bold">Create New Password</h3>
                    <div className="form-group mb-4">
                        <label className="form-label text-xs" htmlFor="new-pwd">New Password</label>
                        <PasswordInput
                            id="new-pwd"
                            icon=""
                            placeholder="At least 8 characters"
                            error={errors.newPassword?.message}
                            {...register("newPassword")}
                        />
                    </div>

                    <div className="form-group mb-0">
                        <label className="form-label text-xs" htmlFor="conf-new-pwd">Confirm New Password</label>
                        <PasswordInput
                            id="conf-new-pwd"
                            icon=""
                            placeholder="Must match new password"
                            error={errors.confirmPassword?.message}
                            {...register("confirmPassword")}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={updatePassword.isPending}
                >
                    {updatePassword.isPending ? (
                        <>
                            <i className="fas fa-spinner fa-spin mr-1"></i> Updating...
                        </>
                    ) : (
                        "Update Password"
                    )}
                </button>
            </div>
        </form>
    );
};
