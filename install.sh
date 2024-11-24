yay -Syu --noconfirm ttf-fira-code otf-fira-code-symbol hyprland yazi micro rofi-wayland hyprlock hyprpaper wlogout kitty alacritty papirus-icon-theme base-devel git waybar swaync network-manager-applet

sed -i "s/USERNAME/${USER}/g" ./swaync/config.json

cp -r ./* ~/.config/
