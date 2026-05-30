import { supabase } from './supabase';

// Busca todos os contatos
export async function getContacts() {
  const { data, error } = await supabase
    .from('contatinhos')        
    .select('*')
    .order('nome', { ascending: true });  
  if (error) throw error;
  return data;
}

// Busca um contato pelo ID
export async function getContactById(id) {
  const { data, error } = await supabase
    .from('contatinhos')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Cria um novo contato
export async function createContact({ nome, deonde, numero, endereco }) {
  const { data, error } = await supabase
    .from('contatinhos')
    .insert([{ nome, deonde, numero, endereco }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Atualiza um contato
export async function updateContact(id, { nome, deonde, numero, endereco }) {
  const { data, error } = await supabase
    .from('contatinhos')
    .update({ nome, deonde, numero, endereco })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Deleta um contato
export async function deleteContact(id) {
  const { error } = await supabase
    .from('contatinhos')
    .delete()
    .eq('id', id);
  if (error) throw error;
}