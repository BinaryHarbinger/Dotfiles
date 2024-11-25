yay -Syu --noconfirm spicetify-cli git nwg-look qt6ct fish power-profiles-daemon fastfetch ttf-fira-code otf-fira-code-symbol hyprland yazi micro rofi-wayland hyprlock hyprpaper wlogout kitty alacritty papirus-icon-theme base-devel git waybar swaync network-manager-applet

curl -fsSL https://raw.githubusercontent.com/spicetify/spicetify-marketplace/main/resources/install.sh | sh

git clone https://github.com/BinaryHarbinger/dotfiles.git
cd dotfiles

rm -r preview

sed -i "s/USERNAME/${USER}/g" ./swaync/config.json
mv ./.scripts ~
chmod +x ~/.scripts/*
mv ./* ~/.config/
chmod +x ~/.config/hypr/scripts/*

spicetify apply

chsh -s /bin/fish
