import CrudPage from '@/components/CrudPage';

export function AdminSpirituality() {
  return (
    <CrudPage
      table="spirituality_articles"
      title="Raqamli ma'naviyat"
      searchFields={['title', 'excerpt']}
      orderBy="published_at"
      orderAscending={false}
      columns={[
        { key: 'title', label: 'Sarlavha', render: (item) => <span className="font-medium">{String(item.title)}</span> },
        { key: 'category', label: 'Kategoriya' },
        { key: 'status', label: 'Status', render: (item) => (
          <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'published' ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>{String(item.status)}</span>
        ) },
        { key: 'published_at', label: 'Sana', render: (item) => new Date(String(item.published_at)).toLocaleDateString('uz-UZ') },
      ]}
      formFields={[
        { key: 'title', label: 'Sarlavha', type: 'text', required: true, full: true },
        { key: 'slug', label: 'Slug', type: 'text', required: true, full: true },
        { key: 'category', label: 'Kategoriya', type: 'text' },
        { key: 'cover_image_url', label: 'Muqova rasm', type: 'media', accept: 'image', full: true },
        { key: 'excerpt', label: 'Qisqacha', type: 'textarea', full: true },
        { key: 'content', label: 'Matn', type: 'textarea', required: true, full: true },
        { key: 'video_url', label: 'Video', type: 'media', accept: 'video', full: true },
        { key: 'status', label: 'Status', type: 'select', options: [
          { value: 'published', label: 'Nashr etilgan' },
          { value: 'draft', label: 'Qoralama' },
        ] },
      ]}
      defaultValues={{ title: '', slug: '', category: '', cover_image_url: '', excerpt: '', content: '', video_url: '', status: 'published' }}
    />
  );
}

export function AdminRecommendations() {
  return (
    <CrudPage
      table="recommendations"
      title="Tavsiyalar"
      searchFields={['title', 'category']}
      columns={[
        { key: 'title', label: 'Sarlavha', render: (item) => <span className="font-medium">{String(item.title)}</span> },
        { key: 'category', label: 'Kategoriya' },
        { key: 'external_link', label: 'Havola', render: (item) => item.external_link ? <span className="text-xs text-primary-600 truncate block max-w-[200px]">{String(item.external_link)}</span> : '—' },
        { key: 'is_published', label: 'Holat', render: (item) => item.is_published ? 'Faol' : 'O\'chirilgan' },
      ]}
      formFields={[
        { key: 'title', label: 'Sarlavha', type: 'text', required: true, full: true },
        { key: 'description', label: 'Tavsif', type: 'textarea', full: true },
        { key: 'image_url', label: 'Rasm', type: 'media', accept: 'image', full: true },
        { key: 'external_link', label: 'Tashqi havola', type: 'text', full: true },
        { key: 'category', label: 'Kategoriya', type: 'select', options: [
          { value: 'Books', label: 'Kitoblar' },
          { value: 'Educational Websites', label: 'Ta\'lim saytlari' },
          { value: 'Learning Resources', label: 'O\'quv resurslari' },
          { value: 'Video Lessons', label: 'Video darslar' },
          { value: 'Useful Tools', label: 'Foydali vositalar' },
        ] },
        { key: 'sort_order', label: 'Tartib', type: 'number' },
        { key: 'is_published', label: 'Nashr etilgan', type: 'boolean' },
      ]}
      defaultValues={{ title: '', description: '', image_url: '', external_link: '', category: 'Books', sort_order: 0, is_published: true }}
    />
  );
}

export function AdminAbout() {
  return (
    <CrudPage
      table="about_sections"
      title="Maktab haqida bo'limlari"
      searchFields={['title', 'section_key']}
      columns={[
        { key: 'section_key', label: 'Kalit', render: (item) => <span className="font-mono text-xs">{String(item.section_key)}</span> },
        { key: 'title', label: 'Sarlavha', render: (item) => <span className="font-medium">{String(item.title)}</span> },
        { key: 'sort_order', label: 'Tartib' },
      ]}
      formFields={[
        { key: 'section_key', label: 'Kalit (unikal)', type: 'text', required: true },
        { key: 'title', label: 'Sarlavha', type: 'text', required: true, full: true },
        { key: 'content', label: 'Matn', type: 'textarea', full: true },
        { key: 'image_url', label: 'Rasm', type: 'media', accept: 'image', full: true },
        { key: 'sort_order', label: 'Tartib', type: 'number' },
      ]}
      defaultValues={{ section_key: '', title: '', content: '', image_url: '', sort_order: 0 }}
    />
  );
}
