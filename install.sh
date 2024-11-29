#!/bin/bash

# First, update the system, but skip already installed packages
echo "Updating system..."
yay -Syu --noconfirm --skipinteg

# Install required packages, but skip already installed ones
PACKAGES=(
  cliphist spicetify-cli git nwg-look qt6ct fish power-profiles-daemon fastfetch
  ttf-fira-code otf-fira-code-symbol hyprland yazi micro rofi-wayland hyprlock
  hyprpaper wlogout kitty alacritty papirus-icon-theme base-devel waybar swaync
  network-manager-applet
)

echo "Installing packages..."
yay -S --noconfirm --skipinteg "${PACKAGES[@]}"

# Install Spicetify
echo "Installing Spicetify..."
curl -fsSL https://raw.githubusercontent.com/spicetify/spicetify-marketplace/main/resources/install.sh | sh

# Clone the dotfiles repository
echo "Cloning dotfiles repository..."
git clone https://github.com/BinaryHarbinger/dotfiles.git
cd dotfiles || { echo "Failed to enter the dotfiles directory!"; exit 1; }

# Remove preview files
echo "Cleaning up preview files..."
rm -rf preview

# Replace the username in the config file
echo "Updating username in config..."
sed -i "s/USERNAME/${USER}/g" ./swaync/config.json

# Move script files to the home directory, force overwrite
echo "Moving script files..."
mv -f ./.scripts ~
chmod +x ~/.scripts/*

# Move configuration files to the .config directory, force overwrite
echo "Moving configuration files..."
mv -f ./* ~/.config/
chmod +x ~/.config/hypr/scripts/*

# Apply Spicetify theme
echo "Applying Spicetify theme..."
spicetify apply

# Set Fish as the default shell
echo "Setting Fish as the default shell..."
chsh -s /bin/fish

# Final message after installation
echo "Installation complete! Please restart your terminal."
