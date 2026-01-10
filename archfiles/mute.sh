#!/usr/bin/env bash

SOURCE="@DEFAULT_SOURCE@"

# Sound files (change paths if you want)
SOUND_ON="$HOME/leverup.opus"
SOUND_OFF="$HOME/leverdown.opus"

# Get current mute state
MUTED=$(pactl get-source-mute "$SOURCE" | awk '{print $2}')

if [ "$MUTED" = "yes" ]; then
    pactl set-source-mute "$SOURCE" 0
    paplay "$SOUND_ON" &
else
    pactl set-source-mute "$SOURCE" 1
    paplay "$SOUND_OFF" &
fi
