import React, { useState } from 'react';
import { Calendar, Save } from 'lucide-react';

const SettingsPanel = ({ birthDate, setBirthDate }) => {
  const [tempBirthDate, setTempBirthDate] = useState(birthDate || '2000-01-01');

  const handleSave = () => {
    setBirthDate(tempBirthDate);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
        <Calendar className="text-blue-500" />
        Life Settings
      </h2>

      <div className="space-y-6">
        {/* Birth Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Birth Date
          </label>
          <input
            type="date"
            value={tempBirthDate}
            onChange={(e) => setTempBirthDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
          />
          <p className="text-xs text-gray-500 mt-1">
            Used for Life Timer and Life Timeline.
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;