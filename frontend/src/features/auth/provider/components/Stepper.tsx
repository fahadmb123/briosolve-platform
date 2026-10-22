

interface StepperProps {
    activeStep: number;
}

export function Stepper({ activeStep }: StepperProps) {
    return (
        <div className="stepper-wrapper mb-6">
            <div className={`stepper-item ${activeStep >= 1 ? 'active' : ''}`} id="step-1-indicator">
                <div className="stepper-circle">1</div>
                <div className="stepper-label text-xs">Basic Info</div>
            </div>
            <div className={`stepper-item ${activeStep >= 2 ? 'active' : ''}`} id="step-2-indicator">
                <div className="stepper-circle">2</div>
                <div className="stepper-label text-xs">Services</div>
            </div>
            <div className={`stepper-item ${activeStep >= 3 ? 'active' : ''}`} id="step-3-indicator">
                <div className="stepper-circle">3</div>
                <div className="stepper-label text-xs">Details</div>
            </div>
            <div className={`stepper-item ${activeStep >= 4 ? 'active' : ''}`} id="step-4-indicator">
                <div className="stepper-circle">4</div>
                <div className="stepper-label text-xs">Review</div>
            </div>
        </div>
    );
}
