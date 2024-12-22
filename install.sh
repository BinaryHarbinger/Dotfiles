#!/bin/bash

echo "Binary Harbingers Dotfiles v2.0"

# First, update the system, but skip already installed packages
echo "Updating system..."
yay -Syu --noconfirm --needed

# Install required packages, but skip already installed ones
PACKAGES=(
  breeze cliphist spicetify-cli-git git nwg-look qt6ct fish power-profiles-daemon fastfetch ttf-jetbrains-mono-nerd ttf-jetbrains-mono
  ttf-fira-code otf-fira-code-symbol hyprland yazi micro rofi-wayland hyprlock hyprpolkitagent-git unzip
  hyprpaper wlogout kitty alacritty papirus-icon-theme base-devel waybar swaync mpv hyprpicker eww pamixer hypridle
  network-manager-applet graphite-gtk-theme-nord-normal-git colloid-icon-theme-git pamixer brightnessctl hyprswitch avizo
)

echo "Installing packages..."
yay -S --noconfirm --needed "${PACKAGES[@]}"

echo "Setting up polkit agent"
systemctl --user enable --now hyprpolkitagent.service

# Install Spicetify
echo "Installing Spicetify..."
curl -fsSL https://raw.githubusercontent.com/spicetify/spicetify-marketplace/main/resources/install.sh | sh

# Clone the dotfiles repository
echo "Cloning dotfiles repository..."
git clone https://github.com/BinaryHarbinger/dotfiles.git
cd dotfiles || { echo "Failed to enter the dotfiles directory!"; exit 1; }

# Replace the username in the config files
echo "Updating username in configs..."
sed -i "s/kb_layout = tr/kb_layout = $(localectl status | grep "X11 Layout" | awk '{print $3}')/g" ./hypr/hyprland.conf

# Move script files to the home directory, force overwrite
echo "Moving script files..."
cp -rf ./.scripts ~
chmod +x ~/.scripts/*

# Move configuration files to the .config directory, force overwrite
echo "Moving configuration files..."
rm -rf ./preview
cp -rf ./* ~/.config/
chmod +x ~/.config/hypr/scripts/*
chmod +x ~/.config/eww/scripts/*
ln -sf $HOME/.config/hypr/wallppr.jpg ~/.config/hypr/wallppr.png

# Apply Spicetify theme
echo "Applying Spicetify theme..."
spicetify restore backup apply

# Set Fish as the default shell
echo "Changing default shell to fish..."
sudo chsh -s /bin/fish $USER

# Change default theme
THEME_NAME="Materia-dark-compact"

echo "Setting GTK theme to $THEME_NAME..."

# Set the GTK theme for GNOME using GSettings
if command -v gsettings &> /dev/null; then
    echo "Configuring GNOME settings..."
    gsettings set org.gnome.desktop.interface gtk-theme "$THEME_NAME"
    gsettings set org.gnome.desktop.wm.preferences theme "$THEME_NAME"
else
    echo "GSettings is not available. Skipping GNOME-specific settings."
fi

# Update the GTK 3 configuration file
GTK3_CONFIG="$HOME/.config/gtk-3.0/settings.ini"
echo "Configuring GTK 3 settings..."
mkdir -p "$(dirname "$GTK3_CONFIG")"
cat > "$GTK3_CONFIG" <<EOL
[Settings]
gtk-theme-name=$THEME_NAME
gtk-icon-theme-name=Papirus-Dark
gtk-font-name=Noto Sans 10
EOL

# Update the GTK 2 configuration file
GTK2_CONFIG="$HOME/.gtkrc-2.0"
echo "Configuring GTK 2 settings..."
cat > "$GTK2_CONFIG" <<EOL
gtk-theme-name="$THEME_NAME"
gtk-icon-theme-name="Papirus-Dark"
gtk-font-name="Noto Sans 10"
EOL

# Apply the changes to the desktop environment
echo "Applying changes..."
if pgrep xfce4-panel &> /dev/null; then
    xfsettingsd --replace &  # Reload XFCE settings if XFCE panel is running
else
    echo "Restart your session or log out and back in to apply changes."
fi

# Cleanup the dotfiles repository
cd ..
rm -rf ./dotfiles

# Final message after installation
echo "Installation complete!"
