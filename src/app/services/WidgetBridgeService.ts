import { ExploreDataService } from '../../features/explore';
import SharedGroupPreferences from 'react-native-shared-group-preferences';

interface UpcomingEvent {
  id: string;
  name: string;
  date: string;
  location?: string;
  imageUrl?: string;
}

interface WidgetData {
  events: UpcomingEvent[];
  lastUpdated: string;
}

export class WidgetBridgeService {
  private static readonly APP_GROUP_ID = 'group.com.vstrim.app';
  private static readonly WIDGET_KEY = 'upcomingEventsWidget';

  static async updateWidgetData(events: UpcomingEvent[]): Promise<void> {
    try {
      const widgetData: WidgetData = {
        events: events.slice(0, 3),
        lastUpdated: new Date().toISOString(),
      };

      const jsonData = JSON.stringify(widgetData);

      console.log('📤 Sending to widget:', {
        appGroup: this.APP_GROUP_ID,
        key: this.WIDGET_KEY,
        dataPreview: widgetData
      });

      await SharedGroupPreferences.setItem(
        this.WIDGET_KEY,
        jsonData,
        this.APP_GROUP_ID
      );

      // Verify write was successful
      const readBack = await SharedGroupPreferences.getItem(
        this.WIDGET_KEY,
        this.APP_GROUP_ID
      );

      console.log('✅ Widget data confirmed:', readBack);
    } catch (error) {
      console.error('❌ Failed to update widget data:', error);
      throw error;
    }
  }

  static async syncEventsToWidget(): Promise<void> {
    try {
      const allValues = await ExploreDataService.getAllValues();

      console.log(allValues, "<???");

      if (!allValues?.events) {
        console.warn('⚠️ No events available for widget');
        return;
      }

      // Filter & sort upcoming events
      const upcomingEvents = allValues.events
        .filter(event => new Date(event.date) > new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3)
        .map(event => ({
          id: event.id,
          name: event.name,
          date: event.date,
          location: event.location,
          imageUrl: event.imageUrl,
        }));

      console.log(upcomingEvents);

      await this.updateWidgetData(upcomingEvents);

      await this.reloadWidget();

    } catch (error) {
      console.error('❌ Failed to sync events to widget:', error);
    }
  }

  private static async reloadWidget(): Promise<void> {
    try {

      await SharedGroupPreferences.setItem(
        'widget_reload_trigger',
        Date.now().toString(),
        this.APP_GROUP_ID
      );

      console.log('🔄 Widget reload triggered');
    } catch (error) {
      console.error('❌ Failed to reload widget:', error);
    }
  }
}