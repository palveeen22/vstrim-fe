import { useState, useEffect, useCallback } from 'react';
import NetInfo, { NetInfoState, NetInfoStateType } from '@react-native-community/netinfo';

interface UseNetworkResult {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: NetInfoStateType | undefined;
  checkConnection: () => Promise<void>;
}

export const useNetwork = (): UseNetworkResult => {
  const [networkState, setNetworkState] = useState<NetInfoState>({
    isConnected: null,
    isInternetReachable: null,
    type: NetInfoStateType.unknown,
    details: null,
  });

  // Handle connection check
  const checkConnection = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();
      setNetworkState(state);
    } catch (error) {
      console.error('Error checking network connection:', error);
    }
  }, []);

  useEffect(() => {
    // Check connection on mount
    checkConnection();
    
    // Subscribe to network changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkState(state);
    });
    
    return () => {
      // Cleanup subscription
      unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isConnected: networkState.isConnected,
    isInternetReachable: networkState.isInternetReachable,
    type: networkState.type,
    checkConnection,
  };
};