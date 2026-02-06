const blueyCharacters = [
  {
    id: 'bluey',
    name: 'Bluey',
    short: 'B',
    color: '#A8D8FF',
    image: '/characters/Bluey/bluey.png',
  },
  {
    id: 'bingo',
    name: 'Bingo',
    short: 'Bi',
    color: '#FFE4A8',
    image: '/characters/Bluey/bingo.png',
  },
  {
    id: 'chilli',
    name: 'Chilli',
    short: 'C',
    color: '#FFD1DC',
    image: '/characters/Bluey/chilli.png',
  },
  {
    id: 'bandit',
    name: 'Bandit',
    short: 'Ba',
    color: '#BFE6E1',
    image: '/characters/Bluey/bandit.png',
  },
  {
    id: 'muffin',
    name: 'Muffin',
    short: 'M',
    color: '#F7C6F3',
    image: '/characters/Bluey/muffin.png',
  },
  {
    id: 'socks',
    name: 'Socks',
    short: 'S',
    color: '#CDE6FF',
    image: '/characters/Bluey/socks.png',
  },
  {
    id: 'coco',
    name: 'Coco',
    short: 'Co',
    color: '#FFE0F0',
    image: '/characters/Bluey/coco.png',
  },
  {
    id: 'lucky',
    name: 'Lucky',
    short: 'L',
    color: '#D7F5C9',
    image: '/characters/Bluey/lucky.png',
  },
  {
    id: 'honey',
    name: 'Honey',
    short: 'H',
    color: '#FFF2B3',
    image: '/characters/Bluey/honey.png',
  },
  {
    id: 'chloe',
    name: 'Chloe',
    short: 'Ch',
    color: '#E3D1FF',
    image: '/characters/Bluey/chloe.png',
  },
];

const pawPatrolCharacters = [
  {
    id: 'chase',
    name: 'Chase',
    short: 'Ch',
    color: '#B8DCFF',
    image: '/characters/PAW-Patrol/Chase.webp',
  },
  {
    id: 'marshall',
    name: 'Marshall',
    short: 'M',
    color: '#FFD0D0',
    image: '/characters/PAW-Patrol/Marshall.webp',
  },
  {
    id: 'skye',
    name: 'Skye',
    short: 'S',
    color: '#FFD8F2',
    image: '/characters/PAW-Patrol/Skye.webp',
  },
  {
    id: 'rubble',
    name: 'Rubble',
    short: 'R',
    color: '#FFE6AE',
    image: '/characters/PAW-Patrol/Rubble.webp',
  },
  {
    id: 'zuma',
    name: 'Zuma',
    short: 'Z',
    color: '#FFD8B8',
    image: '/characters/PAW-Patrol/Zuma.webp',
  },
  {
    id: 'rocky',
    name: 'Rocky',
    short: 'Ro',
    color: '#D7F4C2',
    image: '/characters/PAW-Patrol/Rocky.webp',
  },
  {
    id: 'everest',
    name: 'Everest',
    short: 'E',
    color: '#D7EEFF',
    image: '/characters/PAW-Patrol/Everest.webp',
  },
  {
    id: 'ryder',
    name: 'Ryder',
    short: 'Ry',
    color: '#E4D7FF',
    image: '/characters/PAW-Patrol/Ryder.webp',
  },
  {
    id: 'capitan-turbot',
    name: 'Capitan Turbot',
    short: 'CT',
    color: '#FFF1BE',
    image: '/characters/PAW-Patrol/Capitan-Turbot.webp',
  },
  {
    id: 'perrobot',
    name: 'Perrobot',
    short: 'P',
    color: '#F3D8FF',
    image: '/characters/PAW-Patrol/Perrobot.webp',
  },
];

export const characterGroups = [
  {
    id: 'bluey',
    label: 'Bluey',
    description: 'Personajes de Bluey para peques desde el nivel 1.',
    characters: blueyCharacters,
  },
  {
    id: 'paw-patrol',
    label: 'Patrulla Canina',
    description: 'Personajes de la Patrulla Canina en todos los niveles.',
    characters: pawPatrolCharacters,
  },
];

export const defaultCharacterGroupId = characterGroups[0].id;
