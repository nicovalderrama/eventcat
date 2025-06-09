import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

type RegisterForm = {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  full_name: string;
  role: 'user' | 'organizer';
};

export default function RegisterScreen() {
  const [form, setForm] = useState<RegisterForm>({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    full_name: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validaciones
      if (form.password !== form.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      if (form.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Registrar usuario
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (signUpError) throw signUpError;

      if (user) {
        // Crear perfil
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              username: form.username,
              full_name: form.full_name,
              role: form.role,
            },
          ]);

        if (profileError) throw profileError;

        // Redirigir a verificación de email
        router.push('/(tabs)/verify-email');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Registro</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.form}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(text) => setForm(prev => ({ ...prev, email: text }))}
            placeholder="tu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre de Usuario</Text>
          <TextInput
            style={styles.input}
            value={form.username}
            onChangeText={(text) => setForm(prev => ({ ...prev, username: text }))}
            placeholder="Tu nombre de usuario"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre Completo</Text>
          <TextInput
            style={styles.input}
            value={form.full_name}
            onChangeText={(text) => setForm(prev => ({ ...prev, full_name: text }))}
            placeholder="Tu nombre completo"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            value={form.password}
            onChangeText={(text) => setForm(prev => ({ ...prev, password: text }))}
            placeholder="Tu contraseña"
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirmar Contraseña</Text>
          <TextInput
            style={styles.input}
            value={form.confirmPassword}
            onChangeText={(text) => setForm(prev => ({ ...prev, confirmPassword: text }))}
            placeholder="Confirma tu contraseña"
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tipo de Cuenta</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                form.role === 'user' && styles.roleButtonActive
              ]}
              onPress={() => setForm(prev => ({ ...prev, role: 'user' }))}
            >
              <Text style={[
                styles.roleButtonText,
                form.role === 'user' && styles.roleButtonTextActive
              ]}>Usuario</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleButton,
                form.role === 'organizer' && styles.roleButtonActive
              ]}
              onPress={() => setForm(prev => ({ ...prev, role: 'organizer' }))}
            >
              <Text style={[
                styles.roleButtonText,
                form.role === 'organizer' && styles.roleButtonTextActive
              ]}>Organizador</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleRegister}
          disabled={loading || !form.email || !form.password || !form.username || !form.full_name}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Registrarse</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/login')}>
            <Text style={styles.footerLink}>Inicia Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  roleButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  roleButtonText: {
    fontSize: 16,
    color: '#666',
  },
  roleButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 16,
  },
  footerLink: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
}); 