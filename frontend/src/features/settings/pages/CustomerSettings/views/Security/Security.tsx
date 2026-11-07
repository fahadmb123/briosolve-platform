import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updatePasswordSchema, type UpdatePasswordInputType } from '../../../../schemas/customerSettings.schema';
import { useUpdatePassword } from '../../../../hooks/customer/contact';
import { toast } from 'react-hot-toast';
import { SpinnerOverlay } from '../../../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';
import { PasswordInput } from '../../../../../../shared/components/ui/PasswordInput/PasswordInput';

export const Security = () => {
    const updatePassword = useUpdatePassword()
    const {register,handleSubmit,formState: { errors },reset} = useForm<UpdatePasswordInputType>({
        resolver: zodResolver(updatePasswordSchema),
        mode: "onChange",
        defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" }
    });

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
                    <div className="card p-6 flex flex-col">
                        <h3 className="h6 mb-4 border-bottom pb-3">Verify It's You</h3>
                        <div className="form-group mb-4">
                            <label className="form-label text-xs" htmlFor="curr-pass">Current Password</label>
                            <PasswordInput
                                id="curr-pass"
                                icon=""
                                placeholder="••••••••"
                                error={errors.currentPassword?.message}
                                {...register("currentPassword")}
                            />
                        </div>
                    </div>

                    <div className="card p-6 flex flex-col">
                        <h3 className="h6 mb-4 border-bottom pb-3">Create New Password</h3>
                        <div className="form-group mb-4">
                            <label className="form-label text-xs" htmlFor="new-pass">New Password</label>
                            <PasswordInput
                                id="new-pass"
                                icon=""
                                placeholder="At least 8 characters"
                                error={errors.newPassword?.message}
                                {...register("newPassword")}
                            />
                        </div>
                        <div className="form-group mb-0">
                            <label className="form-label text-xs" htmlFor="confirm-pass">Confirm Password</label>
                            <PasswordInput
                                id="confirm-pass"
                                icon=""
                                placeholder="Must match new password"
                                error={errors.confirmPassword?.message}
                                {...register("confirmPassword")}
                            />
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
