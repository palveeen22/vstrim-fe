//
//  VstrimWidget.swift
//  VstrimWidget
//
//  Created by Alvin Putra Pratama on 27/11/25.

import WidgetKit
import SwiftUI

// MARK: - Models
struct UpcomingEvent: Decodable, Identifiable {
    let id: String
    let name: String
    let date: String
    let location: String?
    let imageUrl: String?
}

struct WidgetData: Decodable {
    let events: [UpcomingEvent]
    let lastUpdated: String
}

// MARK: - Provider
struct Provider: TimelineProvider {
    private let appGroupId = "group.com.vstrim.app"
    private let widgetKey = "upcomingEventsWidget"
    
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), events: getSampleEvents())
    }
    
    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date(), events: loadEvents() ?? getSampleEvents())
        completion(entry)
    }
    
    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        let currentDate = Date()
        let events = loadEvents() ?? []
        
        print("🔍 Timeline requested at \(currentDate)")
        print("📊 Loaded events count: \(events.count)")
        
        let entry = SimpleEntry(date: currentDate, events: events)
        
        // Refresh setiap 5 menit untuk testing (nanti bisa ke 15 menit)
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 5, to: currentDate)!
        let timeline = Timeline(entries: [entry], policy: .after(nextUpdate))
        
        completion(timeline)
    }
    
    private func loadEvents() -> [UpcomingEvent]? {
        print("🔎 Attempting to load events...")
        print("📂 App Group ID: \(appGroupId)")
        print("🔑 Widget Key: \(widgetKey)")
        
        guard let userDefaults = UserDefaults(suiteName: appGroupId) else {
            print("❌ Cannot access UserDefaults with suite: \(appGroupId)")
            return nil
        }
        
        // Debug: Print all keys
        if let allKeys = userDefaults.dictionaryRepresentation().keys as? [String] {
            print("🗂️ Available keys: \(allKeys)")
        }
        
        guard let jsonString = userDefaults.string(forKey: widgetKey) else {
            print("⚠️ No data found for key: \(widgetKey)")
            return nil
        }
        
        print("📄 Raw JSON String: \(jsonString)")
        
        guard let data = jsonString.data(using: .utf8) else {
            print("❌ Cannot convert string to data")
            return nil
        }
        
        do {
            let widgetData = try JSONDecoder().decode(WidgetData.self, from: data)
            print("✅ Successfully decoded \(widgetData.events.count) events")
            print("📅 Events: \(widgetData.events.map { $0.name })")
            return widgetData.events
        } catch {
            print("❌ Decode error: \(error)")
            if let decodingError = error as? DecodingError {
                switch decodingError {
                case .keyNotFound(let key, let context):
                    print("   Missing key: \(key.stringValue) in \(context.debugDescription)")
                case .typeMismatch(let type, let context):
                    print("   Type mismatch for type: \(type) in \(context.debugDescription)")
                case .valueNotFound(let type, let context):
                    print("   Value not found for type: \(type) in \(context.debugDescription)")
                case .dataCorrupted(let context):
                    print("   Data corrupted: \(context.debugDescription)")
                @unknown default:
                    print("   Unknown decoding error")
                }
            }
            return nil
        }
    }
    
    // Sample events untuk preview/testing
    private func getSampleEvents() -> [UpcomingEvent] {
        return [
            UpcomingEvent(
                id: "sample-1",
                name: "Sample Event",
                date: ISO8601DateFormatter().string(from: Date()),
                location: "Sample Location",
                imageUrl: nil
            )
        ]
    }
}

// MARK: - Entry
struct SimpleEntry: TimelineEntry {
    let date: Date
    let events: [UpcomingEvent]
}

// MARK: - Widget View
struct VstrimWidgetEntryView: View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) var family
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            if entry.events.isEmpty {
                emptyStateView
            } else {
                eventsListView
            }
        }
        .padding()
    }
    
    private var emptyStateView: some View {
        VStack(spacing: 12) {
            Image(systemName: "calendar.badge.exclamationmark")
                .font(.largeTitle)
                .foregroundColor(.secondary)
            Text("No upcoming events")
                .font(.caption)
                .foregroundColor(.secondary)
            Text("Open app to refresh")
                .font(.caption2)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    private var eventsListView: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("🎉 Upcoming Events")
                .font(.headline)
                .padding(.bottom, 4)
            
            ForEach(entry.events.prefix(family == .systemSmall ? 1 : 3)) { event in
                VStack(alignment: .leading, spacing: 4) {
                    Text(event.name)
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .lineLimit(1)
                    
                    Text(formatDate(event.date))
                        .font(.caption)
                        .foregroundColor(.blue)
                    
                    if let location = event.location, !location.isEmpty {
                        Text("📍 \(location)")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                            .lineLimit(1)
                    }
                }
                
                if event.id != entry.events.prefix(family == .systemSmall ? 1 : 3).last?.id {
                    Divider()
                }
            }
        }
    }
    
    private func formatDate(_ isoString: String) -> String {
        let formatter = ISO8601DateFormatter()
        guard let date = formatter.date(from: isoString) else { 
            print("⚠️ Cannot parse date: \(isoString)")
            return isoString 
        }
        
        let displayFormatter = DateFormatter()
        displayFormatter.dateStyle = .medium
        displayFormatter.timeStyle = .short
        return displayFormatter.string(from: date)
    }
}

// MARK: - Widget Configuration
struct VstrimWidget: Widget {
    let kind: String = "VstrimWidget"
    
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            VstrimWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Upcoming Events")
        .description("See your next vstrim events")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

// MARK: - Preview
struct VstrimWidget_Previews: PreviewProvider {
    static var previews: some View {
        VstrimWidgetEntryView(entry: SimpleEntry(
            date: Date(),
            events: [
                UpcomingEvent(
                    id: "1",
                    name: "Morning Yoga SPB",
                    date: ISO8601DateFormatter().string(from: Date()),
                    location: "Test Location",
                    imageUrl: nil
                )
            ]
        ))
        .previewContext(WidgetPreviewContext(family: .systemMedium))
    }
}