import CrudPage from '@/components/CrudPage';
import { slugify } from '@/lib/adminUtils';

export default function AdminNews() {
  return (
    <CrudPage
      table="news_articles"
      title="Yangiliklar"
      extraSelect="*, category:news_categories(*)"
      orderBy="created_at"
      orderAscending={false}
      searchFields={['title', 'excerpt']}
      columns={[
        { key: 'title', label: 'Sarlavha', render: (item) => <span className="font-medium">{String(item.title)}</span> },
        { key: 'status', label: 'Status', render: (item) => (
          <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'published' ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>{String(item.status)}</span>
        ) },
        { key: 'is_featured', label: 'Tavsiya', render: (item) => item.is_featured ? '★' : '—' },
        { key: 'view_count', label: 'Ko\'rishlar' },
        { key: 'published_at', label: 'Sana', render: (item) => new Date(String(item.published_at)).toLocaleDateString('uz-UZ') },
      ]}
      formFields={[
        { key: 'title', label: 'Sarlavha', type: 'text', required: true, full: true },
        { key: 'slug', label: 'Slug (URL)', type: 'text', required: true, full: true },
        { key: 'cover_image_url', label: 'Muqova rasm URL', type: 'text', full: true },
        { key: 'excerpt', label: 'Qisqacha', type: 'textarea', full: true },
        { key: 'content', label: 'Matn', type: 'textarea', required: true, full: true },
        { key: 'author_name', label: 'Muallif', type: 'text' },
        { key: 'tags', label: 'Teglar (vergul bilan)', type: 'tags', full: true },
        { key: 'status', label: 'Status', type: 'select', options: [
          { value: 'published', label: 'Nashr etilgan' },
          { value: 'draft', label: 'Qoralama' },
          { value: 'scheduled', label: 'Rejalashtirilgan' },
        ] },
        { key: 'is_featured', label: 'Tavsiya etilgan', type: 'boolean' },
      ]}
      defaultValues={{
        title: '', slug: '', cover_image_url: '', excerpt: '', content: '',
        author_name: 'TTIM', tags: [], status: 'published', is_featured: false,
        view_count: 0,
      }}
    />
  );
}

export function AdminCategories() {
  return (
    <CrudPage
      table="news_categories"
      title="Kategoriyalar"
      searchFields={['name']}
      columns={[
        { key: 'name', label: 'Nomi', render: (item) => <span className="font-medium">{String(item.name)}</span> },
        { key: 'slug', label: 'Slug' },
      ]}
      formFields={[
        { key: 'name', label: 'Nomi', type: 'text', required: true, full: true },
        { key: 'slug', label: 'Slug', type: 'text', required: true, full: true },
      ]}
      defaultValues={{ name: '', slug: '' }}
    />
  );
}
