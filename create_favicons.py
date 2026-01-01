#!/usr/bin/env python3
"""
Script to create favicon files from logo.png
Requires Pillow: pip install Pillow
"""

try:
    from PIL import Image
    import os
except ImportError:
    print("Pillow is required. Install it with: pip install Pillow")
    exit(1)

# Input logo file
logo_path = "assets/logo.png"
output_dir = "assets"

# Check if logo exists
if not os.path.exists(logo_path):
    print(f"Error: {logo_path} not found!")
    exit(1)

# Open and process the logo
try:
    logo = Image.open(logo_path)
    
    # Convert to RGB if necessary (for PNG with transparency)
    if logo.mode in ('RGBA', 'LA', 'P'):
        # Create a white background
        background = Image.new('RGB', logo.size, (255, 255, 255))
        if logo.mode == 'P':
            logo = logo.convert('RGBA')
        background.paste(logo, mask=logo.split()[-1] if logo.mode == 'RGBA' else None)
        logo = background
    elif logo.mode != 'RGB':
        logo = logo.convert('RGB')
    
    # Create different favicon sizes
    sizes = {
        'favicon-16x16.png': (16, 16),
        'favicon-32x32.png': (32, 32),
        'apple-touch-icon.png': (180, 180),
        'favicon.png': (192, 192),  # General favicon
        'favicon.ico': (32, 32)  # Traditional ICO format
    }
    
    print("Creating favicon files...")
    for filename, size in sizes.items():
        # Resize with high-quality resampling
        resized = logo.resize(size, Image.Resampling.LANCZOS)
        output_path = os.path.join(output_dir, filename)
        
        # Save as ICO for favicon.ico, PNG for others
        if filename.endswith('.ico'):
            # Save as ICO format
            resized.save(output_path, 'ICO', sizes=[(size[0], size[1])])
        else:
            resized.save(output_path, 'PNG', optimize=True)
        print(f"  Created {output_path} ({size[0]}x{size[1]})")
    
    print("\nAll favicon files created successfully!")
    print("Files created in assets/ directory:")
    for filename in sizes.keys():
        print(f"  - {filename}")
        
except Exception as e:
    print(f"Error processing image: {e}")
    exit(1)

