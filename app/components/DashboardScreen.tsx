import { Camera, Paperclip, Check, Zap, AlertCircle, ChevronRight, Lightbulb, Clock, Sparkles, Pencil, Trash2, X } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { useState, useRef } from 'react';
import logoImage from '../../assets/logo.jpg';
import { useAppContext } from '../App';
import type { SavedReflection } from '../App';

interface DashboardScreenProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  savedReflections: SavedReflection[];
  onSaveReflection: (reflection: Omit<SavedReflection, 'id' | 'timestamp'>) => void;
  onUpdateReflection: (id: string, updates: Partial<Omit<SavedReflection, 'id' | 'timestamp'>>) => void;
  onDeleteReflection: (id: string) => void;
}

export function DashboardScreen({ currentTab, onTabChange, savedReflections, onSaveReflection, onUpdateReflection, onDeleteReflection }: DashboardScreenProps) {
  const { darkMode, openQuickReflection } = useAppContext();
  const [selectedEnergy, setSelectedEnergy] = useState<number | null>(null);
  const [selectedEnergyTag, setSelectedEnergyTag] = useState<'energized' | 'neutral' | 'drained' | null>(null);
  const [notes, setNotes] = useState('');
  const [learning, setLearning] = useState('');
  const [title, setTitle] = useState('');
  const [toast, setToast] = useState<{message: string, icon?: 'check' | null, show: boolean}>({message: '', icon: null, show: false});
  const [expandedReflectionId, setExpandedReflectionId] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Array<{name: string, type: string, url: string}>>([]);

  // Edit mode state
  const [editingReflection, setEditingReflection] = useState<SavedReflection | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editLearning, setEditLearning] = useState('');
  const [editEnergy, setEditEnergy] = useState<number>(3);
  const [editEnergyTag, setEditEnergyTag] = useState<'energized' | 'neutral' | 'drained'>('neutral');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Dark mode colors
  const bgColor = darkMode ? 'bg-[#1a1a1a]' : 'bg-[#f5f1ed]';
  const cardBg = darkMode ? 'bg-[#2a2a2a]' : 'bg-white/90';
  const cardBgAlt = darkMode ? 'bg-[#2a2a2a]' : 'bg-white/80';
  const textPrimary = darkMode ? 'text-gray-100' : 'text-[#2a2520]';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-[#8b7355]';
  const inputBg = darkMode ? 'bg-[#333] border-gray-600' : 'bg-white border-gray-200';
  const inputText = darkMode ? 'text-gray-100 placeholder:text-gray-500' : 'text-[#2a2520] placeholder:text-gray-400';

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, icon?: 'check' | null) => {
    setToast({ message, icon, show: true });
    setTimeout(() => {
      setToast({ message: '', icon: null, show: false });
    }, 2000);
  };

  const handleEnergyTagClick = (tag: 'energized' | 'neutral' | 'drained') => {
    setSelectedEnergyTag(selectedEnergyTag === tag ? null : tag);
  };

  const handleSaveReflection = () => {
    if (selectedEnergy === null) {
      showToast('Please select an importance level');
      return;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const defaultTitle = `Reflection at ${timeStr}`;

    onSaveReflection({
      title: title || defaultTitle,
      value: selectedEnergy,
      energy: selectedEnergyTag || 'neutral',
      notes,
      learning
    });

    showToast('Reflection saved!', 'check');

    // Reset form
    setSelectedEnergy(null);
    setSelectedEnergyTag(null);
    setNotes('');
    setLearning('');
    setTitle('');
    setAttachments([]);
  };

  // Handle file attachment
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const url = URL.createObjectURL(file);
        setAttachments(prev => [...prev, { name: file.name, type: file.type, url }]);
      });
    }
    e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Edit reflection handlers
  const startEditingReflection = (reflection: SavedReflection) => {
    setEditingReflection(reflection);
    setEditTitle(reflection.title);
    setEditNotes(reflection.notes);
    setEditLearning(reflection.learning);
    setEditEnergy(reflection.value);
    setEditEnergyTag(reflection.energy as 'energized' | 'neutral' | 'drained');
  };

  const cancelEditing = () => {
    setEditingReflection(null);
    setEditTitle('');
    setEditNotes('');
    setEditLearning('');
    setEditEnergy(3);
    setEditEnergyTag('neutral');
  };

  const saveEditedReflection = () => {
    if (!editingReflection) return;
    onUpdateReflection(editingReflection.id, {
      title: editTitle,
      notes: editNotes,
      learning: editLearning,
      value: editEnergy,
      energy: editEnergyTag,
    });
    showToast('Reflection updated!', 'check');
    cancelEditing();
  };

  const confirmDeleteReflection = (id: string) => {
    onDeleteReflection(id);
    setShowDeleteConfirm(null);
    showToast('Reflection deleted');
  };

  return (
    <div className={`h-full ${bgColor} flex flex-col relative transition-colors duration-300`}>
      {/* Toast Notification */}
      {toast.show && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-[#2a2520] text-white px-6 py-3 rounded-full shadow-lg text-sm flex items-center gap-2">
            {toast.icon === 'check' && <Check className="w-4 h-4" />}
            {toast.message}
          </div>
        </div>
      )}

      {/* Edit Reflection Modal */}
      {editingReflection && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className={`${cardBg} rounded-2xl p-5 w-full max-w-sm shadow-2xl`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-medium ${textPrimary}`}>Edit Reflection</h3>
              <button
                onClick={cancelEditing}
                className={`p-1 rounded-full ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`text-xs ${textSecondary} mb-1 block`}>Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={`w-full ${inputBg} border rounded-xl px-4 py-3 text-sm ${inputText}`}
                />
              </div>

              <div>
                <label className={`text-xs ${textSecondary} mb-2 block`}>Importance Level</label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      onClick={() => setEditEnergy(num)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all ${
                        num === editEnergy
                          ? 'bg-[#d4a574] text-white scale-110'
                          : darkMode
                            ? 'bg-[#333] text-gray-400 border border-gray-600'
                            : 'bg-white text-gray-400 border border-gray-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`text-xs ${textSecondary} mb-2 block`}>Energy</label>
                <div className="flex gap-2 justify-center">
                  {(['energized', 'neutral', 'drained'] as const).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setEditEnergyTag(tag)}
                      className={`px-4 py-1.5 rounded-full text-xs transition-all ${
                        editEnergyTag === tag
                          ? 'bg-[#d4a574] text-white'
                          : darkMode
                            ? 'bg-[#333] text-gray-400 border border-gray-600'
                            : 'bg-white text-[#8b7355] border border-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`text-xs ${textSecondary} mb-1 block`}>Notes</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className={`w-full ${inputBg} border rounded-xl px-4 py-3 text-sm ${inputText} min-h-[60px] resize-none`}
                />
              </div>

              <div>
                <label className={`text-xs ${textSecondary} mb-1 block`}>Lessons Learned</label>
                <input
                  type="text"
                  value={editLearning}
                  onChange={(e) => setEditLearning(e.target.value)}
                  className={`w-full ${inputBg} border rounded-xl px-4 py-3 text-sm ${inputText}`}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={cancelEditing}
                  className={`flex-1 py-3 rounded-full text-sm transition-colors ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditedReflection}
                  className="flex-1 bg-[#a58872] text-white py-3 rounded-full text-sm hover:bg-[#8b7355] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Area with Scroll */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 pb-28">
        {/* Header with Logo */}
        <div className="mb-6">
          <img
            src={logoImage}
            alt="noema"
            className={`h-28 mb-3 object-contain ${darkMode ? 'brightness-150 contrast-125' : ''}`}
          />
          <p className={`text-xs ${textSecondary}`}>Monday, Jan 5 2026</p>
        </div>

        {/* Time Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className={`${cardBgAlt} rounded-2xl p-4 shadow-sm`}>
            <div className={`text-[10px] ${textSecondary} mb-1 tracking-wide uppercase`}>Scheduled</div>
            <div className={`text-2xl ${textPrimary} font-light`}>6h 55m</div>
          </div>
          <div className={`${cardBgAlt} rounded-2xl p-4 shadow-sm`}>
            <div className={`text-[10px] ${textSecondary} mb-1 tracking-wide uppercase`}>Reflected</div>
            <div className={`text-2xl ${textPrimary} font-light`}>2h</div>
          </div>
        </div>

        {/* AI Smart Suggestions */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h2 className={`text-base ${textSecondary}`}>Smart Suggestions</h2>
          </div>
          <div className="space-y-2">
            {/* MOOD DRAINER ALERT - Critical warning */}
            <button
              onClick={() => onTabChange('calendar')}
              className={`w-full rounded-2xl p-4 border text-left hover:shadow-md transition-shadow ${
                darkMode
                  ? 'bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-800'
                  : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-red-900/50' : 'bg-red-100'}`}>
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-[#2a2520]'}`}>Mood-Drainer at 2pm</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                    Budget Review → Move to 10am
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-full font-semibold text-xs flex-shrink-0 ${darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-600'}`}>
                  -35%
                </div>
                <ChevronRight className={`w-4 h-4 flex-shrink-0 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
            </button>

            {/* Insights suggestion - navigates to insights */}
            <button
              onClick={() => onTabChange('insights')}
              className={`w-full rounded-2xl p-4 border text-left hover:shadow-md transition-shadow ${
                darkMode
                  ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-800'
                  : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-green-900/50' : 'bg-green-100'}`}>
                  <Zap className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-100' : 'text-[#2a2520]'}`}>Your energy is up 12% this week</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tap to see your full insights and patterns.</div>
                </div>
                <ChevronRight className={`w-4 h-4 flex-shrink-0 mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
            </button>

            {/* Best Time Insight - Quick info */}
            <button
              onClick={() => onTabChange('profile')}
              className={`w-full rounded-2xl p-4 border text-left hover:shadow-md transition-shadow ${
                darkMode
                  ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-blue-800'
                  : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                  <Clock className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-100' : 'text-[#2a2520]'}`}>Peak Performance: Mornings</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>You're 40% more productive before noon.</div>
                </div>
                <ChevronRight className={`w-4 h-4 flex-shrink-0 mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
            </button>
          </div>
        </section>

        {/* Needs Reflection Section */}
        <section className="mb-6">
          <h2 className={`text-base ${textSecondary} mb-3`}>How was your day?</h2>
          <div className={`${cardBg} rounded-2xl p-5 shadow-md`}>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Activity"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full ${inputBg} border rounded-xl px-4 py-3 text-sm ${inputText}`}
              />
            </div>

            <div className="mb-4">
              <div className={`text-xs ${textPrimary} mb-2 font-medium`}>Importance Level</div>
              <div className="flex gap-3 items-center justify-center">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSelectedEnergy(num)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all ${
                      num === selectedEnergy
                        ? 'bg-[#d4a574] text-white scale-110'
                        : darkMode
                          ? 'bg-[#333] text-gray-400 border border-gray-600 hover:border-gray-500'
                          : 'bg-white text-gray-400 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className={`text-xs ${textPrimary} mb-2 font-medium`}>Energy</div>
              <div className="flex flex-wrap gap-2 justify-center">
                {['energized', 'neutral', 'drained'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleEnergyTagClick(tag as 'energized' | 'neutral' | 'drained')}
                    className={`px-4 py-1.5 rounded-full text-xs transition-all ${
                      selectedEnergyTag === tag
                        ? 'bg-[#d4a574] text-white'
                        : darkMode
                          ? 'bg-[#333] text-gray-400 border border-gray-600'
                          : 'bg-white text-[#8b7355] border border-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Lessons Learned"
                value={learning}
                onChange={(e) => setLearning(e.target.value)}
                className={`w-full ${inputBg} border rounded-xl px-4 py-3 text-sm ${inputText}`}
              />
            </div>

            <div className="mb-4">
              <div className="relative">
                <textarea
                  placeholder="Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={`w-full ${inputBg} border rounded-xl px-4 py-3 text-sm ${inputText} min-h-[80px] resize-none pr-20`}
                />
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                    title="Take photo"
                  >
                    <Camera className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`} />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                    title="Attach file"
                  >
                    <Paperclip className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`} />
                  </button>
                </div>
              </div>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx,.txt"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Attachments Preview */}
              {attachments.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {attachments.map((att, idx) => (
                    <div key={idx} className="relative group">
                      {att.type.startsWith('image/') ? (
                        <img
                          src={att.url}
                          alt={att.name}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                          <Paperclip className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <button
                        onClick={() => removeAttachment(idx)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-[10px] text-gray-400 mb-3 text-center">
              Takes ~30s. Your future self thanks you.
            </div>

            <button
              onClick={handleSaveReflection}
              className="w-full bg-[#a58872] text-white py-3 rounded-full text-sm hover:bg-[#8b7355] transition-colors shadow-sm"
            >
              Save reflection
            </button>
          </div>
        </section>

        {/* Recents Section */}
        <section className="mb-6">
          <h2 className={`text-base ${textSecondary} mb-3`}>Recent Reflections</h2>
          {savedReflections.length === 0 ? (
            /* Empty State */
            <div className={`${cardBg} rounded-2xl p-8 shadow-sm text-center`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-amber-900/30' : 'bg-amber-50'}`}>
                <Sparkles className={`w-8 h-8 ${darkMode ? 'text-amber-400' : 'text-amber-500'}`} />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${textPrimary}`}>No reflections yet</h3>
              <p className={`text-sm ${textSecondary} mb-4`}>
                Start tracking how activities affect your energy. Each reflection helps uncover patterns.
              </p>
              <button
                onClick={openQuickReflection}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  darkMode
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-[#a58872] hover:bg-[#8b7355] text-white'
                }`}
              >
                Add your first reflection
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedReflections.map((reflection) => (
                <div
                  key={reflection.id}
                  className={`${cardBg} rounded-2xl p-4 shadow-sm relative`}
                >
                  {/* Delete confirmation overlay */}
                  {showDeleteConfirm === reflection.id && (
                    <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center z-10 p-4">
                      <div className={`${darkMode ? 'bg-[#2a2a2a]' : 'bg-white'} rounded-xl p-4 text-center shadow-lg`}>
                        <p className={`text-sm mb-3 ${textPrimary}`}>Delete this reflection?</p>
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className={`px-4 py-2 rounded-full text-xs ${
                              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => confirmDeleteReflection(reflection.id)}
                            className="px-4 py-2 rounded-full text-xs bg-red-500 text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-left flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`text-base ${textPrimary} flex-1`}>{reflection.title}</h3>
                      {/* Edit/Delete buttons */}
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => startEditingReflection(reflection)}
                          className={`p-1.5 rounded-full transition-colors ${
                            darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-400'
                          }`}
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(reflection.id)}
                          className={`p-1.5 rounded-full transition-colors ${
                            darkMode ? 'hover:bg-red-900/30 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                          }`}
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs flex-wrap items-center">
                      <span className={`px-3 py-1.5 rounded-full text-xs leading-none flex items-center ${
                        darkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-[#f5e6d3] text-[#a58872]'
                      }`}>
                        Level {reflection.value}/5
                      </span>
                      <span className={`px-3 py-1.5 rounded-full text-xs leading-none flex items-center ${
                        darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-[#e8f0f7] text-[#5b7a99]'
                      }`}>
                        {reflection.energy}
                      </span>
                      {reflection.notes && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedReflectionId(expandedReflectionId === reflection.id ? null : reflection.id);
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs leading-none flex items-center transition-colors ${
                            darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-[#f0f0f0] text-[#6b6b6b] hover:bg-[#e8e8e8]'
                          }`}
                        >
                          Notes ✓
                        </button>
                      )}
                    </div>

                    {expandedReflectionId === reflection.id && reflection.notes && (
                      <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className={`text-xs ${textSecondary} mb-1 font-medium`}>Notes:</div>
                        <div className={`text-sm ${textPrimary}`}>{reflection.notes}</div>
                        {reflection.learning && (
                          <div className="mt-2">
                            <div className={`text-xs ${textSecondary} mb-1 font-medium`}>Lessons Learned:</div>
                            <div className={`text-sm ${textPrimary}`}>{reflection.learning}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={onTabChange}
        onPlusClick={openQuickReflection}
      />
    </div>
  );
}
