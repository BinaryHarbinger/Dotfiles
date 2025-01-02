#!/bin/bash

# Config dosya yolları
CONFIG_DIR="$HOME/.config/eww"
COVER_ART_FILE="$CONFIG_DIR/coverart.png"
INFO_FILE="$CONFIG_DIR/info.txt"

# Çalınan parçanın bilgilerini al
current_title=$(playerctl metadata --format "{{ title }}" 2>/dev/null)
url=$(playerctl metadata --format "{{ mpris:artUrl }}" 2>/dev/null | sed 's/b273/1e02/')

# Eğer çalınan parça yoksa veya URL boşsa ve içinde https:// yoksa doğrudan playerctl çıktısını echo ile döndür
if [[ -z "$current_title" || -z "$url" || ! "$url" =~ ^https:// ]]; then
    echo "$url"  # URL içinde https:// yoksa doğrudan çıktıyı echo ile döndür
    exit 0
fi

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
    wget -q -O "$COVER_ART_FILE" "$url"
    echo "file://$COVER_ART_FILE"
else
    # Şarkı değişmediyse mevcut resim dosyasını döndür
    echo "file://$COVER_ART_FILE"
fi
