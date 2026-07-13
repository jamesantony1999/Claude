import { WrestlerDefinition } from '../types';

export const WRESTLERS: WrestlerDefinition[] = [
  {
    id: 'titan-rex',
    name: 'Titan Rex',
    gimmick: 'The Unstoppable Powerhouse',
    tagline: 'Bigger. Stronger. Louder.',
    primaryColor: '#c0392b',
    secondaryColor: '#2c2c2c',
    accentColor: '#f1c40f',
    stats: { power: 9, speed: 4, technique: 5, stamina: 8 },
    signatureMove: 'Meteor Crush',
    moveset: ['strike', 'grapple', 'taunt', 'signature'],
  },
  {
    id: 'nova-flash',
    name: 'Nova Flash',
    gimmick: 'The Aerial Assassin',
    tagline: 'Gone before you blink.',
    primaryColor: '#2980b9',
    secondaryColor: '#ecf0f1',
    accentColor: '#00e5ff',
    stats: { power: 5, speed: 9, technique: 6, stamina: 6 },
    signatureMove: 'Starfall Splash',
    moveset: ['strike', 'aerial', 'taunt', 'signature'],
  },
  {
    id: 'iron-widow',
    name: 'Iron Widow',
    gimmick: 'The Submission Specialist',
    tagline: 'Tap out or black out.',
    primaryColor: '#6c3483',
    secondaryColor: '#1c1c1c',
    accentColor: '#c39bd3',
    stats: { power: 6, speed: 6, technique: 9, stamina: 7 },
    signatureMove: 'Widow\'s Embrace',
    moveset: ['strike', 'grapple', 'taunt', 'signature'],
  },
  {
    id: 'the-cryptid',
    name: 'The Cryptid',
    gimmick: 'The Legend from the Woods',
    tagline: 'They said I wasn\'t real.',
    primaryColor: '#145a32',
    secondaryColor: '#4d5656',
    accentColor: '#7dcea0',
    stats: { power: 7, speed: 5, technique: 7, stamina: 7 },
    signatureMove: 'Ambush Slam',
    moveset: ['strike', 'grapple', 'aerial', 'taunt', 'signature'],
  },
  {
    id: 'judge-steel',
    name: 'Judge Steel',
    gimmick: 'The Enforcer',
    tagline: 'Order. Now.',
    primaryColor: '#34495e',
    secondaryColor: '#95a5a6',
    accentColor: '#e74c3c',
    stats: { power: 8, speed: 5, technique: 6, stamina: 8 },
    signatureMove: 'Verdict Hammer',
    moveset: ['strike', 'grapple', 'taunt', 'signature'],
  },
  {
    id: 'crimson-fang',
    name: 'Crimson Fang',
    gimmick: 'The Wildcard',
    tagline: 'Unpredictable. Undefeated.',
    primaryColor: '#900c3f',
    secondaryColor: '#1b1b1b',
    accentColor: '#ff5733',
    stats: { power: 7, speed: 7, technique: 7, stamina: 7 },
    signatureMove: 'Fang Breaker',
    moveset: ['strike', 'grapple', 'aerial', 'taunt', 'signature'],
  },
];

export function getWrestler(id: string): WrestlerDefinition {
  const w = WRESTLERS.find((x) => x.id === id);
  if (!w) throw new Error(`Unknown wrestler id: ${id}`);
  return w;
}
