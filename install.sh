yay -Sy ttf-fira-code otf-fira-code-symbol hyprlock hyprpaper wlogout kitty papirus-icon-theme python-playsound base-devel git waybar swaync
git clone https://github.com/lbonn/rofi.git
cd rofi
meson build

cp -r ./waybar ~/.config/
cp -r ./hypr ~/.config/
cp -r ./kitty ~/.config/
cp -r ./rofi ~/.config/
cp -r ./wlogout ~/.config/
