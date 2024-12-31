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

PACKAGES=(
  breeze cliphist spicetify-cli-git git nwg-look qt6ct fish power-profiles-daemon fastfetch ttf-jetbrains-mono-nerd ttf-jetbrains-mono
  ttf-fira-code otf-fira-code-symbol hyprland yazi micro rofi-wayland hyprlock hyprpolkitagent unzip hyprsunset rofimoji
  hyprpaper wlogout kitty alacritty papirus-icon-theme base-devel waybar swaync mpv hyprpicker eww pamixer hypridle
  network-manager-applet colloid-icon-theme-git pamixer brightnessctl hyprswitch avizo
)

echo "Installing packages..."
yay -S --noconfirm --needed "${PACKAGES[@]}"

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
run_cmd ln -sf "$HOME/.config/hypr/wallpapers/lines.jpg" "$HOME/.config/hypr/wallppr.png"

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

echo "Applying changes..."

if pgrep -x "waybar" >/dev/null; then
    echo "Relaunching waybar"
    pkill waybar >/dev/null 2>&&1 && waybar >/dev/null 2>&1 & disown >/dev/null&
fi

if pgrep -x "hyprpaper" >/dev/null; then
    echo "Relaunching hyprpaper"
    run_cmd pkill hyprpaper >/dev/null 2>&&1 &&hyprpaper >/dev/null 2>&1& disown& >/dev/null&
fi
sleep 1
if pgrep -x "eww" >/dev/null; then
    echo "Relaunching eww"
    killall eww&&eww d&&eww open-many stats desktopmusic >/dev/null& disown >/dev/null&
fi


echo "Restart your session to apply changes."

echo "Cleaning up..."
cd ..
run_cmd rm -rf ./dotfiles

echo "Installation complete!"
