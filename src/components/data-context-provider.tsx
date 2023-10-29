import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from 'react';
import { ALL_OPTIONS, DATA } from '../constants';

export type Option = { id: string; parentId: string | null };

type RowSelection = { [key: number]: boolean };

type ContextValueType = {
  addOption: (newOption: Option) => void;
  options: Option[];
  data: {
    [key: string]: string;
  }[];
  setData: Dispatch<
    SetStateAction<
      {
        [key: string]: string;
      }[]
    >
  >;
  rowSelection: RowSelection;
  setRowSelection: Dispatch<SetStateAction<RowSelection>>;
} | null;

export const DataContext = createContext<ContextValueType>(null);

export const useDataContext = () => {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('DataContext not found');
  }
  return ctx;
};

export const DataContextProvider = ({ children }: { children: ReactNode }) => {
  const [options, setOptions] = useState(ALL_OPTIONS);
  const [data, setData] = useState(DATA);
  const [rowSelection, setRowSelection] = useState<RowSelection>({});

  const addOption = (newOption: Option) => setOptions((prevState) => [...prevState, newOption]);
  const contextValue = { addOption, options, data, setData, rowSelection, setRowSelection };

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};
