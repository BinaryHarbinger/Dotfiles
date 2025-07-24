#!/usr/bin/env bash

cd ~

# Usage Information
usage() {
    echo "Usage: $0 [--drun | --run | --menu]"
    echo ""
    echo "  --drun   : Launches the application launcher (drun)."
    echo "  --run    : Launches the command runner (run)."
    echo "  --menu   : Displays a custom menu with multiple options."
    exit 1
}

# Function: DRUN Launcher
drun_launcher() {
    rofi \
        -show drun \
        -theme ~/.config/rofi/launcher.rasi
}

# Function: RUN Launcher
run_launcher() {
    rofi \
        -show run \
        -theme ~/.config/rofi/launcher.rasi
}

# Function: CONFIRMATION Launcher
conf_launcher() {
    rofi \
    -show run \
    -theme ~/.config/rofi/confirm.rasi
}

# Function: Custom Menu
custom_menu() {
    # Menu options displayed in rofi
    options="\n\n\n\n\n"

    # Prompt user to choose an option
    chosen=$(echo -e "$options" | rofi -config ~/.config/rofi/submenu.rasi -dmenu -p "Select an option:")

    # Execute the corresponding command based on the selected option
    case $chosen in
        "")
            rofi -show drun
            ;;
        "")
            thunar
            ;;
        "")
            wlogout
            ;;
        "")
            ghostty
            ;;
        "")
            xdg-open https://about:blank
            ;;
        "")
            ~/.config/hypr/scripts/help
            ;;
        *)
            echo "No option selected"
            ;;
    esac
}

widget_settings() {
    # Menu options displayed in rofi
    options=" Desk Clock\n Change Stats\n Change Music\n Reload Widgets\n Initalize"

    # Prompt user to choose an option
    chosen=$(echo -e "$options" | rofi -config ~/.config/rofi/sysmenu.rasi -dmenu -p "Select an option:")

    # Execute the corresponding command based on the selected option
    case $chosen in
        " Desk Clock")
            bash ~/.config/hypr/scripts/widgets.sh three
            bash ~/.config/hypr/scripts/widgets.sh r
            ;;
        " Change Stats")
            bash ~/.config/hypr/scripts/widgets.sh one
            bash ~/.config/hypr/scripts/widgets.sh r
            ;;
        " Change Music")
            bash ~/.config/hypr/scripts/widgets.sh two
            bash ~/.config/hypr/scripts/widgets.sh r
            ;;
        " Reload Widgets")
            bash ~/.config/hypr/scripts/widgets.sh r
            ;;
        " Initalize Widgets")
            bash ~/.config/hypr/scripts/widgets.sh r
            ;;
        *)
            echo "No option selected"
            ;;
    esac
}

waybar_settings() {
    # Menu options displayed in rofi
    options=" Single Bar\n Binary Bar\n Floating Bar\n Reload Bar"

    # Prompt user to choose an option
    chosen=$(echo -e "$options" | rofi -config ~/.config/rofi/sysmenu.rasi -dmenu -p "Select an option:")

    # Execute the corresponding command based on the selected option
    case $chosen in
        " Single Bar")
            cp -r ~/.config/hypr/styles/waybar/bar.css ~/.config/waybar/style.css
            cp -r ~/.config/hypr/styles/waybar/barConfig ~/.config/waybar/config
            ;;
        " Binary Bar")
            cp -r ~/.config/hypr/styles/waybar/default.css ~/.config/waybar/style.css
            cp -r ~/.config/hypr/styles/waybar/defaultConfig ~/.config/waybar/config
            ;;
        " Floating Bar")
        cp -r ~/.config/hypr/themes/styles/floating.css ~/.config/waybar/style.css
        cp -r ~/.config/hypr/themes/styles/floatConfig ~/.config/waybar/config
            ;;
        " Reload Bar")
        pkill waybar
        waybar& disown
            ;;
        *)
            echo "No option selected"
            ;;
        esac

        if [[ -n "$chosen" ]]; then
            pkill waybar
            waybar & disown
        fi
}

rice_settings() {
    # Menu options displayed in rofi
    options=" Widgets\n Waybar Themes\n Wallpaper\n Themes"

    # Prompt user to choose an option
    chosen=$(echo -e "$options" | rofi -config ~/.config/rofi/sysmenu.rasi -dmenu -p "Select an option:")

    # Execute the corresponding command based on the selected option
    case $chosen in
        " Widgets")
            widget_settings
            ;;
        " Waybar Themes")
            waybar_settings
            ;;

        " Themes")
            theme_menu
            ;;
        " Wallpaper")
            set_wallpaper
            ;;
        *)
            echo "No option selected"
            ;;
    esac
}

