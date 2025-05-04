
----------------------------------------------------------------------------------------

<h1 align="center">Hyprland Dotfiles by Binary Harbinger</h1>

----------------------------------------------------------------------------------------

## Features

» Simple and effective style.

» Optimized.

» Python based customization options. (Rofi as GUI)

» Auto installable. (On Arch *(based distros)*)

## *Example Photos*

<details><summary>
🔍 Rofi
</summary></p>

![image](https://raw.githubusercontent.com/BinaryHarbinger/Dotfiles/main/preview/rofi.png)

<p></details>

<details><summary>
⚙️ Rofi Menu
</summary></p>

![image](https://raw.githubusercontent.com/BinaryHarbinger/Dotfiles/main/preview/rofiMenu.png)

<p></details>

<details><summary>
⚙️ Action Center
</summary></p>

![image](https://raw.githubusercontent.com/BinaryHarbinger/Dotfiles/main/preview/center.png)

<p></details>

<details><summary>
🎵 Player
</summary></p>

![image](https://raw.githubusercontent.com/BinaryHarbinger/Dotfiles/main/preview/player.png)

<p></details>

<details><summary>
🔔 SwayNC
</summary></p>

![image](https://raw.githubusercontent.com/BinaryHarbinger/Dotfiles/main/preview/swaync.png)

<p></details>

<details><summary>
⌨️ Terminal Applications
</summary></p>

![image](https://raw.githubusercontent.com/BinaryHarbinger/Dotfiles/main/preview/terminal.png)

<p></details>
<details><summary>
❗On Screen Display
</summary></p>

![image](https://raw.githubusercontent.com/BinaryHarbinger/Dotfiles/main/preview/osd.png)

<p></details>

<details><summary>
🔄 Window Switcher
</summary></p>

![image](https://raw.githubusercontent.com/BinaryHarbinger/Dotfiles/main/preview/switcher.png)

<p></details>

<details><summary>
💻 Desktop Widgets
</summary></p>

![image](https://raw.githubusercontent.com/BinaryHarbinger/Dotfiles/main/preview/desktop.png)

<p></details>

<details><summary>
🚪 Session Options
</summary></p>

![image](https://raw.githubusercontent.com/BinaryHarbinger/Dotfiles/main/preview/wlogout.png)

<p></details>

<details><summary>
🔒 Lock Screen
</summary></p>

![image](https://raw.githubusercontent.com/BinaryHarbinger/Dotfiles/main/preview/hyprlock.png)

<p></details>
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

## Check other Binary themes

[SDDM](https://github.com/BinaryHarbinger/sddm-binary-theme)
[Heroic Games Launcher](https://github.com/BinaryHarbinger/Heroic-Games-Launcher-Binary-Theme)




----------------------------------------------------------------------------------------

<h1 align="center">Keybindings</h1>

## General Management
- **SUPER + M**: Exit Hyprland
- **SUPER + V**: Toggle floating mode for the active window
- **SUPER + C**: Close (kill) the active window
- **ALT + F4**: Close (kill) the active window (alternative)
- **SUPER + P**: Toggle pseudo-tile layout (Dwindle mode)
- **SUPER + J**: Toggle split mode (Dwindle mode)
- **SUPER + F**: Toggle fullscreen mode for the active window
- **SUPER + X**: Open clipboard

## Application Shortcuts:
- SUPER + N: Launch swaync-client in system tray mode
- SUPER + T: Open terminal (Alacritty)
- SUPER + Q: Open application menu (rofi submenu)
- SUPER + E: Open file manager (thunar)
- SUPER + B: Open web browser with a blank page (xdg-open)
- SUPER + L: Session options (Wlogout)
- SUPER + O: Color Picker (alternative with wlogout)
- SUPER + W: Launch or close waybar
- SUPER + H: Launch help menu
- SUPER + PRINT: Take a screenshot (hyprshot-gui)
- SUPER + S: Open application menu (rofi dmenu)
- SUPER + R: Open application menu (rofi run)
- SUPER + Q: Open quick menu (rofi)
- SUPER + X: Open clipboard (rofi)
- SUPER + L: Open system menu (rofi)
- SUPER + L: Launch Emoji Picker (rofimoji)
- SUPER + TAB: Switch between applications (Hyprswitch)

## Media and Brightness Controls:
- The function keys on keyboard will work =)

- 
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

