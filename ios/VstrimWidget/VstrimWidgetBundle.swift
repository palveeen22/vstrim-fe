//
//  VstrimWidgetBundle.swift
//  VstrimWidget
//
//  Created by Alvin Putra Pratama on 27/11/25.
//

import WidgetKit
import SwiftUI

@main
struct VstrimWidgetBundle: WidgetBundle {
    var body: some Widget {
        VstrimWidget()
        VstrimWidgetControl()
        VstrimWidgetLiveActivity()
    }
}
