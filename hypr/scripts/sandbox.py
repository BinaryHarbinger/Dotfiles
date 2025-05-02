defaultData = {
    "stats": 1,
    "desktopmusic": 1,
    "deskclockwin": 1
}

#defaultData.update({"stats": "deneme"})

xValue = int(defaultData.get("stats"))

xValue = bool(xValue)

xValue = not (xValue)

print(xValue)
