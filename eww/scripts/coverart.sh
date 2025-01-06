#!/bin/bash

# Config dosya yolları
CONFIG_DIR="$HOME/.config/eww"
COVER_ART_FILE="$CONFIG_DIR/coverart.png"
INFO_FILE="$CONFIG_DIR/info.txt"

# Çalınan parçanın bilgilerini al
current_title=$(playerctl metadata --format "{{ title }}" 2>/dev/null)
url=$(playerctl metadata --format "{{ mpris:artUrl }}" 2>/dev/null | sed 's/b273/1e02/')

# Eğer çalınan parça yoksa veya URL boşsa doğrudan playerctl çıktısını echo ile döndür
if [[ -z "$current_title" || -z "$url" ]]; then
    echo "No track playing or missing metadata."
    exit 0
fi

# Eski şarkı adını oku
if [[ -f "$INFO_FILE" ]]; then
    last_title=$(cat "$INFO_FILE")
else
    last_title=""
fi

# Base64 formatında bir URL mi kontrol et
if echo "$url" | grep -q '^data:image/jpeg;base64,'; then
    # Base64 kodunu çıkar
    base64_data=$(echo "$url" | sed 's|^data:image/jpeg;base64,||')

    # Eğer şarkı adı değişmişse Base64 verisini işle
    if [[ "$current_title" != "$last_title" ]]; then
        echo "$current_title" > "$INFO_FILE" # Yeni şarkı adını kaydet
        echo "$base64_data" | base64 --decode > "$COVER_ART_FILE" # Yeni resmi oluştur
    fi

    echo "file://$COVER_ART_FILE"
    exit 0
fi

# Eğer URL https:// ile başlamıyorsa doğrudan çıktıyı döndür
if [[ ! "$url" =~ ^https:// ]]; then
    echo "$url"
    exit 0
fi

# Eğer şarkı adı değişmişse yeni resmi indir
if [[ "$current_title" != "$last_title" ]]; then
    echo "$current_title" > "$INFO_FILE" # Yeni şarkı adını kaydet
    wget -q -O "$COVER_ART_FILE" "$url" # Yeni resmi indir
fi

# Mevcut resim dosyasını döndür
echo "file://$COVER_ART_FILE"
