yay -Syu --noconfirm git nwg-look qt6ct fish power-profiles-daemon fastfetch ttf-fira-code otf-fira-code-symbol hyprland yazi micro rofi-wayland hyprlock hyprpaper wlogout kitty alacritty papirus-icon-theme base-devel git waybar swaync network-manager-applet

git clone https://github.com/BinaryHarbinger/dotfiles.git
cd dotfiles

rm -r preview readme.md

sed -i "s/USERNAME/${USER}/g" ./swaync/config.json
mv ./.scripts ~
chmod +x ~/.scripts/*
mv -r ./* ~/.config/
chmod +x ~/.config/hypr/scripts/*

chsh -s /bin/fish
