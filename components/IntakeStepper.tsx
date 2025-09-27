'use client'

import { useState } from 'react';
import { useIntakeStore } from '@/lib/store';
import { CheckCircle, Circle, ArrowRight, ArrowLeft, Upload, FileText, Heart, Globe, Shield } from 'lucide-react';

interface IntakeStep {
  key: string;
  title: string;
  description: string;
  isRequired: boolean;
  icon: React.ReactNode;
}

const INTAKE_STEPS: IntakeStep[] = [
  {
    key: 'demographics',
    title: 'Personal Information',
    description: 'Basic details and contact information',
    isRequired: true,
    icon: <FileText className="w-5 h-5" />
  },
  {
    key: 'procedure',
    title: 'Medical Procedure',
    description: 'Treatment type and budget preferences',
    isRequired: true,
    icon: <Heart className="w-5 h-5" />
  },
  {
    key: 'reports',
    title: 'Medical Reports',
    description: 'Upload relevant medical documents',
    isRequired: true,
    icon: <Upload className="w-5 h-5" />
  },
  {
    key: 'comorbidities',
    title: 'Health Conditions',
    description: 'Existing conditions and medications',
    isRequired: false,
    icon: <Heart className="w-5 h-5" />
  },
  {
    key: 'language',
    title: 'Language & Communication',
    description: 'Preferred language and communication',
    isRequired: true,
    icon: <Globe className="w-5 h-5" />
  },
  {
    key: 'consent',
    title: 'Terms & Consent',
    description: 'Review and accept terms',
    isRequired: true,
    icon: <Shield className="w-5 h-5" />
  }
];

interface IntakeStepperProps {
  onComplete?: (allData: Record<string, unknown>) => void;
  variant?: 'default' | 'compact' | 'wizard';
}

