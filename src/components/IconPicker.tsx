import { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import { X, Search } from 'lucide-react';

interface IconPickerProps {
  value: string | null;
  onChange: (iconName: string | null) => void;
}

// Curated list of relevant, meaningful icon names (not all 1000+ lucide icons)
const ICON_NAMES = [
  'Users', 'User', 'GraduationCap', 'BookOpen', 'Book', 'Library', 'School',
  'Award', 'Trophy', 'Medal', 'Star', 'Heart', 'ThumbsUp', 'BadgeCheck',
  'Newspaper', 'FileText', 'File', 'Folder', 'Archive', 'Clipboard',
  'Bell', 'Calendar', 'Clock', 'MapPin', 'Phone', 'Mail', 'MessageSquare',
  'Image', 'Camera', 'Video', 'Film', 'Play', 'Music', 'Mic',
  'Globe', 'Link', 'ExternalLink', 'Download', 'Upload', 'Share',
  'Settings', 'Sliders', 'ToggleRight', 'Shield', 'Lock', 'Key',
  'Search', 'Eye', 'Filter', 'SortAsc', 'CheckCircle', 'Circle',
  'TrendingUp', 'TrendingDown', 'BarChart', 'PieChart', 'Activity',
  'Building', 'Home', 'Briefcase', 'Coffee', 'Flower', 'Leaf',
  'Sun', 'Moon', 'Cloud', 'Umbrella', 'Compass', 'Target',
  'Flag', 'Crown', 'Diamond', 'Gem', 'Sparkles', 'Zap',
  'Lightbulb', 'Brain', 'Atom', 'Microscope', 'FlaskConical', 'Calculator',
  'Pencil', 'PenTool', 'Edit', 'Save', 'Trash2', 'Plus',
  'ChevronRight', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'RefreshCw',
  'Facebook', 'Instagram', 'Youtube', 'Send', 'Twitter',
  'Info', 'HelpCircle', 'AlertCircle', 'Check', 'X',
];

type LucideIcon = React.ComponentType<{ className?: string }>;

export default function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredIcons = useMemo(() => {
    if (!search) return ICON_NAMES;
    return ICON_NAMES.filter((name) =>
      name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const renderIcon = (name: string, className = 'h-5 w-5'): React.ReactNode => {
    const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name];
    if (!Icon) return null;
    return <Icon className={className} />;
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-transparent focus:border-primary-500 focus:outline-none hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
        >
          {value && renderIcon(value) ? (
            <>
              {renderIcon(value)}
              <span className="text-sm">{value}</span>
            </>
          ) : (
            <span className="text-sm text-slate-400">Ikonka tanlash...</span>
          )}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="p-2 rounded-lg text-slate-400 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-900/30"
            title="Ikonkani o'chirish"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Ikonka tanlash</h2>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ikonka qidirish..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-transparent focus:border-primary-500 focus:outline-none"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                {filteredIcons.map((name) => {
                  const isSelected = value === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        onChange(name);
                        setOpen(false);
                      }}
                      className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                      title={name}
                    >
                      {renderIcon(name, 'h-6 w-6')}
                    </button>
                  );
                })}
              </div>
              {filteredIcons.length === 0 && (
                <p className="text-center text-slate-400 py-8">Ikonka topilmadi</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
