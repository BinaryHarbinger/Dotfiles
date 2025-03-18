#!/bin/bash

MONITOR=$(hyprctl activeworkspace | grep "on monitor" | awk '{print $4}' | tr -d '()')

eww update monitor="$MONITOR"

eww get monitor
