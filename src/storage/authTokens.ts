import * as Keychain from 'react-native-keychain';

const SERVICE = 'com.chatapp.auth'; // cambia si quieres

export type StoredTokens = {
  accessToken: string;
  refreshToken: string;
};

export async function saveTokens(tokens: StoredTokens) {
  // guardamos ambos tokens juntos en password (string)
  await Keychain.setGenericPassword('tokens', JSON.stringify(tokens), {
    service: SERVICE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
  });
}

export async function getTokens(): Promise<StoredTokens | null> {
  const creds = await Keychain.getGenericPassword({ service: SERVICE });
  if (!creds) return null;

  try {
    return JSON.parse(creds.password) as StoredTokens;
  } catch {
    return null;
  }
}

export async function clearTokens() {
  await Keychain.resetGenericPassword({ service: SERVICE });
}
