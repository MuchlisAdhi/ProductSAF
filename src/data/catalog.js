export const categories = [
  { id: 'broiler', name: 'Pakan Komplit Broiler', icon: 'Drumstick' },
  { id: 'layer', name: 'Pakan Komplit Layer', icon: 'Egg' },
  { id: 'conc-layer', name: 'Pakan Konsentrat Layer', icon: 'Layers' },
  { id: 'buras', name: 'Pakan Buras', icon: 'Bird' },
  { id: 'fish', name: 'Pakan Ikan', icon: 'Fish' },
  { id: 'doc', name: 'Doc Emerald', icon: 'Box' },
];

export const products = [
  // Pakan Komplit Broiler
  {
    id: 'sa-570-pi',
    categoryId: 'broiler',
    code: 'SA 570 P-I',
    name: 'Pakan Pre-Starter Broiler',
    description: 'Pakan komplit butiran (crumble) untuk ayam pedaging umur 1-10 hari. Memacu pertumbuhan awal yang maksimal.',
    sackColor: 'Red',
    image: '[https://placehold.co/300x450/721C24/white?text=Karung+SA+570+Merah](https://placehold.co/300x450/721C24/white?text=Karung+SA+570+Merah)', // Placeholder: User will replace
    nutrition: 'Protein: Min 21%, Lemak: Min 5%, Serat: Max 5%, Abu: Max 7%'
  },
  {
    id: 'sa-571-ns',
    categoryId: 'broiler',
    code: 'SA 571 NS',
    name: 'Pakan Starter Broiler',
    description: 'Pakan komplit butiran untuk masa pertumbuhan (starter) umur 11-21 hari.',
    sackColor: 'Green',
    image: '[https://placehold.co/300x450/008641/white?text=Karung+SA+571+Hijau](https://placehold.co/300x450/008641/white?text=Karung+SA+571+Hijau)',
    nutrition: 'Protein: Min 20%, Lemak: Min 4%, Serat: Max 5%'
  },
  {
    id: 'sa-571-ydi',
    categoryId: 'broiler',
    code: 'SA 571 YD-I',
    name: 'Pakan Finisher Broiler',
    description: 'Pakan masa akhir untuk pembentukan daging maksimal.',
    sackColor: 'Blue',
    image: '[https://placehold.co/300x450/0047AB/white?text=Karung+SA+571+Biru](https://placehold.co/300x450/0047AB/white?text=Karung+SA+571+Biru)',
    nutrition: 'Protein: Min 19%, Energi: 3100 Kcal'
  },
  
  // Pakan Komplit Layer
  {
    id: 'sa-324-kj',
    categoryId: 'layer',
    code: 'SA 324 KJ',
    name: 'Pakan Komplit Petelur',
    description: 'Pakan komplit untuk ayam petelur fase produksi.',
    sackColor: 'Yellow',
    image: '[https://placehold.co/300x450/F6B733/black?text=Karung+Layer+SA324](https://placehold.co/300x450/F6B733/black?text=Karung+Layer+SA324)',
    nutrition: 'Protein: 17-18%, Kalsium: 3.8%'
  },

  // Pakan Konsentrat Layer
  {
    id: 'sa-124-p',
    categoryId: 'conc-layer',
    code: 'SA 124 P',
    name: 'Konsentrat Petelur',
    description: 'Konsentrat untuk dicampur dengan jagung dan dedak.',
    sackColor: 'White',
    image: '[https://placehold.co/300x450/e2e2e2/black?text=Karung+Konsentrat+124](https://placehold.co/300x450/e2e2e2/black?text=Karung+Konsentrat+124)',
    nutrition: 'Protein: 36%, Pencampuran: 35% Konsentrat'
  },

  // Pakan Buras (Ayam Kampung)
  {
    id: 'sa-buras-1',
    categoryId: 'buras',
    code: 'SA Buras Starter',
    name: 'Pakan Ayam Buras',
    description: 'Pakan khusus untuk ayam kampung/joper.',
    sackColor: 'Orange',
    image: '[https://placehold.co/300x450/FFA500/black?text=Karung+Buras](https://placehold.co/300x450/FFA500/black?text=Karung+Buras)',
    nutrition: 'Nutrisi seimbang untuk ayam bukan ras.'
  },

  // Pakan Ikan
  {
    id: 'sa-fish-1',
    categoryId: 'fish',
    code: 'SA Fish Feed',
    name: 'Pakan Ikan Terapung',
    description: 'Pakan ikan lele/nila masa pertumbuhan.',
    sackColor: 'Grey',
    image: '[https://placehold.co/300x450/555/white?text=Karung+Pakan+Ikan](https://placehold.co/300x450/555/white?text=Karung+Pakan+Ikan)',
    nutrition: 'Protein: 30-32%'
  },

  // DOC Emerald
  {
    id: 'doc-emerald',
    categoryId: 'doc',
    code: 'DOC Emerald',
    name: 'Day Old Chicken',
    description: 'Bibit ayam broiler strain Emerald yang sehat dan lincah.',
    sackColor: 'Box',
    image: '[https://placehold.co/300x300/eee/333?text=Box+DOC+Emerald](https://placehold.co/300x300/eee/333?text=Box+DOC+Emerald)',
    nutrition: 'Grade A - Bebas Pullorum'
  }
];
