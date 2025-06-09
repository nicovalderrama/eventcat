import { Redirect, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
    
    // Suscribirse a cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      } else if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    } catch (error) {
      console.error('Error checking auth:', error);
      setIsAuthenticated(false);
    }
  };

  // Si aún estamos verificando la autenticación, no redirigir
  if (isAuthenticated === null) {
    return null;
  }

  // Si el usuario está autenticado, redirigir a la aplicación
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  // Si el usuario no está autenticado, redirigir al login
  return <Redirect href="/(tabs)/login" />;
} 