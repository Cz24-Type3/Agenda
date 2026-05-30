import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

// Gera iniciais do nome para o avatar
function getInitials(name = '') {  // parâmetro local, ok
  return name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
}

// Paleta de cores para avatars
const AVATAR_COLORS = [
  '#4F46E5', '#0891B2', '#059669', '#D97706',
  '#DC2626', '#7C3AED', '#DB2777', '#EA580C',
];

function getAvatarColor(name = '') {
  const code = name.charCodeAt(0) || 0;
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

export default function ContactCard({ contact, onPress, onDelete }) {
  const initials = getInitials(contact.name);
  const avatarColor = getAvatarColor(contact.name);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{contact.nome}</Text>
        {contact.deonde ? (
          <Text style={styles.detail} numberOfLines={1}>🌍 {contact.deonde}</Text>
        ) : null}
        {contact.numero ? (
          <Text style={styles.detail} numberOfLines={1}>📞 {contact.numero}</Text>
        ) : null}
        {contact.endereco ? (
          <Text style={styles.detail} numberOfLines={1}>🗺️ {contact.endereco}</Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDelete(contact.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.deleteIcon}>🗑</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  detail: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 1,
  },
  deleteBtn: {
    padding: 6,
  },
  deleteIcon: {
    fontSize: 18,
  },
});