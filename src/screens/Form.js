import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { createContact, updateContact } from '../services/contactService';

export default function FormScreen({ route, navigation }) {
  const editingContact = route.params?.contact ?? null;
  const isEditing = !!editingContact;

  const [nome, setNome] = useState(editingContact?.nome ?? '');
  const [deonde, setDeonde] = useState(editingContact?.deonde ?? '');
  const [numero, setNumero] = useState(editingContact?.numero ?? '');
  const [endereco, setEndereco] = useState(editingContact?.endereco ?? '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar Contato' : 'Novo Contato',
    });
  }, [isEditing]);

  const validate = () => {
  const newErrors = {};
  if (!nome.trim()) newErrors.nome = 'Nome é obrigatório';
  if (!numero.trim() && !deonde.trim())
    newErrors.general = 'Informe pelo menos telefone ou Deonde';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      if (isEditing) {
        await updateContact(editingContact.id, { nome, deonde, numero, endereco });
      } else {
        await createContact({ nome, deonde, numero, endereco });
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível salvar o contato. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar preview */}
          <View style={styles.avatarPreview}>
            <Text style={styles.avatarInitials}>
              {nome.trim() ? nome.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') : '?'}
            </Text>
          </View>

          {/* Campos */}
          <Field label="Nome completo" icon="👤" value={nome}
  onChangeText={(t) => { setNome(t); setErrors((e) => ({ ...e, nome: '' })); }}
  error={errors.nome} autoCapitalize="words" placeholder="Ex: Maria Silva" />

          <Field label="Deonde tu achou?" icon="🌍" value={deonde}
  onChangeText={(t) => { setDeonde(t); setErrors((e) => ({ ...e, deonde: '' })); }}
  error={errors.deonde} autoCapitalize="words" placeholder="Ex: Fatal Model" />

          <Field label="Telefone" icon="📞" value={numero}
  onChangeText={(t) => { setNumero(t); setErrors((e) => ({ ...e, general: '' })); }}
  placeholder="Ex: (21) 99999-9999" keyboardType="phone-pad" />

          <Field label="Endereço" icon="🗺️" value={endereco}
  onChangeText={(t) => { setEndereco(t); setErrors((e) => ({ ...e, endereco: '', general: '' })); }}
  error={errors.endereco} placeholder="Ex: Santa Cruz? Recreio?"
  keyboardType="email-address" autoCapitalize="none" />

          {errors.general ? (
            <Text style={styles.generalError}>{errors.general}</Text>
          ) : null}

          {/* Botão salvar */}
          <TouchableOpacity
            style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveBtnText}>
                {isEditing ? '💾  Salvar alterações' : '✅  Cadastrar contato'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Botão cancelar */}
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelBtnText}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Componente de campo reutilizável
function Field({ label, icon, error, ...inputProps }) {
  return (
    <View style={fieldStyles.wrapper}>
      <Text style={fieldStyles.label}>{label}</Text>
      <View style={[fieldStyles.row, error && fieldStyles.rowError]}>
        <Text style={fieldStyles.icon}>{icon}</Text>
        <TextInput
          style={fieldStyles.input}
          placeholderTextColor="#9CA3AF"
          returnKeyType="next"
          {...inputProps}
        />
      </View>
      {error ? <Text style={fieldStyles.error}>{error}</Text> : null}
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowError: { borderColor: '#EF4444' },
  icon: { fontSize: 18, marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#111827' },
  error: { color: '#EF4444', fontSize: 12, marginTop: 4, marginLeft: 4 },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  container: {
    padding: 20,
    paddingTop: 24,
  },
  avatarPreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4F46E5',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarInitials: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '800',
  },
  generalError: {
    color: '#EF4444',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
  },
  saveBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 8,
  },
  cancelBtnText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '500',
  },
});