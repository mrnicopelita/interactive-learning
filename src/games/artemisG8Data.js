export const GOOGLE_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1xafeqnXm3wl8v3h3a3qFQ4odsfIflVrbvqySyseACrA/edit?usp=sharing'

export const MISSION_TEAMS = {
  'artemis-1': {
    name: 'Artemis 1',
    codename: 'Shield & Trajectory Relay',
    emoji: '🛰️',
    mission: 'Mission flown & successful. Now relaying verified trajectory numbers to clear Artemis 3 for launch.',
    size: 4,
  },
  'artemis-2': {
    name: 'Artemis 2',
    codename: 'Life Support Relay',
    emoji: '🧑‍🚀',
    mission: 'Mission flown & successful. Now relaying verified crew & life-support numbers to clear Artemis 3 for launch.',
    size: 4,
  },
  'artemis-3': {
    name: 'Artemis 3',
    codename: 'Descent Systems Relay',
    emoji: '🌙',
    mission: 'The final mission. Computing the descent-system numbers needed for its own Moon landing.',
    size: 3,
  },
}

export const STUDENTS_DATA = {
  ALVIN:    { team: 'artemis-1', row: 3,  data: [14, 22, 22, 18, 14] },
  JASON:    { team: 'artemis-1', row: 4,  data: [18, 14, 18, 24, 14] },
  JONATHAN: { team: 'artemis-1', row: 5,  data: [20, 16, 20, 25, 16] },
  KALINKA:  { team: 'artemis-1', row: 6,  data: [12, 30, 12, 15, 12] },
  KIMY:     { team: 'artemis-2', row: 13, data: [22, 18, 22, 25, 18] },
  LUIS:     { team: 'artemis-2', row: 14, data: [15, 19, 15, 22, 19] },
  MORENO:   { team: 'artemis-2', row: 15, data: [30, 25, 25, 20, 25] },
  ROBEL:    { team: 'artemis-2', row: 16, data: [15, 31, 15, 20, 15] },
  RUSSEL:   { team: 'artemis-3', row: 21, data: [16, 16, 20, 16, 22] },
  ZACHARY:  { team: 'artemis-3', row: 22, data: [25, 21, 25, 18, 21] },
  JAVAS:    { team: 'artemis-3', row: 23, data: [12, 15, 15, 18, 15] },
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
    key: 'mode',
    label: 'MODE',
    friendly: 'Frequent',
    sheet: (row) => `=MODE(B${row}:F${row})`,
  },
  {
    key: 'median',
    label: 'MEDIAN',
    friendly: 'Middle',
    sheet: (row) => `=MEDIAN(B${row}:F${row})`,
  },
]