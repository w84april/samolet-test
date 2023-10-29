import { Option } from './components/data-context-provider';

export const ALL_OPTIONS: Option[] = [
  {
    id: '1.1',
    parentId: null,
  },
  {
    id: '1.2',
    parentId: null,
  },
  {
    id: '2.1',
    parentId: '1.1',
  },
];

export type Row = { [id: string]: string };

export const DATA: Row[] = [
  {
    '#': '1',
    '1': '1.1',
    '2': '2.1',
  },
];
