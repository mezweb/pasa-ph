/**
 * Form Helper Utilities
 *
 * Functions for form validation, error handling, and auto-scrolling
 */

/**
 * Scroll to the first error in a form
 * @param {string} errorSelector - CSS selector for error elements (default: '.error, [data-error="true"]')
 * @param {number} offset - Offset from top in pixels (default: 100)
 */
export function scrollToError(errorSelector = '.error, [data-error="true"]', offset = 100) {
  const firstError = document.querySelector(errorSelector);

  if (firstError) {
    const elementPosition = firstError.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    // Focus on the error element if it's an input
    if (firstError.tagName === 'INPUT' || firstError.tagName === 'TEXTAREA' || firstError.tagName === 'SELECT') {
      setTimeout(() => {
        firstError.focus();
      }, 500); // Wait for scroll to complete
    }
  }
}

/**
 * Scroll to a specific field by name or id
 * @param {string} fieldId - ID or name of the field
 * @param {number} offset - Offset from top in pixels (default: 100)
 */
export function scrollToField(fieldId, offset = 100) {
  const field = document.getElementById(fieldId) || document.querySelector(`[name="${fieldId}"]`);

  if (field) {
    const elementPosition = field.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    setTimeout(() => {
      field.focus();
    }, 500);
  }
}

/**
 * Validate form and scroll to first error
 * @param {Object} errors - Object containing field errors { fieldName: 'error message' }
 * @param {Object} fieldRefs - Object containing field refs { fieldName: ref }
 * @returns {boolean} - True if form is valid
 */
export function validateAndScroll(errors, fieldRefs = {}) {
  const errorFields = Object.keys(errors).filter(key => errors[key]);

  if (errorFields.length > 0) {
    const firstErrorField = errorFields[0];

    // Try to scroll using ref
    if (fieldRefs[firstErrorField]?.current) {
      const element = fieldRefs[firstErrorField].current;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 100;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      setTimeout(() => {
        element.focus();
      }, 500);
    } else {
      // Fallback to scrollToField
      scrollToField(firstErrorField);
    }

    return false;
  }

  return true;
}

/**
 * Basic form validation
 * @param {Object} formData - Form data object
 * @param {Object} rules - Validation rules { fieldName: { required: true, minLength: 3, ... } }
 * @returns {Object} - Errors object
 */
export function validateForm(formData, rules) {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = rules[field];

    // Required check
    if (fieldRules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors[field] = fieldRules.message || `${field} is required`;
      return;
    }

    // Skip other validations if field is empty and not required
    if (!value) return;

    // Min length check
    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      errors[field] = fieldRules.message || `${field} must be at least ${fieldRules.minLength} characters`;
      return;
    }

    // Max length check
    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors[field] = fieldRules.message || `${field} must be no more than ${fieldRules.maxLength} characters`;
      return;
    }

    // Email validation
    if (fieldRules.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors[field] = fieldRules.message || 'Please enter a valid email address';
        return;
      }
    }

    // Phone validation
    if (fieldRules.phone) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value)) {
        errors[field] = fieldRules.message || 'Please enter a valid phone number';
        return;
      }
    }

    // URL validation
    if (fieldRules.url) {
      try {
        new URL(value);
      } catch {
        errors[field] = fieldRules.message || 'Please enter a valid URL';
        return;
      }
    }

    // Custom validation function
    if (fieldRules.custom && typeof fieldRules.custom === 'function') {
      const customError = fieldRules.custom(value, formData);
      if (customError) {
        errors[field] = customError;
        return;
      }
    }

    // Pattern matching
    if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
      errors[field] = fieldRules.message || `${field} format is invalid`;
      return;
    }
  });

  return errors;
}

/**
 * React hook for form validation with auto-scroll
 * Usage:
 * const { errors, validate, clearError } = useFormValidation(rules);
 */
export function useFormValidation(rules) {
  const [errors, setErrors] = React.useState({});

  const validate = (formData, fieldRefs = {}) => {
    const newErrors = validateForm(formData, rules);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      validateAndScroll(newErrors, fieldRefs);
      return false;
    }

    return true;
  };

  const clearError = (field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return { errors, validate, clearError, clearAllErrors };
}

/**
 * Auto-save form data to localStorage
 * @param {string} formKey - Unique key for the form
 * @param {Object} formData - Form data to save
 * @param {number} debounceMs - Debounce time in ms (default: 1000)
 */
export function autoSaveForm(formKey, formData, debounceMs = 1000) {
  // Create a debounced save function
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      try {
        localStorage.setItem(`form_autosave_${formKey}`, JSON.stringify(formData));
      } catch (error) {
        console.error('Error auto-saving form:', error);
      }
    }, debounceMs);
  };
}

/**
 * Load auto-saved form data
 * @param {string} formKey - Unique key for the form
 * @returns {Object|null} - Saved form data or null
 */
export function loadAutoSavedForm(formKey) {
  try {
    const saved = localStorage.getItem(`form_autosave_${formKey}`);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Error loading auto-saved form:', error);
    return null;
  }
}

/**
 * Clear auto-saved form data
 * @param {string} formKey - Unique key for the form
 */
export function clearAutoSavedForm(formKey) {
  try {
    localStorage.removeItem(`form_autosave_${formKey}`);
  } catch (error) {
    console.error('Error clearing auto-saved form:', error);
  }
}
