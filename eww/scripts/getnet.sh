#!/bin/bash

declare -A SEEN
declare -A AUTO

mapfile -t CONNS < <(nmcli -t -f NAME connection show)

for conn_name in "${CONNS[@]}"; do
    ssid=$(nmcli -g 802-11-wireless.ssid connection show "$conn_name" 2>/dev/null)
    autoconnect=$(nmcli -g connection.autoconnect connection show "$conn_name" 2>/dev/null)
    
    if [[ -n "$ssid" ]]; then 
        AUTO["$ssid"]=$autoconnect
    fi
done

wifi_list=()

while IFS=: read -r inuse ssid; do
    [[ -z "$ssid" ]] && continue
    if [[ -n "${SEEN[$ssid]}" ]]; then
        continue
    fi
    SEEN["$ssid"]=1

    in_use=false
    [[ "$inuse" == "*" ]] && in_use=true

    autoconnect=false
    [[ -n "${AUTO[$ssid]}" && "${AUTO[$ssid]}" == "yes" ]] && autoconnect=true


    wifi_json=$(jq -nc \
        --arg ssid "$ssid" \
        --argjson in_use "$in_use" \
        --argjson autoconnect "$autoconnect" \
        '{
          ssid: $ssid,
          in_use: $in_use,
          autoconnect: $autoconnect
        }')

    wifi_list+=("$wifi_json")
done < <(nmcli -t -f IN-USE,SSID dev wifi list)

jq -nc --argjson arr "$(printf '[%s]' "$(IFS=,; echo "${wifi_list[*]}")")" '$arr'
