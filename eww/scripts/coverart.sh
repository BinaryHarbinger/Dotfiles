#!/bin/bash

url=$(playerctl metadata --format "{{ mpris:artUrl }}" | sed 's/b273/1e02/')

if [[ "$url" == https* ]]; then
    curl -s -o coverart.png "$url"
    echo "file://$HOME/.config/eww/coverart.png"
else
    echo "$url"
fi
