
import os
from PIL import Image
import numpy as np

SOURCE_DIR = os.path.expanduser("~/Desktop/client logo")
DEST_DIR = "src/public/images/clients"
FILES = ["adani.png", "hapag lloyd.png", "maersk.png", "samsung.png", "toyota.png", "2.png"]

def process_image(filename):
    try:
        source_path = os.path.join(SOURCE_DIR, filename)
        if not os.path.exists(source_path):
            print(f"Skipping {filename}: Not found")
            return

        img = Image.open(source_path).convert("RGBA")
        data = np.array(img)

        # Simple white background removal:
        # If R,G,B > 240, make alpha 0
        red, green, blue, alpha = data.T
        white_areas = (red > 240) & (green > 240) & (blue > 240)
        data[..., 3][white_areas.T] = 0

        img_new = Image.fromarray(data)
        
        # Save as WebP
        dest_name = os.path.splitext(filename)[0].replace(" ", "-").lower() + ".webp"
        dest_path = os.path.join(DEST_DIR, dest_name)
        img_new.save(dest_path, "WEBP")
        print(f"Processed: {filename} -> {dest_path}")
        
    except Exception as e:
        print(f"Error processing {filename}: {e}")

for f in FILES:
    process_image(f)
