import React, { useState, useEffect } from 'react';
import { Calendar, Save, Target, X, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SettingsPanel = ({ birthDate, setBirthDate }) => {
  const [tempBirthDate, setTempBirthDate] = useState(birthDate || '2000-01-01');
  const [goals, setGoals] = useState([]); // [{ title, deadline }]
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');

  // লোকাল স্টোরেজ থেকে গোল লোড
  useEffect(() => {
    const savedGoals = localStorage.getItem('goalsList');
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (e) {
        console.error('Error parsing goalsList', e);
        setGoals([]);
      }
    }
  }, []);

  const handleSaveBirthDate = () => {
    setBirthDate(tempBirthDate);
    toast.success('Birth date saved');
  };

  const handleAddGoal = () => {
    if (!newGoalTitle.trim() || !newGoalDeadline) {
      toast.error('Please fill both fields');
      return;
    }
    const newGoal = {
      title: newGoalTitle,
      deadline: newGoalDeadline,
    };
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    localStorage.setItem('goalsList', JSON.stringify(updatedGoals));
    setNewGoalTitle('');
    setNewGoalDeadline('');
    toast.success('Goal added');
  };

  const handleRemoveGoal = (index) => {
    const updatedGoals = goals.filter((_, i) => i !== index);
    setGoals(updatedGoals);
    localStorage.setItem('goalsList', JSON.stringify(updatedGoals));
    toast.success('Goal removed');
  };

  const handleClearAllGoals = () => {
    if (goals.length === 0) return;
    setGoals([]);
    localStorage.removeItem('goalsList');
    toast.success('All goals cleared');
  };

  // আজকের তারিখ ফরম্যাট
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
        <Calendar className="text-blue-500" />
        Life Settings
      </h2>

      {/* আজকের তারিখ দেখানো */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center gap-3">
        <Calendar className="text-blue-600 dark:text-blue-400" size={24} />
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Today's Date</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{formattedDate}</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* জন্ম তারিখ সেকশন */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Calendar size={20} className="text-blue-500" /> Birth Date
          </h3>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="date"
              value={tempBirthDate}
              onChange={(e) => setTempBirthDate(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleSaveBirthDate}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition"
            >
              <Save size={16} /> Save Birth Date
            </button>
          </div>
          <p className="text-xs text-gray-500">Used for Life Timer and Life Timeline.</p>
        </div>

        {/* মাল্টিপল গোল কাউন্টডাউন সেকশন */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Target size={20} className="text-purple-500" /> Multiple Goals Countdown
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add multiple goals with deadlines. They will appear in the Life Timer tab.
          </p>

          {/* নতুন গোল যোগ করার ফর্ম */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              placeholder="Goal title"
              className="col-span-1 md:col-span-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <input
              type="date"
              value={newGoalDeadline}
              onChange={(e) => setNewGoalDeadline(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="col-span-1 md:col-span-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleAddGoal}
              className="col-span-1 md:col-span-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition"
            >
              <Plus size={16} /> Add Goal
            </button>
          </div>

          {/* গোল লিস্ট */}
          {goals.length > 0 && (
            <div className="space-y-3 mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Goals:</h4>
              {goals.map((goal, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{goal.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Deadline: {new Date(goal.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveGoal(index)}
                    className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition"
                    title="Remove goal"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
              <button
                onClick={handleClearAllGoals}
                className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
              >
                Clear All Goals
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;