#!/bin/sh

# Date label, e.g. "Mon 10th December 2026".

DOM="$(date '+%d')"
DOM="${DOM#0}"

case "$DOM" in
  11|12|13) SUFFIX=th ;;
  *1)       SUFFIX=st ;;
  *2)       SUFFIX=nd ;;
  *3)       SUFFIX=rd ;;
  *)        SUFFIX=th ;;
esac

sketchybar --set "$NAME" label="$(date '+%a') ${DOM}${SUFFIX} $(date '+%B %Y')"
