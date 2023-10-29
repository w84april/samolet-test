import { Button, Box, Input, Flex } from '@chakra-ui/react';
import VirtualTable from './virtual-table';

import { SelectableCell } from './selectable-cell';
import { FieldValues, useForm } from 'react-hook-form';
import { useDataContext } from './data-context-provider';
import { IndeterminateCheckbox } from './indeterminate-checkbox';
import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Row } from '../constants';

export const OptionsTable = () => {
  const { data, setData } = useDataContext();

  const columns = useMemo<ColumnDef<Row>[]>(
    () => [
      {
        header: '#',
        cell: ({ row }) => (
          <Flex gap={2} justify={'center'} position={'relative'}>
            <Box position={'absolute'} left={0}>
              <IndeterminateCheckbox
                {...{
                  checked: row.getIsSelected(),
                  disabled: !row.getCanSelect(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler(),
                }}
              />
            </Box>
            <Box>{+row.id + 1}</Box>
          </Flex>
        ),
      },
      {
        header: 'Уровень 1',
        accessorKey: '1',
        cell: SelectableCell,
      },
      {
        header: 'Уровень 2',
        accessorKey: '2',
        cell: SelectableCell,
      },
      {
        header: 'Уровень 3',
        accessorKey: '3',
        cell: SelectableCell,
      },
      {
        header: 'Уровень 4',
        accessorKey: '4',
        cell: SelectableCell,
      },
      {
        header: 'Уровень 5',
        accessorKey: '5',
        cell: SelectableCell,
      },
    ],
    [],
  );
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: FieldValues) => {
    const rowsToAdd = data['rows-amount'];

    setData((prevState) => [
      ...prevState,
      ...Array(+rowsToAdd)
        .fill('')
        .map((_, i) => ({ '#': (i + prevState.length + 1).toString() })),
    ]);
  };

  return (
    <Flex direction={'column'} gap={10} minW="500px" p={4}>
      <VirtualTable data={data} columns={columns} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex gap={2}>
          <Input
            type="number"
            placeholder="Количество строк"
            {...register('rows-amount', { required: true })}
            w={'200px'}
          />
          <Button type="submit">Добавить строки</Button>
        </Flex>
      </form>
    </Flex>
  );
};
