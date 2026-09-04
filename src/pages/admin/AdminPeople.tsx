import CrudPage from '@/components/CrudPage';

export function AdminLeadership() {
  return (
    <CrudPage
      table="leadership"
      title="Rahbariyat"
      searchFields={['full_name', 'position']}
      columns={[
        { key: 'full_name', label: 'F.I.O', render: (item) => <span className="font-medium">{String(item.full_name)}</span> },
        { key: 'position', label: 'Lavozim' },
        { key: 'is_published', label: 'Holat', render: (item) => item.is_published ? 'Faol' : 'O\'chirilgan' },
      ]}
      formFields={[
        { key: 'full_name', label: 'F.I.O', type: 'text', required: true, full: true },
        { key: 'position', label: 'Lavozim', type: 'text', required: true },
        { key: 'photo_url', label: 'Rasm', type: 'media', accept: 'image', full: true },
        { key: 'biography', label: 'Biografiya', type: 'textarea', full: true },
        { key: 'phone', label: 'Telefon', type: 'text' },
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'sort_order', label: 'Tartib', type: 'number' },
        { key: 'is_published', label: 'Nashr etilgan', type: 'boolean' },
      ]}
      defaultValues={{ full_name: '', position: '', photo_url: '', biography: '', phone: '', email: '', sort_order: 0, is_published: true }}
    />
  );
}

export function AdminTeachers() {
  return (
    <CrudPage
      table="teachers"
      title="O'qituvchilar"
      searchFields={['full_name', 'subject']}
      columns={[
        { key: 'full_name', label: 'F.I.O', render: (item) => <span className="font-medium">{String(item.full_name)}</span> },
        { key: 'subject', label: 'Fan' },
        { key: 'position', label: 'Lavozim' },
        { key: 'experience_years', label: 'Tajriba' },
        { key: 'is_published', label: 'Holat', render: (item) => item.is_published ? 'Faol' : 'O\'chirilgan' },
      ]}
      formFields={[
        { key: 'full_name', label: 'F.I.O', type: 'text', required: true, full: true },
        { key: 'subject', label: 'Fan', type: 'text', required: true },
        { key: 'position', label: 'Lavozim', type: 'text' },
        { key: 'photo_url', label: 'Rasm', type: 'media', accept: 'image', full: true },
        { key: 'experience_years', label: 'Tajriba (yil)', type: 'number' },
        { key: 'biography', label: 'Biografiya', type: 'textarea', full: true },
        { key: 'achievements', label: 'Yutuqlar', type: 'textarea', full: true },
        { key: 'sort_order', label: 'Tartib', type: 'number' },
        { key: 'is_published', label: 'Nashr etilgan', type: 'boolean' },
      ]}
      defaultValues={{ full_name: '', subject: '', position: 'O\'qituvchi', photo_url: '', experience_years: 0, biography: '', achievements: '', sort_order: 0, is_published: true }}
    />
  );
}
