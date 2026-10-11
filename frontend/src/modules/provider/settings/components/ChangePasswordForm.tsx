import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { updatePasswordSchema, type UpdatePasswordInputType } from '../schemas/validation';
import { useUpdatePassword } from '../hooks/mutations/useUpdatePassword';

export const ChangePasswordForm: React.FC = () => {
    const updatePassword = useUpdatePassword();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                {/* Current Password */}
                <div className="form-group">
                    <label className="form-label" htmlFor="curr-pwd">Current Password</label>
                    <div className="relative">
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            id="curr-pwd"
                            className={`form-control ${errors.currentPassword ? 'border-danger' : ''} pr-10`}
                            placeholder="••••••••"
                            {...register("currentPassword")}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors bg-transparent border-none cursor-pointer p-0 flex items-center justify-center"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            tabIndex={-1}
                            title={showCurrentPassword ? "Hide password" : "Show password"}
                        >
                            <i className={`fas ${showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                    </div>
                    {errors.currentPassword && (
                        <span className="text-danger text-xs mt-1 block">{errors.currentPassword.message}</span>
                    )}
                </div>

                {/* New Password */}
                <div className="form-group">
                    <label className="form-label" htmlFor="new-pwd">New Password</label>
                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            id="new-pwd"
                            className={`form-control ${errors.newPassword ? 'border-danger' : ''} pr-10`}
                            placeholder="At least 8 characters"
                            {...register("newPassword")}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors bg-transparent border-none cursor-pointer p-0 flex items-center justify-center"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            tabIndex={-1}
                            title={showNewPassword ? "Hide password" : "Show password"}
                        >
                            <i className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                    </div>
                    {errors.newPassword && (
                        <span className="text-danger text-xs mt-1 block">{errors.newPassword.message}</span>
                    )}
                </div>

                {/* Confirm New Password */}
                <div className="form-group">
                    <label className="form-label" htmlFor="conf-new-pwd">Confirm New Password</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="conf-new-pwd"
                            className={`form-control ${errors.confirmPassword ? 'border-danger' : ''} pr-10`}
                            placeholder="Confirm new password"
                            {...register("confirmPassword")}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors bg-transparent border-none cursor-pointer p-0 flex items-center justify-center"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            tabIndex={-1}
                            title={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                            <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <span className="text-danger text-xs mt-1 block">{errors.confirmPassword.message}</span>
                    )}
                </div>
            </div>

            <button
                type="submit"
                className="btn btn-secondary text-xs"
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
        </form>
    );
};
