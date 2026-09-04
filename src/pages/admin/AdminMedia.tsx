import CrudPage from '@/components/CrudPage';

export function AdminGallery() {
  return (
    <CrudPage
      table="gallery_albums"
      title="Galereya"
      searchFields={['title', 'category']}
      columns={[
        { key: 'title', label: 'Sarlavha', render: (item) => <span className="font-medium">{String(item.title)}</span> },
        { key: 'category', label: 'Kategoriya' },
        { key: 'album_date', label: 'Sana', render: (item) => item.album_date ? new Date(String(item.album_date)).toLocaleDateString('uz-UZ') : '—' },
        { key: 'is_published', label: 'Holat', render: (item) => item.is_published ? 'Faol' : 'O\'chirilgan' },
      ]}
      formFields={[
        { key: 'title', label: 'Sarlavha', type: 'text', required: true, full: true },
        { key: 'description', label: 'Tavsif', type: 'textarea', full: true },
        { key: 'cover_image_url', label: 'Muqova rasm', type: 'media', accept: 'image', full: true },
        { key: 'category', label: 'Kategoriya', type: 'select', options: [
          { value: 'School Life', label: 'Maktab hayoti' },
          { value: 'Events', label: 'Tadbirlar' },
          { value: 'Competitions', label: 'Tanlovlar' },
          { value: 'Olympiads', label: 'Olimpiadalar' },
          { value: 'Holidays', label: 'Bayramlar' },
          { value: 'Sports', label: 'Sport' },
        ] },
        { key: 'album_date', label: 'Sana', type: 'date' },
        { key: 'sort_order', label: 'Tartib', type: 'number' },
        { key: 'is_published', label: 'Nashr etilgan', type: 'boolean' },
      ]}
      defaultValues={{ title: '', description: '', cover_image_url: '', category: 'School Life', album_date: '', sort_order: 0, is_published: true }}
    />
  );
}

export function AdminLibrary() {
  return (
    <CrudPage
      table="library_items"
      title="Kutubxona"
      searchFields={['title', 'author']}
      columns={[
        { key: 'title', label: 'Sarlavha', render: (item) => <span className="font-medium">{String(item.title)}</span> },
        { key: 'author', label: 'Muallif' },
        { key: 'category', label: 'Kategoriya' },
        { key: 'is_published', label: 'Holat', render: (item) => item.is_published ? 'Faol' : 'O\'chirilgan' },
      ]}
      formFields={[
        { key: 'title', label: 'Sarlavha', type: 'text', required: true, full: true },
        { key: 'author', label: 'Muallif', type: 'text' },
        { key: 'category', label: 'Kategoriya', type: 'text' },
        { key: 'description', label: 'Tavsif', type: 'textarea', full: true },
        { key: 'cover_image_url', label: 'Muqova rasm', type: 'media', accept: 'image', full: true },
        { key: 'file_url', label: 'Fayl', type: 'media', accept: 'any', full: true },
        { key: 'published_date', label: 'Nashr sanasi', type: 'date' },
        { key: 'sort_order', label: 'Tartib', type: 'number' },
        { key: 'is_published', label: 'Nashr etilgan', type: 'boolean' },
      ]}
      defaultValues={{ title: '', author: '', category: '', description: '', cover_image_url: '', file_url: '', published_date: '', sort_order: 0, is_published: true }}
    />
  );
}

export function AdminDocuments() {
  return (
    <CrudPage
      table="documents"
      title="Hujjatlar"
      searchFields={['title', 'category']}
      columns={[
        { key: 'title', label: 'Sarlavha', render: (item) => <span className="font-medium">{String(item.title)}</span> },
        { key: 'category', label: 'Kategoriya' },
        { key: 'document_date', label: 'Sana', render: (item) => item.document_date ? new Date(String(item.document_date)).toLocaleDateString('uz-UZ') : '—' },
        { key: 'is_published', label: 'Holat', render: (item) => item.is_published ? 'Faol' : 'O\'chirilgan' },
      ]}
      formFields={[
        { key: 'title', label: 'Sarlavha', type: 'text', required: true, full: true },
        { key: 'category', label: 'Kategoriya', type: 'text' },
        { key: 'description', label: 'Tavsif', type: 'textarea', full: true },
        { key: 'file_url', label: 'Fayl', type: 'media', accept: 'file', required: true, full: true },
        { key: 'document_date', label: 'Sana', type: 'date' },
        { key: 'sort_order', label: 'Tartib', type: 'number' },
        { key: 'is_published', label: 'Nashr etilgan', type: 'boolean' },
      ]}
      defaultValues={{ title: '', category: '', description: '', file_url: '', document_date: '', sort_order: 0, is_published: true }}
    />
  );
}
