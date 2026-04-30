import React from "react";
import { Check, ChevronDown } from "lucide-react";

type SelectOption<T extends string> = {
  value: T;
  label: string;
};

type SelectProps<T extends string> = {
  value: T;
  options: Array<SelectOption<T>>;
  onChange: (value: T) => void;
  className?: string;
  disabled?: boolean;
};

const Select = <T extends string>({ value, options, onChange, className = "", disabled = false }: SelectProps<T>) => {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const optionRefs = React.useRef(new Map<T, HTMLButtonElement | null>());
  const listboxId = React.useId();

  const selectedOption = React.useMemo(() => options.find((option) => option.value === value) ?? null, [options, value]);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const selectedButton = optionRefs.current.get(value);
    window.requestAnimationFrame(() => {
      selectedButton?.focus();
    });
  }, [open, value]);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const commitSelection = (nextValue: T) => {
    onChange(nextValue);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const focusOptionByIndex = (index: number) => {
    const target = options[index];
    if (!target) {
      return;
    }
    optionRefs.current.get(target.value)?.focus();
  };

  const handleOptionKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number, optionValue: T) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusOptionByIndex((index + 1) % options.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusOptionByIndex((index - 1 + options.length) % options.length);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusOptionByIndex(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusOptionByIndex(options.length - 1);
      return;
    }

    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      commitSelection(optionValue);
    }
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === " " || event.key === "Enter") {
      event.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        className="app-select-trigger"
        onClick={() => {
          if (!disabled) {
            setOpen((current) => !current);
          }
        }}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className="truncate">{selectedOption?.label ?? ""}</span>
        <ChevronDown size={16} className={`shrink-0 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="app-select-menu-wrap">
          <ul id={listboxId} role="listbox" className="app-select-menu">
            {options.map((option, index) => {
              const selected = option.value === value;
              return (
                <li key={option.value}>
                  <button
                    ref={(node) => {
                      optionRefs.current.set(option.value, node);
                    }}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={`app-select-option ${selected ? "is-selected" : ""}`}
                    onClick={() => commitSelection(option.value)}
                    onKeyDown={(event) => handleOptionKeyDown(event, index, option.value)}
                  >
                    <span>{option.label}</span>
                    {selected ? <Check size={15} className="shrink-0 text-brand-600" /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default Select;
