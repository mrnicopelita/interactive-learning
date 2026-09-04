export const GOOGLE_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1xafeqnXm3wl8v3h3a3qFQ4odsfIflVrbvqySyseACrA/edit?usp=sharing'

export const MISSION_TEAMS = {
  'artemis-1': {
    name: 'Artemis 1',
    codename: 'Orion Test Trajectory',
    emoji: '🛰️',
    mission: 'Verify shield temperatures & unmanned flight telemetry.',
    size: 4,
  },
  'artemis-2': {
    name: 'Artemis 2',
    codename: 'Crewed Lunar Flyby',
    emoji: '🧑‍🚀',
    mission: 'Ensure life support system stability for the astronaut crew.',
    size: 4,
  },
  'artemis-3': {
    name: 'Artemis 3',
    codename: 'Lunar South Pole Landing',
    emoji: '🌙',
    mission: 'Calibrate Starship HLS descent thrusters and oxygen reserves.',
    size: 3,
  },
}

export const STUDENTS_DATA = {
  'Alvin Ale Pierre Migasa':       { team: 'artemis-1', row: 3,  data: [22.4, 18.2, 22.4, 26.3, 20.7] },
  'Jason Aquilla':                 { team: 'artemis-1', row: 4,  data: [31.0, 27.5, 31.0, 24.8, 31.0] },
  'Jonathan Oliver Sumantri':      { team: 'artemis-1', row: 5,  data: [15.2, 19.6, 15.2, 22.1, 17.4] },
  'Kalinka Raisa Hadisoeganda':    { team: 'artemis-1', row: 6,  data: [28.4, 28.4, 21.6, 23.9, 25.2] },
  'Luis Antonio August Loprang':   { team: 'artemis-2', row: 13, data: [19.5, 24.1, 19.5, 27.3, 22.0] },
  'Moreno Nelson Chioda':          { team: 'artemis-2', row: 14, data: [26.2, 26.2, 26.2, 23.1, 25.8] },
  'Robel Enzo':                    { team: 'artemis-2', row: 15, data: [14.7, 18.9, 20.5, 18.9, 16.4] },
  'Russel Cornelis Spielberg Isakh': { team: 'artemis-2', row: 16, data: [32.1, 28.6, 32.1, 25.0, 30.2] },
  'Zachary Jemuel Marvelian':      { team: 'artemis-3', row: 21, data: [23.6, 19.8, 23.6, 27.4, 21.2] },
  'Javas Satya Wicaksana':         { team: 'artemis-3', row: 22, data: [18.4, 18.4, 24.7, 22.9, 18.4] },
  'Kimy Kimory Manuela Cee':       { team: 'artemis-3', row: 23, data: [12.8, 17.5, 17.5, 20.9, 15.1] },
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