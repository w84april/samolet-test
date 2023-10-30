import {
  AutoComplete,
  AutoCompleteCreatable,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from '@choc-ui/chakra-autocomplete';
import { Text, Box } from '@chakra-ui/react';
import { useDataContext } from './data-context-provider';
import { useEffect, useState } from 'react';
import { removeDuplicates } from '../utils/remove-duplicates';
import { CellContext, ColumnDefTemplate } from '@tanstack/react-table';
import { Row } from '../constants';
import { Meta } from './virtual-table';

export const SelectableCell: ColumnDefTemplate<CellContext<Row, unknown>> | undefined = ({
  getValue,
  row,
  column,
  table,
}) => {
  const { options, addOption } = useDataContext();
  const initialValue = (getValue() || '') as string;

  const [inputValue, setInputValue] = useState(initialValue);

  const columnId = column.id;
  const rowCells = row.getAllCells();
  const parentCell = rowCells[+columnId - 1];
  const parentValue = columnId === '1' ? null : parentCell.getValue();

  const shouldRenderSelect = !!parentValue || parentValue === null;

  const filteredOptions = options.filter((option) =>
    columnId === '1' ? option.parentId === null : option.parentId === parentValue,
  );

  const noDuplicatesFilteredOptions = removeDuplicates(filteredOptions);

  const handleChange = (value: string) => {
    addOption({ id: value, parentId: typeof parentValue === 'string' ? parentValue : null });
    //Due to generic limitations, This meta object must be typecast to the correct type before usage.
    (table.options.meta as Meta)?.updateData(row.index, column.id, value);
  };

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  if (!shouldRenderSelect) return null;

  return (
    <AutoComplete openOnFocus creatable onChange={handleChange}>
      <AutoCompleteInput
        variant="filled"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <AutoCompleteList onBlur={() => setInputValue(initialValue || '')}>
        {noDuplicatesFilteredOptions.length === 0 && !inputValue && (
          <Box px={2}>
            <Text fontSize={'sm'}>Нет доступных опций</Text>
          </Box>
        )}
        {noDuplicatesFilteredOptions.map((option, i) => (
          <AutoCompleteItem key={`option-${i}`} value={option.id}>
            {option.id}
          </AutoCompleteItem>
        ))}
        <AutoCompleteCreatable>
          {({ value }) => <Text fontSize={'sm'}>Добавить {value} в опции</Text>}
        </AutoCompleteCreatable>
      </AutoCompleteList>
    </AutoComplete>
  );
};
