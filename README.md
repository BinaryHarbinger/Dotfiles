
----------------------------------------------------------------------------------------

# Hyprland dotfiles by Binary Harbinger

----------------------------------------------------------------------------------------

## What are oppurtunities?

» Those dotfiles includes runner menu.

» Notification center.

» Understandable Waybar configuration.

» Highly functional Hyprland configuration.

» Themed and extension included Spotify.

» Custom scripts.

» Custom QT theme.

## *Some Photos*

![Photo](https://raw.githubusercontent.com/BinaryHarbinger/Dotfiles/main/preview/image0.png?raw=true)


![Photo](https://raw.githubusercontent.com/BinaryHarbinger/Dotfiles/main/preview/image4.png?raw=true)

![Photo](https://raw.githubusercontent.com/BinaryHarbinger/Dotfiles/main/preview/image6.png?raw=true)

![Photo](https://raw.githubusercontent.com/BinaryHarbinger/Dotfiles/main/preview/image3.png?raw=true)


----------------------------------------------------------------------------------------

## How to install?

You have to install yay before all. Because some of the dependecies is not in offical repistories.

To install yay: 
```
sudo pacman -Sy --needed git base-devel
git clone https://aur.archlinux.org/yay.git
cd yay
makepgk -si
```

After you installed yay. Run this command:
```
pacman -Sy --needed curl
curl -sSL https://raw.githubusercontent.com/BinaryHarbinger/Dotfiles/refs/heads/main/install.sh | bash

```
_If you get errors during and after installation try to enable multilib repistory from Arch Linux_

# Installing manualy (For non-Arch based distros)

» You have to install all the dependecies from your package manager.

» Copy all the directories (except preview) to your .config folder

***


----------------------------------------------------------------------------------------

# Keybindings

## General Management
- **SUPER + M**: Exit Hyprland
- **SUPER + V**: Toggle floating mode for the active window
- **SUPER + C**: Close (kill) the active window
- **ALT + F4**: Close (kill) the active window (alternative)
- **SUPER + P**: Toggle pseudo-tile layout (Dwindle mode)
- **SUPER + J**: Toggle split mode (Dwindle mode)
- **SUPER + F**: Toggle fullscreen mode for the active window
- **SUPER + X**: Open clipboard

## Application Shortcuts
- **SUPER + N**: Launch `swaync-client` in system tray mode
- **SUPER + T**: Open terminal (`kitty`)
- **SUPER + Q**: Open application menu (`rofi` submenu)
- **SUPER + E**: Open file manager (`thunar`)
- **SUPER + B**: Open web browser with a blank page (`xdg-open`)
- **SUPER + L**: Lock screen (`hyprlock`)
- **SUPER + O**: Lock screen (alternative with `wlogout`)
- **SUPER + W**: Launch `waybar`
- **SUPER + H**: Launch `hyprpaper`
- **SUPER + PRINT**: Take a screenshot (`hyprshot-gui`)
- **SUPER + S**: Open application menu (`rofi` dmenu)
- **SUPER + R**: Open application menu (`rofi` run)
- **SUPER + TAB**: Switch between applications (`rofi` switcher)

## Media and Brightness Control
- ** Function buttons on your keyboard will work.

## Window Focus and Movement
- **SUPER + LEFT/RIGHT/UP/DOWN**: Move window focus in the specified direction
- **SUPER + SHIFT + 1-0**: Move the active window to the corresponding workspace (1-10)
- **SUPER + ALT + TAB**: Switch to the next workspace

## Workspace Management
- **SUPER + 1-9, 0**: Switch to the corresponding workspace (1-10)
- **SUPER + MOUSE_UP**: Scroll up through existing workspaces
- **SUPER + MOUSE_DOWN**: Scroll down through existing workspaces

## Window Move/Resize
- **SUPER + LEFT_MOUSE_BUTTON**: Move window
- **SUPER + RIGHT_MOUSE_BUTTON**: Resize window

