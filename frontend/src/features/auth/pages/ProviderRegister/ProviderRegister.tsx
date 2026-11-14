import './ProviderRegister.css';
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { providerRegistrationSchema, type ProviderRegistrationInputType } from '../../schemas/provider/providerRegistration.schema';
import { Stepper } from './components/Stepper';
import { BasicInfoStep } from './components/BasicInfoStep';
import { ServicesStep } from './components/ServicesStep';
import { ProfessionalDetailsStep } from './components/ProfessionalDetailsStep';
import { ReviewStep } from './components/ReviewStep';
import { useRegisterProvider } from '../../hooks/provider/useRegisterProvider';

export default function ProviderRegister() {
  const [activeStep, setActiveStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const methods = useForm<ProviderRegistrationInputType>({
    resolver: zodResolver(providerRegistrationSchema),
    mode: "onTouched",
    defaultValues: {
      services: [],
    }
  });

  const { mutate: submitRegistration, isPending, error } = useRegisterProvider();

  const onSubmit = (data: ProviderRegistrationInputType) => {
    setErrorMessage(null);
    submitRegistration({
      services: data.services,
      experience: data.experience,
      bio: data.bio
    }, {
      onError: (err: any) => {
        setErrorMessage(err?.message || "Failed to register provider. Please try again.");
      }
    });
  };

  const activeError = errorMessage || error?.message;

  return (
    <div className="provider-register-container">
      <div className="login-form-header">
        <h1 className="login-title">Join as Provider</h1>
        <p className="login-subtitle">Create your pro account to start receiving job requests</p>
      </div>

      {activeError && (
        <div className="login-error-alert" role="alert">
          <i className="fas fa-circle-exclamation login-error-alert-icon"></i>
          <span className="login-error-alert-text">{activeError}</span>
          <button
            type="button"
            className="login-error-alert-close"
            onClick={() => setErrorMessage(null)}
            aria-label="Dismiss error"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      <FormProvider {...methods}>
        <Stepper activeStep={activeStep} />

        <form id="provider-register-form" onSubmit={methods.handleSubmit(onSubmit)} className="login-form">
          <BasicInfoStep 
            isActive={activeStep === 1} 
            onNext={() => setActiveStep(prev => prev + 1)} 
            onError={(msg) => setErrorMessage(msg)}
          />

          <ServicesStep 
            isActive={activeStep === 2} 
            onBack={() => setActiveStep(prev => prev - 1)} 
            onNext={() => setActiveStep(prev => prev + 1)} 
          />

          <ProfessionalDetailsStep 
            isActive={activeStep === 3} 
            onBack={() => setActiveStep(prev => prev - 1)} 
            onNext={() => setActiveStep(prev => prev + 1)} 
          />

          <ReviewStep 
            isActive={activeStep === 4} 
            isPending={isPending}
            onBack={() => setActiveStep(prev => prev - 1)} 
            onSubmit={methods.handleSubmit(onSubmit)} 
          />
        </form>
      </FormProvider>
    </div>
  );
}
