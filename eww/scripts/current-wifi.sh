#!/bin/bash

wifi_info=$(nmcli -t -f active,ssid,signal dev wifi | grep '^yes')

if [[ -z "$wifi_info" ]]; then
    echo '{"icon": "睊", "ssid": "Disconnected", "strength": 0}'
    exit 0
fi

ssid=$(echo "$wifi_info" | cut -d: -f2)
signal=$(echo "$wifi_info" | cut -d: -f3)
icon="直"

echo "{\"icon\": \"$icon\", \"ssid\": \"${ssid^^}\", \"strength\": $signal}"
