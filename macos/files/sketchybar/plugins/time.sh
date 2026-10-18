#!/bin/sh

# Time label, e.g. "7:53AM".

sketchybar --set "$NAME" label="$(date '+%-I:%M%p')"
