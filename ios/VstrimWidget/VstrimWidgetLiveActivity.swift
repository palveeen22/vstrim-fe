//
//  VstrimWidgetLiveActivity.swift
//  VstrimWidget
//
//  Created by Alvin Putra Pratama on 27/11/25.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct VstrimWidgetAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct VstrimWidgetLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: VstrimWidgetAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack {
                Text("Hello \(context.state.emoji)")
            }
            .activityBackgroundTint(Color.cyan)
            .activitySystemActionForegroundColor(Color.black)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text("Leading")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Trailing")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Bottom \(context.state.emoji)")
                    // more content
                }
            } compactLeading: {
                Text("L")
            } compactTrailing: {
                Text("T \(context.state.emoji)")
            } minimal: {
                Text(context.state.emoji)
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}

extension VstrimWidgetAttributes {
    fileprivate static var preview: VstrimWidgetAttributes {
        VstrimWidgetAttributes(name: "World")
    }
}

extension VstrimWidgetAttributes.ContentState {
    fileprivate static var smiley: VstrimWidgetAttributes.ContentState {
        VstrimWidgetAttributes.ContentState(emoji: "😀")
     }
     
     fileprivate static var starEyes: VstrimWidgetAttributes.ContentState {
         VstrimWidgetAttributes.ContentState(emoji: "🤩")
     }
}

#Preview("Notification", as: .content, using: VstrimWidgetAttributes.preview) {
   VstrimWidgetLiveActivity()
} contentStates: {
    VstrimWidgetAttributes.ContentState.smiley
    VstrimWidgetAttributes.ContentState.starEyes
}