wallpaper_settings() {
    # Menu options displayed in rofi
    options=" Lines\n Waves\n Patterns"

    # Prompt user to choose an option
    chosen=$(python ~/.config/hypr/scripts/wallpapers.py | rofi -config ~/.config/rofi/sysmenu.rasi -dmenu -p "Select an option:")

    # Execute the corresponding command based on the selected option
    case $chosen in
        " Lines")
            bash ~/.config/hypr/scripts/wallpaper.sh -s ~/.config/hypr/wallpapers/lines.png
            ;;
        " Waves")
        bash ~/.config/hypr/scripts/wallpaper.sh -s ~/.config/hypr/wallpapers/waves.png
            ;;
        " Patterns")
        bash ~/.config/hypr/scripts/wallpaper.sh -s .config/hypr/wallpapers/bgpatternblue.jpg
            ;;
        *)
            echo "No option selected"
            ;;
    esac
}

set_wallpaper() {

    # Prompt user to choose an option
    chosen=$(python ~/.config/hypr/scripts/wallpapers.py echoImageNames | rofi -config ~/.config/rofi/sysmenu.rasi -dmenu -p "Select an option:")
    # Execute the corresponding command based on the selected option
    echo $chosen
    python ~/.config/hypr/scripts/wallpapers.py changeWallpaper $chosen
}

system_menu() {
    # Menu options displayed in rofi
    options="X Clear Cache\nX Clear Clipboard\n Session Options\n Rice Settings\n Update System"

    # Prompt user to choose an option
    chosen=$(echo -e "$options" | rofi -config ~/.config/rofi/sysmenu.rasi -dmenu -p "Select an option:")

    # Execute the corresponding command based on the selected option
    case $chosen in
        "X Clear Cache")
            yay -Scc --no-confirm
         	find ~/.cache -mindepth 1 -maxdepth 1 \
         	  ! -name "spotify" \
         	  ! -name "cliphist" \
         	  ! -name "yay" \
         	  ! -name "mcpelauncher-webview"\
         	  ! -name "pip" \
         	  ! -name "rofi-entry-history.txt" \
         	  ! -name "Hyprland Polkit Agent" \
         	  ! -name "spotube" \
         	  ! -name "oss.krtirtho.spotube" \
         	  -exec rm -rf {} +;;
        "X Clear Clipboard")
            rm -rf ~/.cache/cliphist
            ;;
        " Session Options")
            wlogout
            ;;
        " Update System")
            ghostty -e ~/.scripts/update
            ;;
        " Rice Settings")
            rice_settings
                    ;;
        *)
            echo "No option selected"
            ;;
    esac
}

theme_menu() {
   THEME_DIR="$HOME/.config/hypr/themes"

    # Menu options displayed in rofi
    THEMES=$(find "$THEME_DIR" -mindepth 1 -maxdepth 1 -type d -printf '%f\n')

    # Prompt user to choose an option
    chosen=$(echo -e "$THEMES" | rofi -config ~/.config/rofi/sysmenu.rasi -dmenu -p "Themes")
    
    if [[ -z "$chosen" ]]; then 
        exit 1 
    fi

    THEME_PATH="$THEME_DIR/$chosen"
    cp -r $THEME_PATH/theme.scss ~/.config/eww/ 
    cp -r $THEME_PATH/theme.css ~/.config/waybar/
    cp -r $THEME_PATH/theme.css ~/.config/wlogout/ 
    cp -r $THEME_PATH/theme.css ~/.config/swaync/ 
    cp -r $THEME_PATH/theme.rasi ~/.config/rofi/ 
    eww r &
    pkill waybar
    waybar
    swaync-client --reload-css

    notify-send -u normal "🎨 Theme Changed" "" -i preferences-desktop-theme

}



# Check for flags and validate input
if [[ $# -ne 1 ]]; then
    usage
fi

# Execute the appropriate function based on the provided flag
case "$1" in
    --drun)
        drun_launcher
        ;;
    --run)
        run_launcher
        ;;
    --menu)
        custom_menu
        ;;
    --widget_settings)
    	widget_settings
    	;;
     --rice_settings)
     	rice_settings
     	;;
     --system_menu)
     	system_menu
     	;;
    *)
        usage
        ;;
esac
