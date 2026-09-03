import CrudPage from '@/components/CrudPage';

export function AdminAnnouncements() {
  return (
    <CrudPage
      table="announcements"
      title="E'lonlar"
      searchFields={['title', 'content']}
      columns={[
        { key: 'title', label: 'Sarlavha', render: (item) => <span className="font-medium">{String(item.title)}</span> },
        { key: 'priority', label: 'Muhimlik', render: (item) => (
          <span className={`text-xs px-2 py-1 rounded-full ${
            item.priority === 'urgent' ? 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400' :
            item.priority === 'important' ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400' :
            'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
          }`}>{String(item.priority)}</span>
        ) },
        { key: 'is_published', label: 'Holat', render: (item) => item.is_published ? 'Faol' : 'O\'chirilgan' },
        { key: 'start_date', label: 'Boshlanish', render: (item) => item.start_date ? new Date(String(item.start_date)).toLocaleDateString('uz-UZ') : '—' },
      ]}
      formFields={[
        { key: 'title', label: 'Sarlavha', type: 'text', required: true, full: true },
        { key: 'content', label: 'Matn', type: 'textarea', full: true },
        { key: 'priority', label: 'Muhimlik', type: 'select', required: true, options: [
          { value: 'normal', label: 'Oddiy' },
          { value: 'important', label: 'Muhim' },
          { value: 'urgent', label: 'Shoshilinch' },
        ] },
        { key: 'link', label: 'Havola', type: 'text' },
        { key: 'is_published', label: 'Nashr etilgan', type: 'boolean' },
        { key: 'start_date', label: 'Boshlanish sana', type: 'date' },
        { key: 'end_date', label: 'Tugash sana', type: 'date' },
      ]}
      defaultValues={{ title: '', content: '', priority: 'normal', link: '', is_published: true, start_date: '', end_date: '' }}
    />
  );
}

export function AdminEvents() {
  return (
    <CrudPage
      table="events"
      title="Tadbirlar"
      searchFields={['title', 'description']}
      columns={[
        { key: 'title', label: 'Sarlavha', render: (item) => <span className="font-medium">{String(item.title)}</span> },
        { key: 'event_date', label: 'Sana', render: (item) => new Date(String(item.event_date)).toLocaleDateString('uz-UZ') },
        { key: 'event_time', label: 'Vaqt' },
        { key: 'location', label: 'Joy' },
        { key: 'is_published', label: 'Holat', render: (item) => item.is_published ? 'Faol' : 'O\'chirilgan' },
      ]}
      formFields={[
        { key: 'title', label: 'Sarlavha', type: 'text', required: true, full: true },
        { key: 'description', label: 'Tavsif', type: 'textarea', full: true },
        { key: 'event_date', label: 'Sana', type: 'date', required: true },
        { key: 'event_time', label: 'Vaqt', type: 'text' },
        { key: 'location', label: 'Joy', type: 'text' },
        { key: 'image_url', label: 'Rasm URL', type: 'text', full: true },
        { key: 'is_published', label: 'Nashr etilgan', type: 'boolean' },
      ]}
      defaultValues={{ title: '', description: '', event_date: '', event_time: '', location: '', image_url: '', is_published: true }}
    />
  );
}
