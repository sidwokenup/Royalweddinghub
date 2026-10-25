"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Sparkles, Check } from "lucide-react";

export interface RoyalDatePickerProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  theme?: "light" | "dark";
  autoFocus?: boolean;
  required?: boolean;
  className?: string;
  helperText?: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const SHORT_MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Popular wedding season shortcuts tailored for luxury Indian weddings
const QUICK_SEASONS = [
  "Nov 2025",
  "Dec 2025",
  "Jan 2026",
  "Feb 2026",
  "Winter 2025/26",
  "Spring 2026",
];

export function RoyalDatePicker({
  id = "wedding-date-picker",
  name = "weddingDate",
  value,
  onChange,
  placeholder = "e.g. November 2025 or select a date",
  theme = "light",
  autoFocus = false,
  required = false,
  className = "",
  helperText,
}: RoyalDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Parse existing date or default to current / upcoming month
  const today = new Date();
  
  // Try to parse existing string into year/month if it's a parseable date
  const parseInitialDate = () => {
    if (!value) return { month: today.getMonth(), year: today.getFullYear(), day: null };
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
      return {
        month: parsed.getMonth(),
        year: parsed.getFullYear(),
        day: parsed.getDate(),
      };
    }
    // Check if month name is in the string
    for (let i = 0; i < MONTH_NAMES.length; i++) {
      if (value.toLowerCase().includes(MONTH_NAMES[i].toLowerCase()) || value.toLowerCase().includes(SHORT_MONTH_NAMES[i].toLowerCase())) {
        const yearMatch = value.match(/\b(202[5-9]|203[0-5])\b/);
        return {
          month: i,
          year: yearMatch ? parseInt(yearMatch[0], 10) : today.getFullYear(),
          day: null,
        };
      }
    }
    return { month: today.getMonth(), year: today.getFullYear(), day: null };
  };

  const initial = parseInitialDate();
  const [viewMonth, setViewMonth] = useState<number>(initial.month);
  const [viewYear, setViewYear] = useState<number>(initial.year);

  // Close calendar popover on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Handle month navigation
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Generate day grid
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  // Format date selection: e.g. "14 November 2025"
  const handleSelectDate = (day: number) => {
    const selectedDate = new Date(viewYear, viewMonth, day);
    const dayStr = String(day).padStart(2, "0");
    const monthName = MONTH_NAMES[viewMonth];
    const formatted = `${dayStr} ${monthName} ${viewYear}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const handleSelectSeason = (season: string) => {
    onChange(season);
    setIsOpen(false);
  };

  // Check if a day is today
  const isDayToday = (day: number) => {
    return (
      today.getDate() === day &&
      today.getMonth() === viewMonth &&
      today.getFullYear() === viewYear
    );
  };

  // Check if a day is in the past
  const isDayPast = (day: number) => {
    const checkDate = new Date(viewYear, viewMonth, day, 23, 59, 59);
    return checkDate < today;
  };

  // Check if a day matches current value
  const isDaySelected = (day: number) => {
    if (!value) return false;
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
      return (
        parsed.getDate() === day &&
        parsed.getMonth() === viewMonth &&
        parsed.getFullYear() === viewYear
      );
    }
    const dayStr = String(day).padStart(2, "0");
    const fullCheck = `${dayStr} ${MONTH_NAMES[viewMonth]} ${viewYear}`;
    const altCheck = `${day} ${MONTH_NAMES[viewMonth]} ${viewYear}`;
    return value.toLowerCase().includes(fullCheck.toLowerCase()) || value.toLowerCase().includes(altCheck.toLowerCase());
  };

  const isLight = theme === "light";

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input Group */}
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Open wedding date calendar"
          title="Click to pick a date from calendar"
          className={`absolute left-0 inset-y-0 pl-3.5 pr-2 flex items-center justify-center transition-colors cursor-pointer group ${
            isLight
              ? "text-[#521D2B] hover:text-[#3D1520]"
              : "text-[#d4af37] hover:text-[#f3e5d8]"
          }`}
        >
          <div className="p-1 rounded transition-transform group-hover:scale-110">
            <CalendarIcon size={18} strokeWidth={1.8} />
          </div>
        </button>

        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          value={value}
          autoFocus={autoFocus}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onClick={() => {
            if (!isOpen) setIsOpen(true);
          }}
          className={`w-full pl-11 pr-20 py-3.5 sm:py-4 rounded-[2px] text-sm sm:text-base outline-none transition-all shadow-sm ${
            isLight
              ? "bg-[#FDFBF7] border border-[#D8CBBE] focus:border-[#521D2B] text-[#211A19] placeholder-[#9E948A] focus:ring-1 focus:ring-[#521D2B]/20"
              : "bg-black/40 border border-white/20 focus:border-[#f3e5d8] text-white placeholder-white/30 focus:ring-1 focus:ring-[#f3e5d8]"
          } ${className}`}
        />

        {/* Right Action: Clear / Calendar Trigger Indicator */}
        <div className="absolute right-2 inset-y-0 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Clear date"
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isLight
                  ? "text-[#8C7D73] hover:text-[#211A19] hover:bg-[#E5DDD2]/50"
                  : "text-white/40 hover:text-white hover:bg-white/10"
              }`}
            >
              <X size={14} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={`px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider rounded transition-all cursor-pointer border ${
              isLight
                ? isOpen
                  ? "bg-[#521D2B] text-white border-[#521D2B]"
                  : "bg-[#FAF7F2] text-[#521D2B] border-[#D8CBBE] hover:border-[#521D2B]"
                : isOpen
                ? "bg-[#d4af37] text-black border-[#d4af37]"
                : "bg-white/10 text-[#d4af37] border-white/15 hover:border-[#d4af37]/40"
            }`}
          >
            {isOpen ? "Close" : "Calendar"}
          </button>
        </div>
      </div>

      {helperText && (
        <p className={`text-xs mt-1.5 ${isLight ? "text-[#78716C]" : "text-white/60"}`}>
          {helperText}
        </p>
      )}

      {/* Royal Calendar Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Calendar date picker"
          className={`absolute left-0 right-0 sm:right-auto sm:w-[328px] mt-2 z-50 p-4 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-200 animate-in fade-in-0 zoom-in-95 ${
            isLight
              ? "bg-[#FFFDF9]/98 border-[#D8CBBE] text-[#211A19] shadow-[0_16px_40px_rgba(82,29,43,0.14)]"
              : "bg-[#181210]/98 border-[#d4af37]/30 text-white shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
          }`}
        >
          {/* Calendar Header with Month/Year Navigation */}
          <div className="flex items-center justify-between pb-3 border-b mb-3 border-[#E5DDD2]/40">
            <div className="flex items-center gap-1.5">
              <span className={`text-xs uppercase tracking-[0.2em] font-semibold ${
                isLight ? "text-[#521D2B]" : "text-[#d4af37]"
              }`}>
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                aria-label="Previous month"
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  isLight
                    ? "hover:bg-[#E5DDD2]/60 text-[#211A19]"
                    : "hover:bg-white/10 text-white"
                }`}
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                onClick={nextMonth}
                aria-label="Next month"
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  isLight
                    ? "hover:bg-[#E5DDD2]/60 text-[#211A19]"
                    : "hover:bg-white/10 text-white"
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Quick Year Jump */}
          <div className="flex items-center justify-between gap-1 mb-3 text-[11px]">
            <span className={`text-[10px] uppercase tracking-wider ${isLight ? "text-[#8C7D73]" : "text-white/50"}`}>
              Year:
            </span>
            <div className="flex items-center gap-1">
              {[today.getFullYear(), today.getFullYear() + 1, today.getFullYear() + 2].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setViewYear(yr)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all cursor-pointer ${
                    viewYear === yr
                      ? isLight
                        ? "bg-[#521D2B] text-white font-medium"
                        : "bg-[#d4af37] text-black font-semibold"
                      : isLight
                      ? "hover:bg-[#E5DDD2]/50 text-[#78716C]"
                      : "hover:bg-white/10 text-white/70"
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAY_NAMES.map((d) => (
              <span
                key={d}
                className={`text-[11px] font-mono font-medium py-1 ${
                  isLight ? "text-[#8C7D73]" : "text-white/50"
                }`}
              >
                {d}
              </span>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Previous month filler days */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => {
              const dayNum = daysInPrevMonth - firstDayOfWeek + idx + 1;
              return (
                <div
                  key={`prev-${idx}`}
                  className={`h-8 flex items-center justify-center text-xs opacity-25 select-none ${
                    isLight ? "text-[#8C7D73]" : "text-white/40"
                  }`}
                >
                  {dayNum}
                </div>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const selected = isDaySelected(day);
              const isToday = isDayToday(day);
              const isPast = isDayPast(day);

              return (
                <button
                  key={`curr-${day}`}
                  type="button"
                  onClick={() => handleSelectDate(day)}
                  className={`h-8 rounded-md flex flex-col items-center justify-center text-xs font-medium transition-all cursor-pointer relative ${
                    selected
                      ? isLight
                        ? "bg-[#521D2B] text-[#FAF7F2] shadow-md font-semibold ring-2 ring-[#D6B56D]"
                        : "bg-[#d4af37] text-[#16110E] shadow-md font-semibold ring-2 ring-white/50"
                      : isPast
                      ? isLight
                        ? "text-[#B5AAA0] hover:bg-[#E5DDD2]/30"
                        : "text-white/30 hover:bg-white/5"
                      : isLight
                      ? "text-[#211A19] hover:bg-[#521D2B]/10 hover:text-[#521D2B]"
                      : "text-white hover:bg-[#d4af37]/20 hover:text-[#d4af37]"
                  }`}
                >
                  <span>{day}</span>
                  {isToday && !selected && (
                    <span
                      className={`w-1 h-1 rounded-full absolute bottom-1 ${
                        isLight ? "bg-[#521D2B]" : "bg-[#d4af37]"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Wedding Season & Quick Shortcuts */}
          <div className={`mt-3.5 pt-3 border-t ${isLight ? "border-[#E5DDD2]" : "border-white/10"}`}>
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={11} className={isLight ? "text-[#521D2B]" : "text-[#d4af37]"} />
              <span className={`text-[10px] uppercase tracking-wider font-semibold ${
                isLight ? "text-[#521D2B]" : "text-[#d4af37]"
              }`}>
                Or Pick Tentative Season:
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_SEASONS.map((season) => {
                const isActive = value === season;
                return (
                  <button
                    key={season}
                    type="button"
                    onClick={() => handleSelectSeason(season)}
                    className={`px-2 py-1 rounded text-[11px] transition-all cursor-pointer border flex items-center gap-1 ${
                      isActive
                        ? isLight
                          ? "bg-[#521D2B] text-white border-[#521D2B]"
                          : "bg-[#d4af37] text-black border-[#d4af37] font-semibold"
                        : isLight
                        ? "bg-[#FAF7F2] border-[#E5DDD2] text-[#57534E] hover:border-[#521D2B] hover:text-[#211A19]"
                        : "bg-white/5 border-white/10 text-white/80 hover:border-[#d4af37]/50 hover:text-white"
                    }`}
                  >
                    <span>{season}</span>
                    {isActive && <Check size={11} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Footer Actions */}
          <div className={`mt-3 pt-2.5 flex items-center justify-between border-t ${
            isLight ? "border-[#E5DDD2]" : "border-white/10"
          }`}>
            <button
              type="button"
              onClick={() => handleSelectDate(today.getDate())}
              className={`text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
                isLight ? "text-[#78716C] hover:text-[#211A19]" : "text-white/60 hover:text-white"
              }`}
            >
              Select Today
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer ${
                isLight
                  ? "bg-[#521D2B] hover:bg-[#3D1520] text-white"
                  : "bg-[#d4af37] hover:bg-[#c29f2f] text-black"
              }`}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
