#!/bin/bash

# Config dosya yolları
CONFIG_DIR="$HOME/.config/eww"
COVER_ART_FILE="$CONFIG_DIR/coverart.png"
INFO_FILE="$CONFIG_DIR/info.txt"

# Çalınan parçanın bilgilerini al
current_title=$(playerctl metadata --format "{{ title }}")
url=$(playerctl metadata --format "{{ mpris:artUrl }}" | sed 's/b273/1e02/')

# Eski şarkı bilgisini oku
if [[ -f "$INFO_FILE" ]]; then
    last_title=$(cat "$INFO_FILE")
else
    last_title=""
fi

# Eğer çalınan parça değişmişse veya info.txt yoksa
if [[ "$current_title" != "$last_title" ]]; then
    echo "$current_title" > "$INFO_FILE" # Yeni şarkı adını kaydet

    # URL geçerliyse resmi indir
    if [[ "$url" == https* ]]; then
        curl -s -o "$COVER_ART_FILE" "$url"
        echo "file://$COVER_ART_FILE"
    else
        echo "$url"
    fi
else
    # Şarkı değişmediyse mevcut resim dosyasını döndür
    echo "file://$COVER_ART_FILE"
fi
