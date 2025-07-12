from subprocess import run as runCommand
import json
import sys

arguments = sys.argv[1:]

data = defaultData = {
    "stats": 1,
    "desktopmusic": 1,
    "deskclockwin": 1
}

defaultDataJson = json.dumps(defaultData, indent=3)

# Import the file
def loadFile():
    try:
        with open('widgets.json','r') as file:
            data = json.load(file)
    except:
        data = defaultDataJson
    return data

#Write the file
def writeFile(dataFile=defaultData):
    jsonData = json.dumps(dataFile, indent=3)
    with open('widgets.json','w') as file :
        file.write(jsonData)

def openWidgets(dataF=data):
    if dataF.get("stats"):
        command = ["/usr/bin/eww", "open", "stats"]
        runCommand(command)
    if dataF.get("deskclockwin"):
        command = ["/usr/bin/eww", "open", "deskclockwin"]
        runCommand(command)
    if dataF.get("desktopmusic"):
        command = ["/usr/bin/eww", "open", "desktopmusic"]
        runCommand(command)

changeArguments = {"one","two","three"}

try:
    data = loadFile()
except:
    pass

for argument in arguments:
    if argument in changeArguments:
        if argument == "one":
            print("One detected")
            currentState = not data.get("stats")
            data.update(stats = int(currentState))
        elif argument == "two":
            print("Two detected")
            currentState = not data.get("desktopmusic")
            data.update(desktopmusic = int(currentState))
        elif argument == "three":
            print("Three detected")
            currentState = not data.get("deskclockwin")
            data.update(deskclockwin = int(currentState))
        print(data)
        writeFile(data)
    else:
        command = ["/usr/bin/eww", "r"]
        if argument == "s":
            command = ["/usr/bin/eww", "r"]
            runCommand(command)
            openWidgets(data)
        elif argument == "r":
            command = ["eww","close-all"]
            runCommand(command)
            command = ["kill","-9","eww"]
            runCommand(command)
            command = ["eww", "d"]
            runCommand(command)
            openWidgets(data)
            command = ["eww", "r"]
            print(data)

exit()
