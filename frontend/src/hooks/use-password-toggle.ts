import { useState, useCallback } from "react";

interface UsePasswordToggleReturn {
  showPassword: boolean;
  togglePassword: () => void;
}

/**
 * Custom hook for toggling password visibility
 * Useful for password input fields with show/hide functionality
 */
export function usePasswordToggle(): UsePasswordToggleReturn {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return {
    showPassword,
    togglePassword,
  };
}