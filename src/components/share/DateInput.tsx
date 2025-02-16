import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
interface DateInputProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    id: string;
}

const DateInput: React.FC<DateInputProps> = ({ value, onChange, label, id }) => {
    return (
        <div className="mb-6">
            <label htmlFor={id} className="block text-gray-300 mb-2">
                {label}
            </label>
            <div className="relative group">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-hover:text-blue-400 z-10" />
                <input
                    id={id}
                    type="date"
                    value={value}
                    onChange={onChange}
                    className="w-full bg-gray-800 text-gray-100 rounded-lg pl-12 pr-4 py-3 border border-gray-700
                   focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all
                   group-hover:border-blue-400/50
                   [&::-webkit-calendar-picker-indicator]:bg-transparent
                   [&::-webkit-calendar-picker-indicator]:hover:cursor-pointer
                   [&::-webkit-calendar-picker-indicator]:absolute
                   [&::-webkit-calendar-picker-indicator]:left-0
                   [&::-webkit-calendar-picker-indicator]:right-0
                   [&::-webkit-calendar-picker-indicator]:top-0
                   [&::-webkit-calendar-picker-indicator]:bottom-0
                   [&::-webkit-calendar-picker-indicator]:appearance-none
                   [&::-webkit-calendar-picker-indicator]:opacity-0"
                    placeholder="dd/mm/aaaa"
                />
            </div>
        </div>
    );
};

export default DateInput;