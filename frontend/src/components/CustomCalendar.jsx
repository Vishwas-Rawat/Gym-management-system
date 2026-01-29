import React, { useState, useEffect, useRef } from 'react';
import { 
    format, 
    addMonths, 
    subMonths, 
    startOfMonth, 
    endOfMonth, 
    eachDayOfInterval, 
    isSameMonth, 
    isSameDay, 
    isToday, 
    startOfWeek, 
    endOfWeek 
} from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const IconChevronLeft = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

const IconChevronRight = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);

const IconCalendar = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

const CustomCalendar = ({ selectedDate, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const calendarRef = useRef(null);

    // Sync current month view when selectedDate changes externally
    useEffect(() => {
        if (selectedDate) {
            setCurrentMonth(new Date(selectedDate));
        }
    }, [selectedDate]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handlePrevMonth = (e) => {
        e.stopPropagation();
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const handleNextMonth = (e) => {
        e.stopPropagation();
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const handleDateClick = (day) => {
        const formattedDate = format(day, 'yyyy-MM-dd');
        onChange(formattedDate);
        setIsOpen(false);
    };

    const handleTodayClick = () => {
        const today = new Date();
        onChange(format(today, 'yyyy-MM-dd'));
        setCurrentMonth(today);
        setIsOpen(false);
    };

    // Generate days
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div style={{ position: 'relative' }} ref={calendarRef}>
            {/* Trigger Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    background: 'rgba(30, 41, 59, 0.8)', 
                    padding: '0.75rem 1.25rem', 
                    borderRadius: '16px', 
                    border: isOpen ? '1px solid #38bdf8' : '1px solid #334155',
                    color: '#f8fafc',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(8px)',
                    minWidth: '200px',
                    maxWidth: '100%',
                    justifyContent: 'space-between',
                    boxShadow: isOpen ? '0 0 0 2px rgba(56, 189, 248, 0.1)' : 'none'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <IconCalendar />
                    <span style={{ fontWeight: 600 }}>
                        {selectedDate ? format(new Date(selectedDate), 'EEE, MMM d, yyyy') : 'Select Date'}
                    </span>
                </div>
            </button>

            {/* Dropdown Calendar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        style={{
                            position: 'absolute',
                            top: '110%',
                            right: 0,
                            background: '#0f172a',
                            border: '1px solid #334155',
                            borderRadius: '20px',
                            padding: '1.25rem',
                            zIndex: 100,
                            boxShadow: '0 20px 50px -10px rgba(0,0,0,0.5)',
                            width: '320px',
                            maxWidth: 'calc(100vw - 2rem)', /* Prevent horizontal overflow */
                            overflow: 'hidden'
                        }}
                    >
                        {/* Inline script to prevent left overflow if right:0 pushes it out */}
                        <div style={{ display: 'none' }} ref={el => {
                            if (el && el.parentElement) {
                                const rect = el.parentElement.getBoundingClientRect();
                                if (rect.left < 0) {
                                    el.parentElement.style.left = '0';
                                    el.parentElement.style.right = 'auto';
                                }
                            }
                        }} />
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <button onClick={handlePrevMonth} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px' }}>
                                <IconChevronLeft />
                            </button>
                            <span style={{ fontWeight: 700, fontSize: '1rem', color: '#f1f5f9' }}>
                                {format(currentMonth, 'MMMM yyyy')}
                            </span>
                            <button onClick={handleNextMonth} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px' }}>
                                <IconChevronRight />
                            </button>
                        </div>

                        {/* Week Days */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '0.5rem', textAlign: 'center' }}>
                            {weekDays.map(day => (
                                <div key={day} style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', padding: '0.25rem' }}>
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Days Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                            {days.map((day, idx) => {
                                const isSelected = selectedDate ? isSameDay(day, new Date(selectedDate)) : false;
                                const isCurrentMonth = isSameMonth(day, monthStart);
                                const isTodayDate = isToday(day);

                                return (
                                    <div 
                                        key={idx}
                                        onClick={() => handleDateClick(day)}
                                        style={{
                                            padding: '0.5rem',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            borderRadius: '10px',
                                            background: isSelected ? 'linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)' : (isTodayDate ? 'rgba(56, 189, 248, 0.1)' : 'transparent'),
                                            color: isSelected ? 'white' : (!isCurrentMonth ? '#334155' : '#e2e8f0'),
                                            fontWeight: isSelected || isTodayDate ? 700 : 400,
                                            border: isTodayDate && !isSelected ? '1px solid #38bdf8' : 'none',
                                            transition: 'all 0.1s'
                                        }}
                                        onMouseEnter={(e) => !isSelected && (e.target.style.background = 'rgba(255,255,255,0.05)')}
                                        onMouseLeave={(e) => !isSelected && (e.target.style.background = isTodayDate ? 'rgba(56, 189, 248, 0.1)' : 'transparent')}
                                    >
                                        {format(day, 'd')}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div style={{ borderTop: '1px solid #1e293b', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                            <button 
                                onClick={handleTodayClick}
                                style={{ 
                                    background: 'transparent', 
                                    border: 'none', 
                                    color: '#38bdf8', 
                                    fontSize: '0.9rem', 
                                    fontWeight: 600, 
                                    cursor: 'pointer' 
                                }}
                            >
                                Jump to Today
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomCalendar;
