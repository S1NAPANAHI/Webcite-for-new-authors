# Fix for React Error #301 - Too Many Re-renders

## Problem Description

The beta application page at `/beta/application` was throwing a **React Error #301: Too many re-renders** error. This was caused by an infinite loop in the `BetaApplication.enhanced.tsx` component.

## Root Cause

The issue was in this line of code:

```jsx
const canProceed = validateStep(currentStep);
```

The `validateStep` function was being called during every render, and it would call `setErrors()`, which triggered a re-render, creating an infinite loop.

## Solution

To fix this issue, you need to modify the `BetaApplication.enhanced.tsx` file with the following changes:

### 1. Split the validation logic:

```jsx
// BEFORE: This caused infinite loops
const validateStep = useCallback((stepId: number): boolean => {
    // ... validation logic
    setErrors(prev => ({ ...prev, ...newErrors })); // This caused re-renders
    return Object.keys(newErrors).length === 0;
}, [formData, interestWordCount]);

// AFTER: Split into pure function and state setter
const validateStepFields = useCallback((stepId: number, formValues: FormData): {
    isValid: boolean;
    errors: Partial<Record<keyof FormData, string>>;
} => {
    // ... validation logic (no state updates)
    return {
        isValid: Object.keys(newErrors).length === 0,
        errors: newErrors
    };
}, []);

const validateCurrentStep = useCallback(() => {
    const validation = validateStepFields(currentStep, formData);
    setErrors(prev => ({ ...prev, ...validation.errors }));
    setHasValidatedCurrentStep(true);
    return validation.isValid;
}, [currentStep, formData, validateStepFields]);
```

### 2. Add validation state tracking:

```jsx
const [hasValidatedCurrentStep, setHasValidatedCurrentStep] = useState(false);
```

### 3. Fix the canProceed calculation:

```jsx
// BEFORE: This caused infinite loops
const canProceed = validateStep(currentStep);

// AFTER: Use useMemo to prevent re-renders
const canProceed = useMemo(() => {
    if (!hasValidatedCurrentStep) {
        // Only check if there are no obvious missing required fields
        const step = STEPS.find(s => s.id === currentStep);
        if (!step) return false;
        
        return step.fields.every(field => {
            const value = formData[field];
            if (field === 'devices') {
                return Array.isArray(value) && value.length > 0;
            }
            return value && (typeof value !== 'string' || value.trim());
        });
    }
    
    // If we've validated, check current errors for this step's fields
    const step = STEPS.find(s => s.id === currentStep);
    if (!step) return false;
    
    return step.fields.every(field => !errors[field]);
}, [currentStep, formData, errors, hasValidatedCurrentStep]);
```

### 4. Update navigation functions:

```jsx
const goToNextStep = useCallback(() => {
    if (validateCurrentStep()) { // Use the new function
        setCompletedSteps(prev => new Set([...prev, currentStep]));
        if (currentStep < STEPS.length) {
            setCurrentStep(prev => prev + 1);
            setHasValidatedCurrentStep(false);
        }
    }
}, [currentStep, validateCurrentStep]);
```

### 5. Update the App.tsx import:

Update the import in `apps/frontend/src/App.tsx`:

```jsx
// Change this line:
import BetaApplication from './components/BetaApplication/BetaApplication.enhanced';

// To this:
import BetaApplication from './components/BetaApplication/BetaApplication.enhanced.fixed';
```

## Key Changes Made

1. **Separated validation logic**: Split `validateStep` into a pure function (`validateStepFields`) and a state-setting function (`validateCurrentStep`)
2. **Added validation tracking**: Added `hasValidatedCurrentStep` state to control when validation errors are shown
3. **Fixed canProceed calculation**: Used `useMemo` instead of calling validation during render
4. **Reset validation state**: Reset `hasValidatedCurrentStep` when navigating between steps or changing form data

## Result

After implementing these changes, the beta application page should load without the React Error #301, and the form validation will work correctly without causing infinite re-renders.

## Testing

To test the fix:
1. Navigate to `/beta/application`
2. The page should load without errors
3. Form validation should work normally
4. Step navigation should function correctly
5. No infinite loading or error boundaries should appear

## Prevention

To prevent similar issues in the future:
- Never call state-setting functions directly during render
- Use `useCallback` and `useMemo` appropriately to prevent unnecessary re-renders
- Separate pure functions from state-setting functions
- Always test form components thoroughly for validation loops