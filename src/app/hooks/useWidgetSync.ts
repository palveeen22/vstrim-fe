import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { WidgetBridgeService } from '../services/WidgetBridgeService';

export const useWidgetSync = () => {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    console.log('🔌 Widget sync hook initialized');
    
    const performInitialSync = async () => {
      console.log('🚀 Performing initial widget sync...');
      await WidgetBridgeService.syncEventsToWidget();
    };
    
    performInitialSync();

    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState: AppStateStatus) => {
        console.log(`📱 App state changed: ${appState.current} → ${nextAppState}`);
        
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          console.log('✨ App became active, syncing widget...');
          await WidgetBridgeService.syncEventsToWidget();
        }
        
        appState.current = nextAppState;
      }
    );

    return () => {
      console.log('🔌 Widget sync hook cleanup');
      subscription.remove();
    };
  }, []);
};