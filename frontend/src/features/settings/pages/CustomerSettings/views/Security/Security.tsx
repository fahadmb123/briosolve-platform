import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updatePasswordSchema, type UpdatePasswordInputType } from '../../../../schemas/customerSettings.schema';
import { useUpdatePassword } from '../../../../hooks/customer/contact';
import { toast } from 'react-hot-toast';
import { SpinnerOverlay } from '../../../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';

export const Security = () => {
    const updatePassword = useUpdatePassword()
    const {register,handleSubmit,formState: { errors },reset} = useForm<UpdatePasswordInputType>({
        resolver: zodResolver(updatePasswordSchema),
        mode: "onChange",
        defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" }
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit = (data: UpdatePasswordInputType) => {
        updatePassword.mutate({currentPassword:data.currentPassword,newPassword:data.newPassword},{
            onSuccess:(response)=>{
                reset()
                toast.success(response.message)
            }
        })
    }

    return (
        <>
            <SpinnerOverlay isLoading={updatePassword.isPending} />
            <form onSubmit={handleSubmit(onSubmit)} className="fade-in">
                <div className="mb-4">
                    <h2 className="h5 mb-1">Password & Security</h2>
                    <p className="text-xs text-secondary">Update your sign-in credentials to protect your marketplace account.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Table 1: Current Password */}
                    <div className="card p-6 flex flex-col">
                        <h3 className="h6 mb-4 border-bottom pb-3">Verify It's You</h3>
                        <div className="form-group mb-4">
                            <label className="form-label text-xs" htmlFor="curr-pass">Current Password</label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    id="curr-pass"
                                    className={`form-control ${errors.currentPassword ? 'border-danger' : ''} pr-10`}
                                    placeholder="••••••••"
                                    {...register("currentPassword")}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors bg-transparent border-none cursor-pointer p-0 flex items-center justify-center"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    <i className={`fas ${showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                            {errors.currentPassword && (
                                <span className="text-danger text-xs mt-1 block">{errors.currentPassword.message}</span>
                            )}
                        </div>
                    </div>

                    {/* Table 2: New Password */}
                    <div className="card p-6 flex flex-col">
                        <h3 className="h6 mb-4 border-bottom pb-3">Create New Password</h3>
                        <div className="form-group mb-4">
                            <label className="form-label text-xs" htmlFor="new-pass">New Password</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    id="new-pass"
                                    className={`form-control ${errors.newPassword ? 'border-danger' : ''} pr-10`}
                                    placeholder="At least 8 characters"
                                    {...register("newPassword")}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors bg-transparent border-none cursor-pointer p-0 flex items-center justify-center"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    <i className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                            {errors.newPassword && (
                                <span className="text-danger text-xs mt-1 block">{errors.newPassword.message}</span>
                            )}
                        </div>
                        <div className="form-group mb-0">
                            <label className="form-label text-xs" htmlFor="confirm-pass">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirm-pass"
                                    className={`form-control ${errors.confirmPassword ? 'border-danger' : ''} pr-10`}
                                    placeholder="Must match new password"
                                    {...register("confirmPassword")}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors bg-transparent border-none cursor-pointer p-0 flex items-center justify-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <span className="text-danger text-xs mt-1 block">{errors.confirmPassword.message}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="btn btn-primary btn-sm" disabled={updatePassword.isPending}>
                        Update Password
                    </button>
                </div>
            </form>
        </>
    );
};
