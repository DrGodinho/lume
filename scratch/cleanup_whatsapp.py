import os
import re

def cleanup_whatsapp(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                    
                    # Remove the component call and the import
                    new_lines = []
                    removed_import = False
                    removed_call = False
                    
                    for line in lines:
                        if '<WhatsAppButton />' in line:
                            removed_call = True
                            continue
                        if 'import { WhatsAppButton }' in line:
                            removed_import = True
                            continue
                        new_lines.append(line)
                    
                    if removed_call or removed_import:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.writelines(new_lines)
                        print(f"Cleaned: {file_path}")
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    cleanup_whatsapp('src/views')
