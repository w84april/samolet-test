import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  RowData,
  TableOptions,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtual } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { useDataContext } from './data-context-provider';
import { Box, Table, Thead, Tr, Th, Td, Button } from '@chakra-ui/react';

export type Meta = {
  updateData: (rowIndex: number, columnId: string, value: string) => void;
};

interface ReactVirtualTableProps<TData extends RowData>
  extends Pick<TableOptions<TData>, 'data' | 'columns'> {}

function VirtualTable<TData extends RowData>({ columns, data }: ReactVirtualTableProps<TData>) {
  const { setData, rowSelection, setRowSelection } = useDataContext();

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    meta: {
      updateData: (rowIndex, columnId, value) =>
        setData((prev) =>
          prev.map((row, index) => {
            if (index !== rowIndex) {
              return row;
            }
            const newRow = Object.keys(prev[rowIndex]).reduce(
              (result: { [key: string]: string }, key) => {
                if (key <= columnId) {
                  result[key] = prev[rowIndex][key];
                }

                return result;
              },
              {},
            );
            newRow[columnId] = value;
            return newRow;
          }),
        ),
    } satisfies Meta,
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 10,
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;
  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0;

  return (
    <>
      <Box ref={tableContainerRef} overflow={'scroll'} maxH="500px">
        <Table w={table.getCenterTotalSize()}>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Th
                      key={header.id}
                      colSpan={header.colSpan}
                      w={header.getSize()}
                      textAlign={'center'}
                      p="6px 12px"
                    >
                      <Box> {flexRender(header.column.columnDef.header, header.getContext())}</Box>
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>

          <tbody>
            {paddingTop > 0 && (
              <Tr>
                <Td h={`${paddingTop}px`} />
              </Tr>
            )}
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Td key={cell.id} p="6px 12px" textAlign="center">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
            {paddingBottom > 0 && (
              <Tr>
                <Td h={`${paddingBottom}px`} />
              </Tr>
            )}
          </tbody>
        </Table>
      </Box>
      <Button
        onClick={() => console.log(table.getSelectedRowModel().rows.map((row) => row.original))}
      >
        Сохранить
      </Button>
    </>
  );
}

export default VirtualTable;
