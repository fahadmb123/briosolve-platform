const fs = require('fs');
let c = fs.readFileSync('frontend/src/pages/provider/ProviderRegister/ProviderRegister.tsx', 'utf8');

c = c.replace(import { Link } from 'react-router-dom';, import { Link } from 'react-router-dom';\nimport { useState } from 'react';);
c = c.replace(const { toggleTheme } = useTheme();, const { toggleTheme } = useTheme();\n  const [activeStep, setActiveStep] = useState(1););

c = c.replace(/className=\"form-step-card step-content active\" id=\"step-1\"/g, 'className={orm-step-card step-content } id=\"step-1\" style={{ display: activeStep === 1 ? \'block\' : \'none\' }}');

for(let i=2; i<=5; i++) {
  c = c.replace(new RegExp('className=\"form-step-card step-content\" id=\"step-' + i + '\" style={{ display: \'none\' }}', 'g'), 'className={orm-step-card step-content } id=\"step-' + i + '\" style={{ display: activeStep === ' + i + ' ? \'block\' : \'none\' }}');
}

c = c.replace(/<button type=\"button\" className=\"btn btn-primary\" onClick={\(\) => {  }}>Next Step <i className=\"fas fa-arrow-right ml-1\"><\/i><\/button>/g, '<button type=\"button\" className=\"btn btn-primary\" onClick={() => setActiveStep(prev => prev + 1)}>Next Step <i className=\"fas fa-arrow-right ml-1\"></i></button>');
c = c.replace(/<button type=\"button\" className=\"btn btn-secondary\" onClick={\(\) => {  }}><i className=\"fas fa-arrow-left mr-1\"><\/i> Back<\/button>/g, '<button type=\"button\" className=\"btn btn-secondary\" onClick={() => setActiveStep(prev => prev - 1)}><i className=\"fas fa-arrow-left mr-1\"></i> Back</button>');

fs.writeFileSync('frontend/src/pages/provider/ProviderRegister/ProviderRegister.tsx', c);
