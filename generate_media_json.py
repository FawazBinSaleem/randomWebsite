import os
import json


MEDIA_FOLDER = "media"


ALLOWED_EXTENSIONS = (".jpg", ".jpeg", ".png", ".mp4", ".webm")


files = [
    f"{MEDIA_FOLDER}/{file}"
    for file in sorted(os.listdir(MEDIA_FOLDER))  # Sort for consistency
    if file.lower().endswith(ALLOWED_EXTENSIONS)
]


with open("media.json", "w") as f:
    json.dump(files, f, indent=4)

print(f"✅ media.json generated with {len(files)} files!")