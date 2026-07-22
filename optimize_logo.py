from PIL import Image
import os

# Paths
input_path = r'images\Publicaciones\POGO\Pogo 60.jpg.jpeg'

output_path = r'images\Publicaciones\POGO\Pogo 60.jpg.jpeg'

# Open the image
img = Image.open(input_path)

print(f"Original size: {img.size}")
print(f"Original mode: {img.mode}")

# Target size for card background (3:2 aspect ratio)
target_size = (600, 400)

# Calculate the aspect ratio
original_ratio = img.width / img.height
target_ratio = target_size[0] / target_size[1]

# Create a new image with white background
new_img = Image.new('RGB', target_size, (255, 255, 255))

# Calculate scaling to fit the logo centered
if original_ratio > target_ratio:
    # Logo is wider - fit to width with padding on top/bottom
    new_width = target_size[0]
    new_height = int(new_width / original_ratio)
else:
    # Logo is taller - fit to height with padding on sides
    new_height = target_size[1]
    new_width = int(new_height * original_ratio)

# Resize the logo
img_resized = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

# Convert to RGB if it has transparency
if img_resized.mode in ('RGBA', 'LA', 'P'):
    # Create a white background
    background = Image.new('RGB', img_resized.size, (255, 255, 255))
    if img_resized.mode == 'P':
        img_resized = img_resized.convert('RGBA')
    background.paste(img_resized, mask=img_resized.split()[-1] if img_resized.mode == 'RGBA' else None)
    img_resized = background

# Center the logo on the canvas
x_offset = (target_size[0] - new_width) // 2
y_offset = (target_size[1] - new_height) // 2
new_img.paste(img_resized, (x_offset, y_offset))

# Save optimized version
new_img.save(output_path, 'PNG', optimize=True, quality=85)

print(f"Optimized size: {new_img.size}")
print(f"Saved to: {output_path}")

# Get file sizes
original_size = os.path.getsize(input_path) / 1024  # KB
optimized_size = os.path.getsize(output_path) / 1024  # KB

print(f"\nOriginal file size: {original_size:.2f} KB")
print(f"Optimized file size: {optimized_size:.2f} KB")
print(f"Size reduction: {((original_size - optimized_size) / original_size * 100):.1f}%")
