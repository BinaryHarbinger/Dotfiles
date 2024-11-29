#!/bin/bash

echo Binary Harbingers Dotfiles v1.4.1

# First, update the system, but skip already installed packages
echo "Updating system..."
yay -Syu --noconfirm --needed

# Install required packages, but skip already installed ones
PACKAGES=(
  breeze cliphist spicetify-cli-git git nwg-look qt6ct fish power-profiles-daemon fastfetch
  ttf-fira-code otf-fira-code-symbol hyprland yazi micro rofi-wayland hyprlock
  hyprpaper wlogout kitty alacritty papirus-icon-theme base-devel waybar swaync
  network-manager-applet
)

echo "Installing packages..."
yay -S --noconfirm --needed "${PACKAGES[@]}"

# Install Spicetify
echo "Installing Spicetify..."
curl -fsSL https://raw.githubusercontent.com/spicetify/spicetify-marketplace/main/resources/install.sh | sh

# Clone the dotfiles repository
echo "Cloning dotfiles repository..."
git clone https://github.com/BinaryHarbinger/dotfiles.git
cd dotfiles || { echo "Failed to enter the dotfiles directory!"; exit 1; }

# Replace the username in the config file
echo "Updating username in config..."
sed -i "s/USERNAME/${USER}/g" ./swaync/config.json

# Move script files to the home directory, force overwrite
echo "Moving script files..."
cp -r ./.scripts ~
chmod +x ~/.scripts/*

# Move configuration files to the .config directory, force overwrite
echo "Moving configuration files..."
cp -r ./* ~/.config/
chmod +x ~/.config/hypr/scripts/*

# Apply Spicetify theme
echo "Applying Spicetify theme..."
spicetify restore backup apply

# Set Fish as the default shell
echo "Would you like to change the default shell to Fish? (y/n)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
  if [[ "$SHELL" == "/bin/fish" ]]; then
    echo "Fish is already your default shell."
  else
    echo "Changing the default shell to Fish using sudo..."
    sudo chsh -s /bin/fish "$USER"
    if [[ $? -eq 0 ]]; then
      echo "Shell successfully changed to Fish. Please log out and log back in for changes to take effect."
    else
      echo "Failed to change shell. Please check your permissions or manually run 'sudo chsh -s /bin/fish $USER'."
    fi
  fi
else
  echo "Shell change skipped."
fi


cd .. 
rm -r ./dotfiles

# Final message after installation
echo "Installation complete!"
