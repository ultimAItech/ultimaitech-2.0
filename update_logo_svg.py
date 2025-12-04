import base64
from PIL import Image
import os

# Path to the new user-uploaded PNG (background already removed)
image_path = '/Users/andrehassler/.gemini/antigravity/brain/8596b52d-9841-40b7-9abe-20c51f872160/uploaded_image_1764855499839.png'
output_path = 'images/logo_converted.svg'

# Get dimensions
with Image.open(image_path) as img:
    width, height = img.size

# Encode image
with open(image_path, 'rb') as f:
    img_data = base64.b64encode(f.read()).decode('utf-8')

# Create SVG content
# Simply wrapping the PNG in an SVG image tag preserves transparency and exact look
svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}">
    <image href="data:image/png;base64,{img_data}" width="{width}" height="{height}" />
</svg>'''

with open(output_path, 'w') as f:
    f.write(svg_content)

print(f"Updated SVG at {output_path} with dimensions {width}x{height}")
