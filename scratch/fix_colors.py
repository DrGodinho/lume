import os
import re

# Define the mapping (Old -> New)
# We use a dictionary and a regex to avoid sequential replacement issues
mapping = {
    '#0d1f3c': '#0a1628',
    '#0a1628': '#070f1a',
    '#070f1a': '#04080f'
}

pattern = re.compile('|'.join(re.escape(k) for k in mapping.keys()))

def replace_colors(text):
    return pattern.sub(lambda m: mapping[m.group(0)], text)

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.tsx', '.css')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = replace_colors(content)
                    
                    if content != new_content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Updated: {file_path}")
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    process_directory('src')
