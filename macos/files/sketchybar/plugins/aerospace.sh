#!/bin/sh

# AeroSpace workspace indicator for SketchyBar.
#
# This script is invoked by a single (hidden) controller item, NOT by every
# workspace item. It refreshes all workspace items in one pass:
#   2x aerospace query + 1x awk + 1x sketchybar call,
# instead of one full script (3 processes) per workspace on every switch.
#
# For each workspace it:
#   * pins the item to the display its workspace lives on (so a bar only shows
#     its own display's workspaces),
#   * makes the active (visible) workspace a white button with black text.

WORKSPACES="$(aerospace list-workspaces --all \
  --format '%{workspace};%{monitor-id};%{workspace-is-visible}' 2>/dev/null)"
MONITORS="$(aerospace list-monitors \
  --format '%{monitor-id};%{monitor-appkit-nsscreen-screens-id}' 2>/dev/null)"

# `monitor-appkit-nsscreen-screens-id` is the 1-based index in NSScreen.screens,
# which is the same ordering SketchyBar uses for an item's `display` property.
#
# NOTE: SketchyBar enables background drawing whenever background.color is set,
# so background.drawing is emitted *after* background.color.
ARGS="$(printf '%s\n' "$WORKSPACES" | AEROSPACE_MONITORS="$MONITORS" awk -F';' '
  BEGIN {
    n = split(ENVIRON["AEROSPACE_MONITORS"], line, "\n")
    for (i = 1; i <= n; i++) {
      split(line[i], f, ";")
      if (f[1] != "") mon2disp[f[1]] = f[2]
    }
  }
  $1 == "" { next }
  {
    disp = mon2disp[$2]; if (disp == "") disp = 1
    if ($3 == "true") { bg = "on";  fg = "0xff000000" }  # active: white bg, black text
    else              { bg = "off"; fg = "0xff888888" }  # inactive: dim text
    printf "--set space.%s display=%s background.color=0xffffffff background.drawing=%s icon.color=%s ", $1, disp, bg, fg
  }')"

[ -n "$ARGS" ] && sketchybar $ARGS
