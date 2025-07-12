#!/bin/bash

percent="$1"

# parçanın uzunluğunu alın (mikrosaniye cinsinden)
duration=$(playerctl metadata mpris:length)

# mikrosaniyeyi saniyeye çevir
duration_sec=$((duration / 1000000))

# yüzdelik değeri süreyle çarp
seek_sec=$(awk "BEGIN { printf \"%.0f\", $duration_sec * $percent / 100 }")

# parçayı belirtilen saniyeye sar
playerctl position "$seek_sec"

