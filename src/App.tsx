import { MantineProvider, Title } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { NotificationsProvider } from '@mantine/notifications';
import Form from './components/Form';

export default function App() {
  const preferredColorScheme = useColorScheme();

  return (
    <MantineProvider
      theme={{ colorScheme: preferredColorScheme }}
      withGlobalStyles
    >
      <NotificationsProvider>
        <Title order={1} align='center'>
          Expense Reporter
        </Title>
        <Form />
      </NotificationsProvider>
    </MantineProvider>
  );
}
