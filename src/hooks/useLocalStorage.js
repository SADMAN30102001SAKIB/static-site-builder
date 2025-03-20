"use client";

import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  // Check if window is defined (for SSR)
  const isBrowser = typeof window !== 'undefined';
  
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    if (!isBrowser) {
      return initialValue;
    }
    
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(error);
      return initialValue;
    }
  });
  
  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (isBrowser) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(error);
    }
  };
  
  // Listen for changes to this localStorage key from other tabs/windows
  useEffect(() => {
    if (!isBrowser) return;
    
    function handleStorageChange(e) {
      if (e.key === key) {
        try {
          setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
        } catch (error) {
          console.error(error);
        }
      }
    }
    
    // Listen for storage change events
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue, isBrowser]);
  
  return [storedValue, setValue];
}
