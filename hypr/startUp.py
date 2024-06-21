import threading

from playsound import playsound
from os import system
from time import sleep

def start_up_sound():
    playsound(".config/hypr/startUp.mp3")

def fix_bluetooth():
    system("rfkill block bluetooth")
    system("rfkill unblock bluetooth")
    sleep(0.3)
    system("bluetoothctl power off")

threading.Thread(target=start_up_sound()).start()
threading.Thread(target=fix_bluetooth()).start()