export default function IntakeStepper({ 
  onComplete,
  variant = 'default'
}: IntakeStepperProps) {
  const { currentStep, formData, nextStep, prevStep, reset, setCurrentStep, setFormData } = useIntakeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showProgress = variant === 'wizard';

  const handleNext = () => {
    if (currentStep < INTAKE_STEPS.length - 1) {
      nextStep();
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      prevStep();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Call the completion handler
      onComplete?.(formData);
    } catch (error) {
      console.error('Failed to submit intake:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'pending';
  };

  const getStepIcon = (status: 'completed' | 'current' | 'pending', icon: React.ReactNode) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-health" />;
      case 'current':
        return icon;
      default:
        return icon;
    }
  };

  const isStepValid = (stepKey: string) => {
    // Enhanced validation logic
    switch (stepKey) {
      case 'demographics':
        return formData.demographics?.name && formData.demographics?.email;
      case 'procedure':
        return formData.procedure?.sku && formData.procedure?.budget;
      case 'reports':
        // Make reports optional for now to allow progression
        return true;
      case 'comorbidities':
        // Optional step
        return true;
      case 'language':
        return formData.language;
      case 'consent':
        return formData.consent === true;
      default:
        return true;
    }
  };

  const progressPercentage = ((currentStep + 1) / INTAKE_STEPS.length) * 100;

  const renderStepContent = () => {
    const currentStepKey = INTAKE_STEPS[currentStep].key;
    
    switch (currentStepKey) {
      case 'demographics':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.demographics?.name || ''}
                  onChange={(e) => setFormData({ 
                    demographics: { 
                      ...formData.demographics, 
                      name: e.target.value,
                      email: formData.demographics?.email || '',
                      country: formData.demographics?.country || ''
                    } 
                  })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-slate-900 placeholder-slate-600"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.demographics?.email || ''}
                  onChange={(e) => setFormData({ 
                    demographics: { 
                      ...formData.demographics, 
                      email: e.target.value,
                      name: formData.demographics?.name || '',
                      country: formData.demographics?.country || ''
                    } 
                  })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-slate-900 placeholder-slate-600"
                  placeholder="Enter your email address"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.demographics?.phone || ''}
                  onChange={(e) => setFormData({ 
                    demographics: { 
                      ...formData.demographics, 
                      phone: e.target.value,
                      name: formData.demographics?.name || '',
                      email: formData.demographics?.email || '',
                      country: formData.demographics?.country || ''
                    } 
                  })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-slate-900 placeholder-slate-600"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-2">
                  Country of Residence
                </label>
                <select
                  value={formData.demographics?.country || ''}
                  onChange={(e) => setFormData({ 
                    demographics: { 
                      ...formData.demographics, 
                      country: e.target.value,
                      name: formData.demographics?.name || '',
                      email: formData.demographics?.email || ''
                    } 
                  })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 text-slate-900"
                >
                  <option value="">Select your country</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        );
      
      case 'procedure':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-navy-600 mb-2">Medical Procedure *</label>
              <select
                value={formData.procedure?.sku || ''}
                onChange={(e) => setFormData({ 
                  procedure: { 
                    ...formData.procedure, 
                    sku: e.target.value as "TKR_STANDARD" | "THR_STANDARD" | "ACL_ARTHRO" | "IVF_CYCLE" 
                  } 
                })}
                className="w-full px-3 py-2 border-2 border-g200 rounded-lg focus:ring-2 focus:ring-sky focus:border-sky transition-all duration-200 text-navy-600"
              >
                <option value="">Select a procedure</option>
                <option value="TKR_STANDARD">Total Knee Replacement (Standard)</option>
                <option value="TKR_PREMIUM">Total Knee Replacement (Premium)</option>
                <option value="THR_STANDARD">Total Hip Replacement (Standard)</option>
                <option value="ACL_ARTHRO">ACL Reconstruction</option>
                <option value="IVF_CYCLE">IVF Cycle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-600 mb-2">Budget Range (USD) *</label>
              <select
                value={formData.procedure?.budget || ''}
                onChange={(e) => setFormData({ 
                  procedure: { 
                    ...formData.procedure, 
                    budget: e.target.value 
                  } 
                })}
                className="w-full px-3 py-2 border-2 border-g200 rounded-lg focus:ring-2 focus:ring-sky focus:border-sky transition-all duration-200 text-navy-600"
              >
                <option value="">Select budget range</option>
                <option value="2000-4000">$2,000 - $4,000</option>
                <option value="4000-6000">$4,000 - $6,000</option>
                <option value="6000-8000">$6,000 - $8,000</option>
                <option value="8000+">$8,000+</option>
              </select>
            </div>
          </div>
        );
      
      case 'reports':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-navy-600 mb-2">Upload Medical Reports</label>
              <div className="border-2 border-dashed border-sky-300 rounded-lg p-6 text-center hover:border-sky-400 transition-colors duration-200">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setFormData({ reports: files.map(f => f.name) });
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-g600">
                    <Upload className="w-10 h-10 mx-auto mb-3 text-sky-400" />
                    <p className="text-base font-medium mb-1">Click to upload or drag and drop</p>
                    <p className="text-sm">PDF, JPG, PNG up to 10MB</p>
                  </div>
                </label>
              </div>
              {formData.reports && Array.isArray(formData.reports) && formData.reports.length > 0 && (
                <div className="mt-3 p-3 bg-sky-50 rounded-lg border border-sky-200">
                  <p className="text-sm font-medium text-sky-800 mb-2">Selected files:</p>
                  <ul className="text-sm text-sky-700 space-y-1">
                    {formData.reports.map((file, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {file}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'comorbidities':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-navy-600 mb-2">Existing Health Conditions</label>
              <textarea
                value={typeof formData.comorbidities === 'string' ? formData.comorbidities : ''}
                onChange={(e) => setFormData({ comorbidities: e.target.value })}
                className="w-full px-3 py-2 border-2 border-g200 rounded-lg focus:ring-2 focus:ring-sky focus:border-sky transition-all duration-200 text-navy-600"
                rows={3}
                placeholder="List any existing health conditions, allergies, or medications..."
              />
              <p className="text-xs text-g500 mt-1">This information helps us provide better care recommendations.</p>
            </div>
          </div>
        );
      
      case 'language':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-navy-600 mb-2">Preferred Language *</label>
              <select
                value={formData.language || ''}
                onChange={(e) => setFormData({ language: e.target.value })}
                className="w-full px-3 py-2 border-2 border-g200 rounded-lg focus:ring-2 focus:ring-sky focus:border-sky transition-all duration-200 text-navy-600"
              >
                <option value="">Select language</option>
                <option value="English">English</option>
                <option value="Arabic">Arabic</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-600 mb-2">Communication Preferences</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="flex items-center p-2 border-2 border-g200 rounded-lg hover:border-sky-300 transition-colors duration-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.communication?.email || false}
                    onChange={(e) => setFormData({ 
                      communication: { 
                        ...formData.communication, 
                        email: e.target.checked 
                      } 
                    })}
                    className="mr-2 w-4 h-4 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-sm font-medium text-navy-600">Email</span>
                </label>
                <label className="flex items-center p-2 border-2 border-g200 rounded-lg hover:border-sky-300 transition-colors duration-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.communication?.phone || false}
                    onChange={(e) => setFormData({ 
                      communication: { 
                        ...formData.communication, 
                        phone: e.target.checked 
                      } 
                    })}
                    className="mr-2 w-4 h-4 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-sm font-medium text-navy-600">Phone</span>
                </label>
                <label className="flex items-center p-2 border-2 border-g200 rounded-lg hover:border-sky-300 transition-colors duration-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.communication?.whatsapp || false}
                    onChange={(e) => setFormData({ 
                      communication: { 
                        ...formData.communication, 
                        whatsapp: e.target.checked 
                      } 
                    })}
                    className="mr-2 w-4 h-4 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-sm font-medium text-navy-600">WhatsApp</span>
                </label>
              </div>
            </div>
          </div>
        );
      
      case 'consent':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-base font-semibold text-blue-800 mb-2">Important Information</h4>
              <p className="text-blue-700 text-sm">
                By completing this form, you agree to our terms and consent to being contacted regarding your medical inquiry. 
                Your information will be handled according to our privacy policy.
              </p>
            </div>
            <div>
              <label className="flex items-start p-3 border-2 border-g200 rounded-lg hover:border-sky-300 transition-colors duration-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consent === true}
                  onChange={(e) => setFormData({ consent: e.target.checked })}
                  className="mr-3 mt-1 w-4 h-4 text-sky-600 focus:ring-sky-500"
                />
                <span className="text-sm text-navy-600">
                  I agree to the <a href="#" className="text-sky-600 hover:underline font-medium">Terms of Service</a> and{' '}
                  <a href="#" className="text-sky-600 hover:underline font-medium">Privacy Policy</a>. I consent to being contacted 
                  regarding my medical inquiry and understand that my information will be handled according to our privacy policy.
                </span>
              </label>
            </div>
            <div>
              <label className="flex items-start p-3 border-2 border-g200 rounded-lg hover:border-sky-300 transition-colors duration-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.marketing === true}
                  onChange={(e) => setFormData({ marketing: e.target.checked })}
                  className="mr-3 mt-1 w-4 h-4 text-sky-600 focus:ring-sky-500"
                />
                <span className="text-sm text-navy-600">
                  I would like to receive updates about medical tourism opportunities and healthcare services. 
                  <span className="text-g500"> (Optional)</span>
                </span>
              </label>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-g50 rounded-lg p-4 text-center">
            <p className="text-sm text-g600">
              Form content for step: <strong>{currentStepKey}</strong>
            </p>
            <p className="text-xs text-g500 mt-2">
              This step is under development.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="bg-transparent">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#2A4049] mb-3">Complete Your Medical Profile</h2>
        <p className="text-lg text-[#2A4049] font-medium">Step {currentStep + 1} of {INTAKE_STEPS.length}</p>
        
        {/* Progress Bar */}
        <div className="mt-8 max-w-5xl mx-auto">
          <div className="flex justify-between text-sm text-[#2A4049] font-medium mb-3">
            <span>Started</span>
            <span>In Progress</span>
            <span>Completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-[#ADC8A6] h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / INTAKE_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps Navigation */}
      <div className="mb-12">
        <div className="flex items-center justify-between gap-4 max-w-5xl mx-auto">
          {INTAKE_STEPS.map((step, index) => {
            const isCurrent = index === currentStep;
            const isCompleted = index < currentStep;
            const isPending = index > currentStep;
            
            return (
              <button
                key={step.key}
                onClick={() => setCurrentStep(index)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentStep === index 
                      ? 'bg-sage-500 text-white' 
                      : 'bg-slate-200 text-slate-700 hover:text-slate-900'
                  }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      currentStep === index 
                        ? 'bg-white text-sage-500' 
                        : currentStep > index 
                        ? 'bg-sage-100 text-sage-600' 
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                    {currentStep > index ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    ) : (
                      <span className="text-lg font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className={`font-semibold text-sm ${
                      currentStep === index 
                        ? 'text-white' 
                        : currentStep > index 
                        ? 'text-sage-700' 
                        : 'text-slate-700'
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`text-xs mt-1 ${
                      currentStep === index 
                        ? 'text-white/90' 
                        : currentStep > index 
                        ? 'text-sage-600' 
                        : 'text-slate-600'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="max-w-5xl mx-auto mb-16">
        {/* Step Content */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-[#2A4049] mb-4 flex items-center gap-3">
            <div className="p-3 bg-[#ADC8A6] rounded-full">
              {INTAKE_STEPS[currentStep].icon}
            </div>
            {INTAKE_STEPS[currentStep].title}
            {INTAKE_STEPS[currentStep].isRequired && (
              <span className="text-sm text-[#2A4049] font-bold bg-[#ADC8A6] px-3 py-1 rounded-full">Required</span>
            )}
          </h3>
          <p className="text-[#2A4049] mb-8 font-medium text-lg">{INTAKE_STEPS[currentStep].description}</p>
          
          {/* Render step-specific content */}
          {renderStepContent()}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-200">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentStep === 0 
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300 hover:text-slate-900'
            }`}
          >
            Previous
          </button>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleNext}
              disabled={!isStepValid(INTAKE_STEPS[currentStep].key)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                !isStepValid(INTAKE_STEPS[currentStep].key) 
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                  : 'bg-sage-500 text-white hover:bg-sage-600'
              }`}
            >
              {currentStep === INTAKE_STEPS.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
