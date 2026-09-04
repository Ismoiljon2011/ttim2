import * as LucideIcons from 'lucide-react';
import { Award } from 'lucide-react';

type LucideIcon = React.ComponentType<{ className?: string }>;

const iconCache: Record<string, LucideIcon | null> = {};

export function getLucideIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Award;
  if (name in iconCache) return iconCache[name] || Award;
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name];
  iconCache[name] = Icon || null;
  return Icon || Award;
}

export { Award };
