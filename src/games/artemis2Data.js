export const GOOGLE_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1xafeqnXm3wl8v3h3a3qFQ4odsfIflVrbvqySyseACrA/edit?usp=sharing'

export const MISSION_TEAMS = {
  'artemis2-1': {
    name: 'Orion',
    codename: 'Crewed Lunar Flyby',
    emoji: '🧑‍🚀',
    mission: 'Verify crewed trajectory & life support telemetry for the crewed mission.',
    size: 3,
  },
  'artemis2-2': {
    name: 'Discovery',
    codename: 'Deep Space Gateway',
    emoji: '🪐',
    mission: 'Calibrate deep-space nav beacons for the orbital insertion burn.',
    size: 2,
  },
  'artemis2-3': {
    name: 'Voyager',
    codename: 'Lunar Orbit Rendezvous',
    emoji: '🌕',
    mission: 'Synchronize docking telemetry for the lunar orbit rendezvous window.',
    size: 2,
  },
}

export const STUDENTS_DATA = {
  'Brahmana Yoga Saputra':          { team: 'artemis2-1', row: 3,  data: [18, 25, 20, 22, 19] },
  'Deerain Guardiola Finard Sitorus': { team: 'artemis2-1', row: 4,  data: [22, 19, 21, 18, 24] },
  'Gisella Leia Persia Marpaung':   { team: 'artemis2-1', row: 5,  data: [16, 23, 25, 20, 21] },
  'Joel Samuala Telaumbanua':       { team: 'artemis2-2', row: 13, data: [24, 18, 22, 25, 20] },
  'Meyzie Alpha Yophita':           { team: 'artemis2-2', row: 14, data: [19, 21, 17, 23, 18] },
  'Aluna Azalia Rasyidin Hadiningrat': { team: 'artemis2-3', row: 21, data: [21, 24, 19, 18, 22] },
  'Deepika Poojari':                { team: 'artemis2-3', row: 22, data: [17, 20, 23, 21, 16] },
}

export const SENSOR_NAMES = ['Radiation', 'O₂', 'Temp', 'Thruster', 'PSI']

export const METRICS = [
  {
    key: 'sum',
    label: 'SUM',
    friendly: 'Total',
    sheet: (row) => `=SUM(B${row}:F${row})`,
  },
  {
    key: 'avg',
    label: 'AVERAGE',
    friendly: 'Mean',
    sheet: (row) => `=AVERAGE(B${row}:F${row})`,
  },
  {
    key: 'min',
    label: 'MIN',
    friendly: 'Lowest',
    sheet: (row) => `=MIN(B${row}:F${row})`,
  },
  {
    key: 'max',
    label: 'MAX',
    friendly: 'Highest',
    sheet: (row) => `=MAX(B${row}:F${row})`,
  },
  {
    key: 'count',
    label: 'COUNT',
    friendly: 'Count',
    sheet: (row) => `=COUNT(B${row}:F${row})`,
  },
  {
    key: 'median',
    label: 'MEDIAN',
    friendly: 'Middle',
    sheet: (row) => `=MEDIAN(B${row}:F${row})`,
  },
]
