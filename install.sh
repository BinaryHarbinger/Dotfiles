#!/bin/bash

echo "Binary Harbingers Dotfiles v2.0"

# Helper function to run commands silently and show errors
run_cmd() {
    "$@" >/dev/null 2>&1
    if [ $? -ne 0 ]; then
        echo "Error while running: $*"
    fi
}

echo "Updating system..."
run_cmd yay -Syu --noconfirm --needed >/dev/null 2>&1
run_cmd yay -Rnsdd --noconfirm hyprutils >/dev/null 2>&1

PACKAGES=(
  breeze cliphist spicetify-cli-git git nwg-look qt6ct fish power-profiles-daemon fastfetch ttf-jetbrains-mono-nerd ttf-jetbrains-mono
  ttf-fira-code otf-fira-code-symbol hyprland yazi micro rofi-wayland hyprlock hyprpolkitagent unzip
  hyprpaper wlogout kitty alacritty papirus-icon-theme base-devel waybar swaync mpv hyprpicker eww pamixer hypridle
  network-manager-applet graphite-gtk-theme-nord-normal-git colloid-icon-theme-git pamixer brightnessctl hyprswitch avizo
)

echo "Installing packages..."
run_cmd yay -S --noconfirm --needed "${PACKAGES[@]}" >/dev/null 2>&1

echo "Setting up polkit agent..."
run_cmd systemctl --user enable --now hyprpolkitagent.service

echo "Installing Spicetify..."
run_cmd curl -fsSL https://raw.githubusercontent.com/spicetify/spicetify-marketplace/main/resources/install.sh | sh

echo "Cloning dotfiles repository..."
run_cmd git clone https://github.com/BinaryHarbinger/dotfiles.git
cd dotfiles || { echo "Failed to enter the dotfiles directory!"; exit 1; }

echo "Updating username in configs..."
run_cmd sed -i "s/kb_layout = tr/kb_layout = $(localectl status | grep 'X11 Layout' | awk '{print $3}')/g" ./hypr/hyprland.conf

echo "Moving script files..."
run_cmd cp -rf ./.scripts ~
run_cmd chmod +x ~/.scripts/*

echo "Moving configuration files..."
run_cmd rm -rf ./preview
run_cmd cp -rf ./* ~/.config/
run_cmd chmod +x ~/.config/hypr/scripts/*
run_cmd chmod +x ~/.config/eww/scripts/*
run_cmd ln -sf "$HOME/.config/hypr/wallppr.jpg" "$HOME/.config/hypr/wallppr.png"

echo "Applying Spicetify theme..."
run_cmd spicetify restore backup apply

echo "Changing default shell to fish..."
run_cmd sudo chsh -s /bin/fish "$USER"

THEME_NAME="Materia-dark-compact"
echo "Setting GTK theme to $THEME_NAME..."
if command -v gsettings &>/dev/null; then
    echo "Configuring GNOME settings..."
    run_cmd gsettings set org.gnome.desktop.interface gtk-theme "$THEME_NAME"
    run_cmd gsettings set org.gnome.desktop.wm.preferences theme "$THEME_NAME"
else
    echo "GSettings not available, skipping."
fi

GTK3_CONFIG="$HOME/.config/gtk-3.0/settings.ini"
mkdir -p "$(dirname "$GTK3_CONFIG")" >/dev/null 2>&1
cat >"$GTK3_CONFIG" <<EOL
[Settings]
gtk-theme-name=$THEME_NAME
gtk-icon-theme-name=Papirus-Dark
gtk-font-name=Noto Sans 10
EOL

GTK2_CONFIG="$HOME/.gtkrc-2.0"
cat >"$GTK2_CONFIG" <<EOL
gtk-theme-name="$THEME_NAME"
gtk-icon-theme-name="Papirus-Dark"
gtk-font-name="Noto Sans 10"
EOL

echo "Applying changes..."

if pgrep -x "waybar" >/dev/null; then
    echo "Relaunching waybar"
    pkill waybar >/dev/null&&waybar >/dev/null& disown >/dev/null&
fi

if pgrep -x "hyprpaper" >/dev/null; then
    echo "Relaunching hyprpaper"
    pkill hyprpaper >/dev/null &&hyprpaper >/dev/null& disown&
fi
sleep 1
if pgrep -x "eww" >/dev/null; then
    echo "Relaunching eww"
    killall eww&eww d&eww open-many stats desktopmusic >/dev/null& disown >/dev/null&
fi

if pgrep xfce4-panel &>/dev/null; then
    run_cmd xfsettingsd --replace &
else
    echo "Restart your session to apply changes."
fi

echo "Cleaning up..."
cd ..
run_cmd rm -rf ./dotfiles

echo "Installation complete!"
