import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import type { RegisterRequest, AuthResponse, LoginRequest } from './authTypes';
import { saveTokens } from '@/storage/authTokens';

export const registerThunk = createAsyncThunk<
  AuthResponse,
  RegisterRequest,
  { rejectValue: string }
>('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post<AuthResponse>('/auth/register', payload);

    // Guardar tokens en Keychain (persistente)
    await saveTokens({
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
    });

    return res.data;
  } catch (e: any) {
    const msg =
      e?.response?.data?.message ??
      e?.message ??
      'Error al registrar';
    return rejectWithValue(msg);
  }
});

export const loginThunk = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: string }
>('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post<AuthResponse>('/auth/login', payload);

    await saveTokens({
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
    });

    return res.data;
  } catch (e: any) {
    const msg = e?.response?.data?.message ?? e?.message ?? 'Error al iniciar sesion';
    return rejectWithValue(msg);
  }
});