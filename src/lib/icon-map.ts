import {
  Globe,
  Layout,
  Server,
  Layers,
  Rocket,
  Smartphone,
  BarChart3,
  Edit,
  Package,
  Code,
  Database,
  Shield,
  Cpu,
  Palette,
  BookOpen,
  Terminal,
  type LucideIcon,
} from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  globe: Globe,
  layout: Layout,
  server: Server,
  layers: Layers,
  rocket: Rocket,
  smartphone: Smartphone,
  'bar-chart': BarChart3,
  edit: Edit,
  package: Package,
  code: Code,
  database: Database,
  shield: Shield,
  cpu: Cpu,
  palette: Palette,
  'book-open': BookOpen,
  terminal: Terminal,
};

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Package;
}
