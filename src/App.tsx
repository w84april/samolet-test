import { ChakraProvider, Box, theme, Center } from '@chakra-ui/react';
import { OptionsTable } from './components/options-table';
import { DataContextProvider } from './components/data-context-provider';

export const App = () => (
  <ChakraProvider theme={theme}>
    <Center minH="100vh" fontSize="xl">
      <DataContextProvider>
        <OptionsTable />
      </DataContextProvider>
    </Center>
  </ChakraProvider>
);
