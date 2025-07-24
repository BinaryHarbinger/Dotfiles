#!/bin/bash

if [[ -z $(eww active-windows | grep 'wifictl') ]]; then
    /usr/bin/eww open wifictl && /usr/bin/eww update wifictlrev=true
else
    /usr/bin/eww update wifictlrev=false && /usr/bin/eww update wificonfigrev=false
    (sleep 0.2 && /usr/bin/eww close wifictl) &
fi
