#!/bin/bash

CONFIG_DIR="$HOME/.config/eww"
COVER_ART_FILE="$CONFIG_DIR/coverart.png"
INFO_FILE="$CONFIG_DIR/info.txt"
DEFAULT_COVER="$CONFIG_DIR/default.png"

current_title=$(playerctl metadata --format "{{ title }}" 2>/dev/null)
art_url=$(playerctl metadata --format "{{ mpris:artUrl }}" 2>/dev/null)
media_url=$(playerctl metadata --format "{{ xesam:url }}" 2>/dev/null)

# YouTube için art_url yoksa thumbnail üret
if [[ -z "$art_url" && "$media_url" =~ youtube\.com/watch\?v=([a-zA-Z0-9_-]+) ]]; then
    video_id="${BASH_REMATCH[1]}"
    art_url="https://img.youtube.com/vi/$video_id/maxresdefault.jpg"
fi

# Eğer şarkı yoksa çık
if [[ -z "$current_title" ]]; then
    echo ""
    exit 0
fi

# Eski başlığı oku
if [[ -f "$INFO_FILE" ]]; then
    last_title=$(<"$INFO_FILE")
else
    last_title=""
fi

# Base64 kontrolü
if echo "$art_url" | grep -q '^data:image/jpeg;base64,'; then
    base64_data=$(echo "$art_url" | sed 's|^data:image/jpeg;base64,||')

    if [[ "$current_title" != "$last_title" ]]; then
        echo "$current_title" > "$INFO_FILE"
        echo "$base64_data" | base64 --decode > "$COVER_ART_FILE"
    fi

    echo "file://$COVER_ART_FILE"
    exit 0
fi

# HTTPS URL'si varsa indir
if [[ "$art_url" =~ ^https:// ]]; then
    if [[ "$current_title" != "$last_title" ]]; then
        echo "$current_title" > "$INFO_FILE"
        wget -q -O "$COVER_ART_FILE" "$art_url" || cp "$DEFAULT_COVER" "$COVER_ART_FILE"
    fi

    echo "file://$COVER_ART_FILE"
    exit 0
fi

# file:// ile başlayan yerel dosya varsa direkt göster
if [[ "$art_url" =~ ^file:// ]]; then
    # Eğer başlık değiştiyse eski resmi yeni kapakla değiştir
    if [[ "$current_title" != "$last_title" ]]; then
        # Dosyayı kopyala ya da linkle
        cp "${art_url#file://}" "$COVER_ART_FILE"
        echo "$current_title" > "$INFO_FILE"
    fi
    echo "file://$COVER_ART_FILE"
    exit 0
fi

# Hiçbiri değilse varsayılan görseli göster
echo "file://$DEFAULT_COVER"
exit 0
