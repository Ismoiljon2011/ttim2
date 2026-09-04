import CrudPage from '@/components/CrudPage';

export function AdminPrograms() {
  return (
    <CrudPage
      table="programs"
      title="Ta'lim dasturlari"
      searchFields={['title', 'description']}
      columns={[
        { key: 'title', label: 'Sarlavha', render: (item) => <span className="font-medium">{String(item.title)}</span> },
        { key: 'teacher_name', label: 'O\'qituvchi' },
        { key: 'sort_order', label: 'Tartib' },
        { key: 'is_published', label: 'Holat', render: (item) => item.is_published ? 'Faol' : 'O\'chirilgan' },
      ]}
      formFields={[
        { key: 'title', label: 'Sarlavha', type: 'text', required: true, full: true },
        { key: 'description', label: 'Tavsif', type: 'textarea', full: true },
        { key: 'image_url', label: 'Rasm', type: 'media', accept: 'image', full: true },
        { key: 'teacher_name', label: 'O\'qituvchi/Kafedra', type: 'text' },
        { key: 'additional_info', label: 'Qo\'shimcha ma\'lumot', type: 'text', full: true },
        { key: 'sort_order', label: 'Tartib', type: 'number' },
        { key: 'is_published', label: 'Nashr etilgan', type: 'boolean' },
      ]}
      defaultValues={{ title: '', description: '', image_url: '', teacher_name: '', additional_info: '', sort_order: 0, is_published: true }}
    />
  );
}

export function AdminAchievements() {
  return (
    <CrudPage
      table="achievements"
      title="Yutuqlar"
      searchFields={['title', 'student_or_team']}
      columns={[
        { key: 'title', label: 'Sarlavha', render: (item) => <span className="font-medium">{String(item.title)}</span> },
        { key: 'category', label: 'Kategoriya' },
        { key: 'result', label: 'Natija' },
        { key: 'year', label: 'Yil' },
        { key: 'is_published', label: 'Holat', render: (item) => item.is_published ? 'Faol' : 'O\'chirilgan' },
      ]}
      formFields={[
        { key: 'title', label: 'Sarlavha', type: 'text', required: true, full: true },
        { key: 'student_or_team', label: 'O\'quvchi/Jamoa', type: 'text' },
        { key: 'year', label: 'Yil', type: 'number' },
        { key: 'result', label: 'Natija', type: 'text' },
        { key: 'category', label: 'Kategoriya', type: 'select', options: [
          { value: 'Olympiads', label: 'Olimpiadalar' },
          { value: 'Competitions', label: 'Tanlovlar' },
          { value: 'Sports', label: 'Sport' },
          { value: 'International', label: 'Xalqaro' },
          { value: 'National', label: 'Respublika' },
          { value: 'Academic', label: 'Akademik' },
        ] },
        { key: 'image_url', label: 'Rasm', type: 'media', accept: 'image', full: true },
        { key: 'description', label: 'Tavsif', type: 'textarea', full: true },
        { key: 'sort_order', label: 'Tartib', type: 'number' },
        { key: 'is_published', label: 'Nashr etilgan', type: 'boolean' },
      ]}
      defaultValues={{ title: '', student_or_team: '', year: new Date().getFullYear(), result: '', category: 'Academic', image_url: '', description: '', sort_order: 0, is_published: true }}
    />
  );
}

export function AdminAdmission() {
  return (
    <CrudPage
      table="admission_info"
      title="Qabul ma'lumotlari"
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
        { key: 'sort_order', label: 'Tartib', type: 'number' },
      ]}
      defaultValues={{ section_key: '', title: '', content: '', sort_order: 0 }}
    />
  );
}
