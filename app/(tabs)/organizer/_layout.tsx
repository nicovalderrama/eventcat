import { Stack } from 'expo-router';

export default function OrganizerLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          title: 'Panel del Organizador',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="events"
        options={{
          title: 'Mis Eventos',
        }}
      />
      <Stack.Screen
        name="create-event"
        options={{
          title: 'Crear Evento',
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Mi Perfil',
        }}
      />
    </Stack>
  );
} 