/**
 * Haptic Feedback Utility
 * 
 * Provides vibration patterns for different interaction types.
 * Gracefully degrades if Vibration API is not supported.
 */

/**
 * Check if haptic feedback is supported on this device
 */
export const isHapticsSupported = (): boolean => {
  return 'vibrate' in navigator && typeof navigator.vibrate === 'function';
};

/**
 * Haptic feedback patterns
 */
export const haptics = {
  /**
   * Light tap - Subtle feedback for teal/cognitive actions
   * Use for: Button taps, list selections, tab switches
   */
  light: (): void => {
    if (isHapticsSupported()) {
      navigator.vibrate(10);
    }
  },

  /**
   * Medium tap - Moderate feedback for blue/structural actions
   * Use for: Toggle switches, checkbox selections
   */
  medium: (): void => {
    if (isHapticsSupported()) {
      navigator.vibrate(20);
    }
  },

  /**
   * Success pattern - Triple tap for emerald/success states
   * Use for: Form submissions, completed actions, achievements
   */
  success: (): void => {
    if (isHapticsSupported()) {
      navigator.vibrate([10, 50, 10]);
    }
  },

  /**
   * Action pattern - Bold feedback for orange CTAs
   * Use for: Primary action buttons, start/stop recording
   */
  action: (): void => {
    if (isHapticsSupported()) {
      navigator.vibrate([15, 30, 15]);
    }
  },

  /**
   * Error pattern - Strong feedback for validation errors
   * Use for: Form errors, failed actions, warnings
   */
  error: (): void => {
    if (isHapticsSupported()) {
      navigator.vibrate([50, 100, 50]);
    }
  },

  /**
   * Selection - Very subtle for list item selection
   * Use for: Selecting items in a list, scrolling through options
   */
  selection: (): void => {
    if (isHapticsSupported()) {
      navigator.vibrate(5);
    }
  },
};

/**
 * Color-semantic haptic mapping
 * Maps color usage to appropriate haptic feedback
 */
export const colorHaptics = {
  teal: haptics.light,      // Cognitive clarity
  emerald: haptics.success, // Growth and healing
  orange: haptics.action,   // Action and urgency
  blue: haptics.medium,     // Trust and stability
  purple: haptics.medium,   // Empowerment
};

export default haptics;
