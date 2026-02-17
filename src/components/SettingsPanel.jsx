import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  Calendar,
  Save,
  Target,
  X,
  Palette,
  Type,
  Cloud,
  Download,
  Upload,
  Plus,
  Sun,
  Moon,
  RotateCcw,
  Edit2,
  Check,
  AlertCircle,
} from 'lucide-react';

const SettingsPanel = ({ birthDate, setBirthDate, theme, setTheme }) => {
  const [tempBirthDate, setTempBirthDate] = useState(birthDate || '2000-01-01');
  const [goals, setGoals] = useState([]);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');
  const [editingGoalIndex, setEditingGoalIndex] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDeadline, setEditDeadline] = useState('');

  // Theme customization
  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem('primaryColor') || '#3b82f6';
  });
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('fontSize') || 'medium';
  });

  // Load goals from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('goalsList');
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (e) {
        setGoals([]);
      }
    }
  }, []);

  // Apply primary color
  useEffect(() => {
    document.documentElement.style.setProperty('--primary', primaryColor);
    localStorage.setItem('primaryColor', primaryColor);
  }, [primaryColor]);

  // Apply font size
  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === 'small') root.style.fontSize = '14px';
    else if (fontSize === 'medium') root.style.fontSize = '16px';
    else if (fontSize === 'large') root.style.fontSize = '18px';
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  // Toggle light/dark theme
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Save birth date
  const handleSaveBirthDate = () => {
    setBirthDate(tempBirthDate);
    toast.success('Birth date saved');
  };

  // Validate deadline (not in the past)
  const isValidDeadline = (dateString) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const deadline = new Date(dateString).setHours(0, 0, 0, 0);
    return deadline >= today;
  };

  // Add goal
  const handleAddGoal = () => {
    if (!newGoalTitle.trim() || !newGoalDeadline) {
      toast.error('Please fill both fields');
      return;
    }
    if (!isValidDeadline(newGoalDeadline)) {
      toast.error('Deadline cannot be in the past');
      return;
    }
    const newGoal = {
      title: newGoalTitle.trim(),
      deadline: newGoalDeadline,
    };
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    localStorage.setItem('goalsList', JSON.stringify(updatedGoals));
    setNewGoalTitle('');
    setNewGoalDeadline('');
    toast.success('Goal added');
  };

  // Remove goal
  const handleRemoveGoal = (index) => {
    if (window.confirm('Are you sure you want to remove this goal?')) {
      const updatedGoals = goals.filter((_, i) => i !== index);
      setGoals(updatedGoals);
      localStorage.setItem('goalsList', JSON.stringify(updatedGoals));
      toast.success('Goal removed');
    }
  };

  // Start editing goal
  const startEditGoal = (index) => {
    setEditingGoalIndex(index);
    setEditTitle(goals[index].title);
    setEditDeadline(goals[index].deadline);
  };

  // Save edited goal
  const saveEditGoal = () => {
    if (!editTitle.trim() || !editDeadline) {
      toast.error('Please fill both fields');
      return;
    }
    if (!isValidDeadline(editDeadline)) {
      toast.error('Deadline cannot be in the past');
      return;
    }
    const updatedGoals = [...goals];
    updatedGoals[editingGoalIndex] = {
      title: editTitle.trim(),
      deadline: editDeadline,
    };
    setGoals(updatedGoals);
    localStorage.setItem('goalsList', JSON.stringify(updatedGoals));
    setEditingGoalIndex(null);
    toast.success('Goal updated');
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingGoalIndex(null);
  };

  // Clear all goals
  const handleClearAllGoals = () => {
    if (goals.length === 0) return;
    if (window.confirm('Are you sure you want to delete all goals?')) {
      setGoals([]);
      localStorage.removeItem('goalsList');
      toast.success('All goals cleared');
    }
  };

  // Reset theme to defaults
  const resetTheme = () => {
    setPrimaryColor('#3b82f6');
    setFontSize('medium');
    setTheme('light');
    toast.success('Theme reset to defaults');
  };

  // Export backup
  const handleExport = () => {
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      birthDate,
      theme,
      primaryColor,
      fontSize,
      goals,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daymate-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Backup exported');
  };

  // Import backup
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.birthDate) setBirthDate(data.birthDate);
        if (data.theme) setTheme(data.theme);
        if (data.primaryColor) setPrimaryColor(data.primaryColor);
        if (data.fontSize) setFontSize(data.fontSize);
        if (data.goals) {
          setGoals(data.goals);
          localStorage.setItem('goalsList', JSON.stringify(data.goals));
        }
        toast.success('Backup restored');
      } catch (err) {
        toast.error('Invalid backup file');
      }
    };
    reader.readAsText(file);
  };

  // Cloud backup simulation
  const handleCloudBackup = () => {
    toast.success('Opening Google Drive... (simulated)');
    window.open('https://drive.google.com', '_blank');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg max-w-2xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
        <Calendar className="text-blue-500" />
        Life Settings
      </h2>

      {/* Birth Date */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Birth Date</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="date"
            value={tempBirthDate}
            onChange={(e) => setTempBirthDate(e.target.value)}
            className="w-full sm:flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-base"
          />
          <button
            onClick={handleSaveBirthDate}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      {/* Multiple Goals Management */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
          <Target size={20} className="text-purple-500" /> Goals Countdown
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Add multiple goals with deadlines. They will appear in the Life Timer tab.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <input
            type="text"
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            placeholder="Goal title"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-base"
          />
          <input
            type="date"
            value={newGoalDeadline}
            onChange={(e) => setNewGoalDeadline(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-base"
          />
          <button
            onClick={handleAddGoal}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Plus size={16} /> Add Goal
          </button>
        </div>

        {goals.length > 0 && (
          <div className="space-y-2">
            {goals.map((goal, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg gap-2">
                {editingGoalIndex === index ? (
                  // Edit mode
                  <div className="flex-1 flex flex-col sm:flex-row gap-2 w-full">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded bg-white dark:bg-gray-600 text-sm"
                      placeholder="Goal title"
                    />
                    <input
                      type="date"
                      value={editDeadline}
                      onChange={(e) => setEditDeadline(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="flex-1 px-3 py-2 border rounded bg-white dark:bg-gray-600 text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveEditGoal}
                        className="p-2 text-green-600 hover:text-green-800 dark:text-green-400"
                        title="Save"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400"
                        title="Cancel"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white break-words">{goal.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 self-end sm:self-center">
                      <button
                        onClick={() => startEditGoal(index)}
                        className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        title="Edit goal"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleRemoveGoal(index)}
                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400"
                        title="Remove goal"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            <button
              onClick={handleClearAllGoals}
              className="mt-2 w-full sm:w-auto px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 min-h-[44px]"
            >
              Clear All Goals
            </button>
          </div>
        )}
      </div>

      {/* Theme Customization */}
      <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
          <Palette size={20} className="text-amber-500" /> Theme Customization
        </h3>
        <div className="space-y-4">
          {/* Primary Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Primary Color
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">{primaryColor}</span>
              <div
                className="w-12 h-12 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: primaryColor }}
              ></div>
            </div>
          </div>
          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Font Size
            </label>
            <div className="flex flex-wrap gap-2">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition min-h-[44px] ${
                    fontSize === size
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                  }`}
                >
                  {size === 'small' ? 'ছোট' : size === 'medium' ? 'মাঝারি' : 'বড়'}
                </button>
              ))}
            </div>
          </div>
          {/* Light/Dark Mode */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Light / Dark Mode
            </label>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg min-h-[44px]"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              <span>{theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}</span>
            </button>
            <p className="text-xs text-gray-500 mt-1">
              (You can also toggle from the header)
            </p>
          </div>
          {/* Reset to Defaults */}
          <div className="flex justify-end">
            <button
              onClick={resetTheme}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm min-h-[44px]"
            >
              <RotateCcw size={16} /> Reset to Defaults
            </button>
          </div>
        </div>
      </div>

      {/* Backup & Cloud */}
      <div className="mb-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl border border-cyan-200 dark:border-cyan-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
          <Cloud size={20} className="text-cyan-500" /> Backup & Restore
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Export your settings and goals to a file. You can later restore them.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="flex-1 sm:flex-none px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Download size={16} /> Export Backup
          </button>
          <label className="flex-1 sm:flex-none px-4 py-2 bg-cyan-100 hover:bg-cyan-200 text-cyan-800 rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer min-h-[44px]">
            <Upload size={16} /> Restore Backup
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <button
            onClick={handleCloudBackup}
            className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Cloud size={16} /> Save to Google Drive (Demo)
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
          <AlertCircle size={12} /> Google Drive integration is simulated.
        </p>
      </div>
    </div>
  );
};

export default SettingsPanel;