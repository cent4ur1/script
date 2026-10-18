#!/bin/sh

# The `front_app_switched` event fires every time the active application
# changes, and supplies the new app's name in $INFO.
#
# SketchyBar resolves `app.<value>` to the real application icon: it looks the
# app up by bundle identifier first, and falls back to matching the localized
# name of a running application (which is what $INFO is), so this works for
# every app without a name/icon table.

if [ "$SENDER" = "front_app_switched" ] && [ -n "$INFO" ]; then
  sketchybar --set "$NAME" \
    label="$INFO" \
    icon.background.image="app.$INFO" \
    icon.background.drawing=on
fi
