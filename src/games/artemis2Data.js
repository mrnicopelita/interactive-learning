export const GOOGLE_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1xafeqnXm3wl8v3h3a3qFQ4odsfIflVrbvqySyseACrA/edit?usp=sharing'

export const MISSION_TEAMS = {
  'artemis2-1': {
    name: 'Artemis II',
    codename: 'Crewed Lunar Flyby',
    emoji: '🧑‍🚀',
    mission: 'Verify crewed trajectory & life support telemetry for the Artemis II crewed mission.',
    size: 6,
  },
  'artemis2-2': {
    name: 'Artemis II',
    codename: 'Deep Space Gateway',
    emoji: '🪐',
    mission: 'Calibrate deep-space nav beacons for the orbital insertion burn.',
    size: 4,
  },
  'artemis2-3': {
    name: 'Artemis II',
    codename: 'Lunar Orbit Rendezvous',
    emoji: '🌕',
    mission: 'Synchronize docking telemetry for the lunar orbit rendezvous window.',
    size: 5,
  },
}

export const STUDENTS_DATA = {
  Lionel:   { team: 'artemis2-1', row: 3,  data: [14, 22, 22, 18, 14] },
  Griffino: { team: 'artemis2-1', row: 4,  data: [18, 14, 18, 24, 14] },
  Jephtah:  { team: 'artemis2-1', row: 5,  data: [20, 16, 20, 25, 16] },
  Timothy:  { team: 'artemis2-1', row: 6,  data: [12, 30, 12, 15, 12] },
  Sarah:    { team: 'artemis2-1', row: 7,  data: [15, 25, 15, 20, 25] },
  Axel:     { team: 'artemis2-1', row: 8,  data: [17, 21, 21, 17, 21] },
  Melody:   { team: 'artemis2-2', row: 13, data: [22, 18, 22, 25, 18] },
  Luna:     { team: 'artemis2-2', row: 14, data: [15, 19, 15, 22, 19] },
  Angel:    { team: 'artemis2-2', row: 15, data: [30, 25, 25, 20, 25] },
  Abigail:  { team: 'artemis2-2', row: 16, data: [15, 31, 15, 20, 15] },
  Jill:     { team: 'artemis2-3', row: 21, data: [16, 16, 20, 16, 22] },
  Jaden:    { team: 'artemis2-3', row: 22, data: [25, 21, 25, 18, 21] },
  Aireen:   { team: 'artemis2-3', row: 23, data: [12, 15, 15, 18, 15] },
  Queency:  { team: 'artemis2-3', row: 24, data: [18, 22, 22, 18, 22] },
  Nael:     { team: 'artemis2-3', row: 25, data: [20, 24, 20, 20, 24] },
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
