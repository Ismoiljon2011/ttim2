import CrudPage from '@/components/CrudPage';
import * as LucideIcons from 'lucide-react';

type LucideIcon = React.ComponentType<{ className?: string }>;

function renderStatIcon(name: string): React.ReactNode {
  if (!name) return '—';
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name];
  return Icon ? <Icon className="h-5 w-5 text-primary-600" /> : name;
}

export function AdminHero() {
  return (
    <CrudPage
      table="hero_slides"
      title="Hero slaydlar"
      searchFields={['title']}
      columns={[
        { key: 'title', label: 'Sarlavha', render: (item) => <span className="font-medium">{String(item.title)}</span> },
        { key: 'image_url', label: 'Rasm', render: (item) => item.image_url ? <img src={String(item.image_url)} alt="" className="h-10 w-16 rounded object-cover" /> : '—' },
        { key: 'sort_order', label: 'Tartib' },
        { key: 'is_active', label: 'Holat', render: (item) => item.is_active ? 'Faol' : 'O\'chirilgan' },
      ]}
      formFields={[
        { key: 'title', label: 'Sarlavha', type: 'text', required: true, full: true },
        { key: 'subtitle', label: 'Podsarlavha', type: 'text', full: true },
        { key: 'description', label: 'Tavsif', type: 'textarea', full: true },
        { key: 'image_url', label: 'Rasm URL', type: 'text', required: true, full: true },
        { key: 'primary_cta_label', label: 'Asosiy tugma matni', type: 'text' },
        { key: 'primary_cta_link', label: 'Asosiy tugma havolasi', type: 'text' },
        { key: 'secondary_cta_label', label: 'Ikkinchi tugma matni', type: 'text' },
        { key: 'secondary_cta_link', label: 'Ikkinchi tugma havolasi', type: 'text' },
        { key: 'sort_order', label: 'Tartib', type: 'number' },
        { key: 'is_active', label: 'Faol', type: 'boolean' },
      ]}
      defaultValues={{ title: '', subtitle: '', description: '', image_url: '', primary_cta_label: '', primary_cta_link: '', secondary_cta_label: '', secondary_cta_link: '', sort_order: 0, is_active: true }}
    />
  );
}

export function AdminStatistics() {
  return (
    <CrudPage
      table="statistics"
      title="Statistika"
      searchFields={['label']}
      columns={[
        { key: 'label', label: 'Nomi', render: (item) => <span className="font-medium">{String(item.label)}</span> },
        { key: 'value', label: 'Qiymat' },
        { key: 'suffix', label: 'Qo\'shimcha' },
        { key: 'icon', label: 'Ikonka', render: (item) => renderStatIcon(String(item.icon || '')) },
        { key: 'sort_order', label: 'Tartib' },
      ]}
      formFields={[
        { key: 'label', label: 'Nomi', type: 'text', required: true },
        { key: 'value', label: 'Qiymat', type: 'number', required: true },
        { key: 'suffix', label: 'Qo\'shimcha (+, %, vs.)', type: 'text' },
        { key: 'icon', label: 'Ikonka', type: 'icon' },
        { key: 'sort_order', label: 'Tartib', type: 'number' },
      ]}
      defaultValues={{ label: '', value: 0, suffix: '+', icon: '', sort_order: 0 }}
    />
  );
}

export function AdminNavigation() {
  return (
    <CrudPage
      table="navigation_items"
      title="Navigatsiya"
      searchFields={['label']}
      columns={[
        { key: 'label', label: 'Matn', render: (item) => <span className="font-medium">{String(item.label)}</span> },
        { key: 'url', label: 'Havola' },
        { key: 'sort_order', label: 'Tartib' },
        { key: 'is_active', label: 'Holat', render: (item) => item.is_active ? 'Faol' : 'O\'chirilgan' },
      ]}
      formFields={[
        { key: 'label', label: 'Matn', type: 'text', required: true },
        { key: 'url', label: 'Havola', type: 'text', required: true },
        { key: 'sort_order', label: 'Tartib', type: 'number' },
        { key: 'is_active', label: 'Faol', type: 'boolean' },
      ]}
      defaultValues={{ label: '', url: '', sort_order: 0, is_active: true }}
    />
  );
}
