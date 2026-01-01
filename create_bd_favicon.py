#!/usr/bin/env python3
"""
Script to create a professional "BD" favicon
Requires Pillow: pip install Pillow
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
except ImportError:
    print("Pillow is required. Install it with: pip install Pillow")
    exit(1)

# Output directory
output_dir = "assets"

def create_bd_favicon(size, filename):
    """Create a favicon with BD letters"""
    # Create a new image with transparent background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Try to use a professional thin font, fallback to default if not available
    try:
        # Try to use a system font (Windows) - using regular/thin fonts instead of bold
        font_paths = [
            "C:/Windows/Fonts/arial.ttf",  # Arial Regular (thinner)
            "C:/Windows/Fonts/calibri.ttf",  # Calibri Regular (thinner)
            "C:/Windows/Fonts/georgia.ttf",  # Georgia Regular (thinner)
            "C:/Windows/Fonts/segoeui.ttf",  # Segoe UI Regular (thin and modern)
        ]
        font = None
        for font_path in font_paths:
            if os.path.exists(font_path):
                try:
                    font = ImageFont.truetype(font_path, int(size * 0.65))
                    break
                except:
                    continue
    except:
        pass
    
    # If no font found, use default
    if font is None:
        try:
            font = ImageFont.truetype("arial.ttf", int(size * 0.65))
        except:
            font = ImageFont.load_default()
    
    # Get text dimensions
    text = "BD"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Calculate position to center the text
    x = (size - text_width) / 2
    y = (size - text_height) / 2 - bbox[1]
    
    # Calculate circle dimensions - make it much bigger, filling most of the space
    # Use about 95% of the size to make it a large, clearly visible circle
    margin = max(1, size // 20)  # Very small margin from edges
    circle_radius = (size / 2) - margin
    
    # Center the circle
    circle_center_x = size / 2
    circle_center_y = size / 2
    
    # Calculate circle bounding box
    circle_left = circle_center_x - circle_radius
    circle_top = circle_center_y - circle_radius
    circle_right = circle_center_x + circle_radius
    circle_bottom = circle_center_y + circle_radius
    
    # Draw white circular background (transparent background, white circle)
    draw.ellipse([circle_left, circle_top, circle_right, circle_bottom], 
                 fill=(255, 255, 255, 255))  # White background
    
    # Draw text in black with thin font
    draw.text((x, y), text, font=font, fill=(0, 0, 0, 255))  # Black color
    
    # Save the image
    output_path = os.path.join(output_dir, filename)
    # Save the image with transparency preserved
    output_path = os.path.join(output_dir, filename)
    if filename.endswith('.ico'):
        # For ICO, save as PNG format (browsers accept PNG with .ico extension)
        # This preserves transparency better than true ICO format
        img.save(output_path, 'PNG')
    else:
        # For PNG, save with transparency preserved
        img.save(output_path, 'PNG', optimize=True)
    
    return output_path

# Create different favicon sizes
sizes = {
    'favicon-16x16.png': 16,
    'favicon-32x32.png': 32,
    'apple-touch-icon.png': 180,
    'favicon.png': 192,
    'favicon.ico': 32
}

print("Creating professional BD favicon files...")
for filename, size in sizes.items():
    output_path = create_bd_favicon(size, filename)
    print(f"  Created {output_path} ({size}x{size})")

print("\nAll BD favicon files created successfully!")
print("Files created in assets/ directory:")
for filename in sizes.keys():
    print(f"  - {filename}")

