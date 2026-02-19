import type { LucideIcon } from 'lucide-react'
import {
  BadgeCheck,
  Bird,
  Box,
  ClipboardList,
  Drumstick,
  Egg,
  Factory,
  Fish,
  Leaf,
  Layers,
  Package,
  ShieldCheck,
  Sprout,
  Tag,
  Tractor,
  Wheat,
} from 'lucide-react'

export const lucideIconMap: Record<string, LucideIcon> = {
  BadgeCheck,
  Bird,
  Box,
  ClipboardList,
  Drumstick,
  Egg,
  Factory,
  Fish,
  Leaf,
  Layers,
  Package,
  ShieldCheck,
  Sprout,
  Tag,
  Tractor,
  Wheat,
}

export const lucideIconOptions = Object.keys(lucideIconMap).sort()

export function getLucideIcon(iconName: string): LucideIcon {
  return lucideIconMap[iconName] || Box
}
