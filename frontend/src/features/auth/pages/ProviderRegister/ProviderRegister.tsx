import './ProviderRegister.css';


import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from '../../../../shared/hooks/useTheme';
import { providerRegistrationSchema, type ProviderRegistrationInputType } from '../../schemas/provider/providerRegistration.schema';
import { Stepper } from './components/Stepper';
import { BasicInfoStep } from './components/BasicInfoStep';
import { ServicesStep } from './components/ServicesStep';
import { ProfessionalDetailsStep } from './components/ProfessionalDetailsStep';
import { ReviewStep } from './components/ReviewStep';
import { useRegisterProvider } from '../../hooks/provider/useRegisterProvider';

export default function ProviderRegister() {
  const { toggleTheme } = useTheme();
  
  const [activeStep, setActiveStep] = useState(1);

  const methods = useForm<ProviderRegistrationInputType>({
    resolver: zodResolver(providerRegistrationSchema),
    mode: "onTouched",
    defaultValues: {
      services: [],
    }
  });

  const { mutate: submitRegistration, isPending } = useRegisterProvider();

  const onSubmit = (data: ProviderRegistrationInputType) => {
    submitRegistration({
      services: data.services,
      experience: data.experience,
      bio: data.bio
    });
  };

  return (
    <>
      
    <div className="register-pro-wrapper">
        
        <header className="register-pro-header" style={{ position: 'relative' }}>
            <Link to="/" className="logo text-3xl font-black tracking-wide text-text" style={{ fontWeight: 900 }}>
                Provider Registration
            </Link>
            
            <div className="navbar-center hide-mobile" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '2rem' }}>
                <Link to="/" className="nav-item-link font-medium hover:text-primary transition-colors">Home</Link>
                <Link to="/register" className="nav-item-link font-medium hover:text-primary transition-colors">Sign Up</Link>
            </div>

            <div className="flex items-center gap-4">
                <button onClick={toggleTheme} id="theme-toggle" className="btn-icon" aria-label="Toggle Theme">
                    <i className="fas fa-sun"></i>
                </button>
            </div>
        </header>

        
        <main className="register-main-container">
            
            <div className="mb-8 text-center">
                <h1 className="h3 mb-2 font-bold">Create Your Professional Account</h1>
                <p className="text-secondary text-sm">Fill in your details below to get started.</p>
            </div>

            <form id="provider-register-form" onSubmit={methods.handleSubmit(onSubmit)}>
                <FormProvider {...methods}>
                    <Stepper activeStep={activeStep} />

                    <BasicInfoStep 
                        isActive={activeStep === 1} 
                        onNext={() => setActiveStep(prev => prev + 1)} 
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
                </FormProvider>
            </form>
        </main>

        {/* Floating Sign-In Box */}
        <div className="navbar-action-box always-visible" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100 }}>
            <span className="text-sm font-medium text-text px-1 hide-mobile">Already registered?</span>
            <Link to="/login" className="btn btn-outline btn-sm">
                Sign In
            </Link>
        </div>
    </div>
    </>
  );
}
