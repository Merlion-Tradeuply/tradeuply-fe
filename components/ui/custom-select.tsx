"use client";

import { CaretDown, Check } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

export type SelectOption = {
  label: string;
  value: string;
};

type CustomSelectProps = {
  error?: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  placeholder: string;
  value: string;
};

export function CustomSelect({
  error,
  id,
  label,
  onChange,
  options,
  placeholder,
  value,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const listboxId = `${id}-listbox`;

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  function openSelect() {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setIsOpen(true);
  }

  function selectOption(index: number) {
    const option = options[index];
    if (!option) return;

    onChange(option.value);
    setActiveIndex(index);
    setIsOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();

      if (!isOpen) {
        openSelect();
        return;
      }

      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) => (current + direction + options.length) % options.length);
      return;
    }

    if (event.key === "Home" && isOpen) {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === "End" && isOpen) {
      event.preventDefault();
      setActiveIndex(options.length - 1);
      return;
    }

    if ((event.key === "Enter" || event.key === " ") && isOpen) {
      event.preventDefault();
      selectOption(activeIndex);
      return;
    }

    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      setIsOpen(false);
    }
  }

  return (
    <div ref={rootRef}>
      <label className="text-sm font-extrabold text-[var(--color-ink)]" htmlFor={id}>
        {label}
      </label>
      <div className="relative mt-2.5">
        <button
          aria-activedescendant={isOpen ? `${id}-option-${activeIndex}` : undefined}
          aria-controls={listboxId}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-invalid={Boolean(error)}
          className={`flex h-13 w-full items-center justify-between gap-3 rounded-xl border bg-[#f8faf9] px-4 text-left text-sm font-bold outline-none transition focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/10 ${
            error ? "border-[#dc765a]" : isOpen ? "border-[var(--color-brand)]" : "border-[var(--color-border)]"
          }`}
          id={id}
          onClick={() => (isOpen ? setIsOpen(false) : openSelect())}
          onKeyDown={handleKeyDown}
          role="combobox"
          type="button"
        >
          <span className={selectedOption ? "text-[var(--color-ink)]" : "text-slate-400"}>
            {selectedOption?.label ?? placeholder}
          </span>
          <CaretDown
            aria-hidden="true"
            className={`shrink-0 text-[var(--color-text-muted)] transition duration-200 ${isOpen ? "rotate-180" : ""}`}
            size={18}
            weight="bold"
          />
        </button>

        {isOpen && (
          <div
            aria-label={label}
            className="absolute z-40 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-white p-2 shadow-[0_20px_55px_rgba(18,45,72,0.16)]"
            id={listboxId}
            role="listbox"
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isActive = index === activeIndex;

              return (
                <button
                  aria-selected={isSelected}
                  className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition ${
                    isSelected
                      ? "bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]"
                      : isActive
                        ? "bg-slate-100 text-[var(--color-ink)]"
                        : "text-[var(--color-ink-soft)] hover:bg-slate-100"
                  }`}
                  id={`${id}-option-${index}`}
                  key={option.value}
                  onClick={() => selectOption(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  role="option"
                  type="button"
                >
                  {option.label}
                  {isSelected && <Check aria-hidden="true" size={17} weight="bold" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-xs font-semibold text-[#b94f32]" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
