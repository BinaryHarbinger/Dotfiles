yay -Sy ttf-fira-code otf-fira-code-symbol hyprlock hyprpaper wlogout alacritty papirus-icon-theme base-devel git waybar swaync network-manager-applet
git clone https://github.com/lbonn/rofi.git
cd rofi
meson build

sed -i "s/USERNAME/${USER}/g" ./swaync/config.json

cp -r ./waybar ~/.config/
cp -r ./hypr ~/.config/
cp -r ./kitty ~/.config/
cp -r ./rofi ~/.config/
cp -r ./wlogout ~/.config/
cpr -r ./swaync ~/.config/
