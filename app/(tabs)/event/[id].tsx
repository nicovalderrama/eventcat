import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';
import { Event } from '../../../types';

export default function EventScreen() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF3B30" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Evento no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{event.title}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {event.image_url && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: event.image_url }} 
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={24} color="#FF3B30" />
            <Text style={styles.infoText}>
              {format(new Date(event.date), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location" size={24} color="#FF3B30" />
            <Text style={styles.infoText}>{event.location}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="pricetag" size={24} color="#FF3B30" />
            <Text style={styles.infoText}>
              {event.price === 0 ? 'Gratis' : `$${event.price}`}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="people" size={24} color="#FF3B30" />
            <Text style={styles.infoText}>
              Capacidad: {event.capacity} personas
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="pricetag" size={24} color="#FF3B30" />
            <Text style={styles.infoText}>
              Categoría: {event.category}
            </Text>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Descripción</Text>
          <Text style={styles.descriptionText}>{event.description}</Text>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => {
            // Aquí iría la lógica para inscribirse al evento
          }}
        >
          <Text style={styles.buttonText}>Inscribirse al Evento</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  content: {
    padding: 20,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  descriptionContainer: {
    marginBottom: 30,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  button: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 100,
  },
}); 