import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updatePasswordSchema, type UpdatePasswordInputType } from '../../../../schemas/validation';
import { useState } from 'react';
import { useUpdatePassword } from '../../../../hooks/mutations/contact';
import { toast } from 'react-toastify';

export const Security = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const updatePassword = useUpdatePassword()
    const {register,handleSubmit,formState: { errors },reset} = useForm<UpdatePasswordInputType>({
        resolver: zodResolver(updatePasswordSchema),
        mode: "onChange",
        defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" }
    });

    const onSubmit = (data: UpdatePasswordInputType) => {
        setIsSubmitting(true)
        updatePassword.mutate({currentPassword:data.currentPassword,newPassword:data.newPassword},{
            onSuccess:(response)=>{
                setIsSubmitting(false)
                reset()
                toast.success(response.message)
            }
        })
    }

    return (
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
                        <input
                            type="password"
                            id="curr-pass"
                            className={`form-control ${errors.currentPassword ? 'border-danger' : ''}`}
                            placeholder="••••••••"
                            {...register("currentPassword")}
                        />
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
                        <input
                            type="password"
                            id="new-pass"
                            className={`form-control ${errors.newPassword ? 'border-danger' : ''}`}
                            placeholder="At least 8 characters"
                            {...register("newPassword")}
                        />
                        {errors.newPassword && (
                            <span className="text-danger text-xs mt-1 block">{errors.newPassword.message}</span>
                        )}
                    </div>
                    <div className="form-group mb-0">
                        <label className="form-label text-xs" htmlFor="confirm-pass">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm-pass"
                            className={`form-control ${errors.confirmPassword ? 'border-danger' : ''}`}
                            placeholder="Must match new password"
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                            <span className="text-danger text-xs mt-1 block">{errors.confirmPassword.message}</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update Password"}
                </button>
            </div>
        </form>
    );
};
