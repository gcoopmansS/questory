/**
 * Typed wrapper around AsyncStorage for JSON data
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Get and parse JSON data from storage
 * Returns null if key doesn't exist or JSON is invalid
 */
export async function getJSON<T>(key: string): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value === null) {
      return null;
    }
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

/**
 * Stringify and store JSON data
 */
export async function setJSON<T>(key: string, value: T): Promise<void> {
  const jsonString = JSON.stringify(value);
  await AsyncStorage.setItem(key, jsonString);
}

/**
 * Remove a key from storage
 */
export async function remove(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}
