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
            alacritty
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

system_menu() {
    # Menu options displayed in rofi
    options="X Clear Cache\nX Clear Clipboard\n Session Options\n Update Rice\n Update System"

    # Prompt user to choose an option
    chosen=$(echo -e "$options" | rofi -config ~/.config/rofi/launcher.rasi -dmenu -p "Select an option:")

    # Execute the corresponding command based on the selected option
    case $chosen in
        "X Clear Cache")
         	find ~/.cache -mindepth 1 -maxdepth 1 \
         	  ! -name "spotify" \
         	  ! -name "cliphist" \
         	  ! -name "yay" \
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
            alacritty -e ~/.scripts/update
            ;;
        " Update System")
                    alacritty -e ~/.scripts/updaterice
                    ;;
        *)
            echo "No option selected"
            ;;
    esac
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
    --system_menu)
    	system_menu
    	;;
    *)
        usage
        ;;
esac
