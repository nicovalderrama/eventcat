import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      '/': undefined;
      '/home': undefined;
      '/login': undefined;
      '/register': undefined;
      '/verify-email': undefined;
      '/(tabs)': undefined;
      '/(tabs)/home': undefined;
      '/(tabs)/organizer/home': undefined;
    }
  }
}

export type RootStackParamList = {
  '/': undefined;
  '/home': undefined;
  '/login': undefined;
  '/register': undefined;
  '/verify-email': undefined;
  '/(tabs)': undefined;
  '/(tabs)/home': undefined;
  '/(tabs)/organizer/home': undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  category: string;
  image_url: string;
  organizer_id: string;
  created_at: string;
};

export type Profile = {
  id: string;
  username: string;
  full_name: string;
  role: 'user' | 'organizer';
  created_at: string;
}; 