#!/bin/bash

is_open=$(eww active-windows | grep -c "actioncenter")

if [ "$is_open" -eq 0 ]; then
  # Pencere kapalıysa reveal kapalı yap
  eww update actioncenter_reveal=false
fi

current=$(eww get actioncenter_reveal)

if [ "$current" = "true" ]; then
  # Kapatma işlemi
  eww close musiccenter
  sleep 0.3
  eww update actioncenter_reveal=false
  sleep 0.2
  eww close actioncenter
else
  # Açma işlemi
  eww close musiccenter
  eww open actioncenter
  eww update actioncenter_reveal=true
  sleep 0.3
  eww open musiccenter --toggle --no-daemonize
fi

