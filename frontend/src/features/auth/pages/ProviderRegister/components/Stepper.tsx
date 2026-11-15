

interface StepperProps {
    activeStep: number;
}

const steps = [
    { step: 1, label: "Account Info" },
    { step: 2, label: "Services" },
    { step: 3, label: "Details" },
    { step: 4, label: "Review" },
];

export function Stepper({ activeStep }: StepperProps) {
    return (
        <div className="pro-stepper">
            <div className="pro-stepper-header">
                <span className="pro-stepper-badge">Step {activeStep} of 4</span>
                <span className="pro-stepper-title">{steps[activeStep - 1]?.label}</span>
            </div>
            <div className="pro-stepper-bars">
                {steps.map((s) => (
                    <div
                        key={s.step}
                        className={`pro-stepper-bar-segment ${
                            s.step < activeStep
                                ? "completed"
                                : s.step === activeStep
                                ? "active"
                                : ""
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
