import React, { useState } from 'react';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format, set } from 'date-fns';

export function DateTimePickerModal({ isOpen, onClose, onConfirm, initialDateTime }) {
  const [selectedDate, setSelectedDate] = useState(initialDateTime || new Date());
  const [hours, setHours] = useState(initialDateTime?.getHours() || 12);
  const [minutes, setMinutes] = useState(initialDateTime?.getMinutes() || 0);
  const [period, setPeriod] = useState(initialDateTime?.getHours() >= 12 ? 'PM' : 'AM');
  const [view, setView] = useState('date'); // 'date' or 'time'

  const handleHourChange = (increment) => {
    let newHours = hours + increment;
    if (newHours > 12) newHours = 1;
    if (newHours < 1) newHours = 12;
    setHours(newHours);
  };

  const handleMinuteChange = (increment) => {
    let newMinutes = minutes + increment;
    if (newMinutes > 59) newMinutes = 0;
    if (newMinutes < 0) newMinutes = 59;
    setMinutes(newMinutes);
  };

  const togglePeriod = () => {
    setPeriod(period === 'AM' ? 'PM' : 'AM');
  };

  const handleConfirm = () => {
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) hour24 += 12;
    if (period === 'AM' && hours === 12) hour24 = 0;

    const combinedDateTime = set(selectedDate, {
      hours: hour24,
      minutes: minutes,
      seconds: 0
    });
    onConfirm(combinedDateTime);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Select Date & Time</h2>
            <button onClick={onClose} className="p-1 hover:bg-blue-700/50 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-2 text-blue-100 font-medium">
            {format(
              set(selectedDate, {
                hours: hours,
                minutes: minutes
              }),
              'PPP'
            )}{' '}
            at {hours}:{minutes.toString().padStart(2, '0')} {period}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setView('date')}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                view === 'date'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Date
            </button>
            <button
              onClick={() => setView('time')}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                view === 'time'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Time
            </button>
          </div>

          <div className="flex justify-center">
            {view === 'date' ? (
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                disabled={{ before: new Date() }}
                className="border rounded-lg p-3"
              />
            ) : (
              <div className="p-6 flex justify-center items-center">
                <div className="flex items-center space-x-4">
                  {/* Hours */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleHourChange(1)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ChevronUp className="w-6 h-6 text-blue-600" />
                    </button>
                    <div className="w-16 h-16 flex items-center justify-center text-3xl font-bold border-2 border-blue-600 rounded-xl">
                      {hours.toString().padStart(2, '0')}
                    </div>
                    <button
                      onClick={() => handleHourChange(-1)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ChevronDown className="w-6 h-6 text-blue-600" />
                    </button>
                  </div>

                  <div className="text-3xl font-bold">:</div>

                  {/* Minutes */}
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => handleMinuteChange(1)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ChevronUp className="w-6 h-6 text-blue-600" />
                    </button>
                    <div className="w-16 h-16 flex items-center justify-center text-3xl font-bold border-2 border-blue-600 rounded-xl">
                      {minutes.toString().padStart(2, '0')}
                    </div>
                    <button
                      onClick={() => handleMinuteChange(-1)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ChevronDown className="w-6 h-6 text-blue-600" />
                    </button>
                  </div>

                  {/* AM/PM */}
                  <button
                    onClick={togglePeriod}
                    className="w-16 h-16 flex items-center justify-center text-xl font-bold border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    {period}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}