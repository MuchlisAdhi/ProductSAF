import { Bird, Box, Drumstick, Egg, Fish, Layers, Leaf } from 'lucide-react'

export const iconMap = {
  Drumstick,
  Egg,
  Layers,
  Bird,
  Fish,
  Box,
}

export function BrandMark({ className }) {
  return (
    <div
      className={
        className ||
        'grid h-10 w-10 place-items-center rounded-xl bg-sido-green text-white shadow-sm'
      }
      aria-hidden="true"
    >
      <Leaf className="h-5 w-5" />
    </div>
  )
}
