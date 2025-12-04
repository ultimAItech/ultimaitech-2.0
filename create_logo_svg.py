import base64
from PIL import Image
import os

image_path = '/Users/andrehassler/.gemini/antigravity/brain/8596b52d-9841-40b7-9abe-20c51f872160/uploaded_image_1764850033569.jpg'
output_path = 'images/logo_converted.svg'

# Get dimensions
with Image.open(image_path) as img:
    width, height = img.size

# Encode image
with open(image_path, 'rb') as f:
    img_data = base64.b64encode(f.read()).decode('utf-8')

# Create SVG content
# We use a luminance mask: The brighter the pixel, the more opaque it is.
# This effectively removes the black background.
svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}">
    <defs>
        <mask id="luminance-mask" maskContentUnits="objectBoundingBox">
            <image href="data:image/jpeg;base64,{img_data}" width="1" height="1" preserveAspectRatio="none" />
        </mask>
    </defs>
    <image href="data:image/jpeg;base64,{img_data}" width="{width}" height="{height}" mask="url(#luminance-mask)" />
</svg>'''

with open(output_path, 'w') as f:
    f.write(svg_content)

print(f"Created SVG at {output_path} with dimensions {width}x{height}")
