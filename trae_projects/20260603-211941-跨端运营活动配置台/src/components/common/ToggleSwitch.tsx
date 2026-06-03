interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const ToggleSwitch = ({ checked, onChange, disabled = false }: ToggleSwitchProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
        ${checked ? 'bg-teal-500' : 'bg-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow
          transition-transform duration-200 ease-in-out
          ${checked ? 'translate-x-4' : 'translate-x-0.5'}
        `}
      />
    </button>
  );
};
