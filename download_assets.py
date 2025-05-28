import requests
import os
import zipfile
import shutil

# --- Configuration ---
ASSET_PACKS = [
    {
        "name": "SuperMangoPixelPack",
        "url": "https://juhosprite.itch.io/super-mango-2d-pixelart-platformer-asset-pack16x16",
        "download_page_type": "itch.io", 
        "destination_folder": "super_mango_pack"
    },
    {
        "name": "BlockLandPack",
        "url": "https://v3x3d.itch.io/block-land",
        "download_page_type": "itch.io",
        "destination_folder": "block_land_pack"
    }
    # Add more asset packs here if needed
]

DOWNLOAD_DIR = "temp_downloads"
ASSETS_TARGET_DIR = "assets" # This is your main assets folder for the game

# --- Helper Functions ---

def download_file_from_url(url, destination_path):
    """Downloads a file from a direct URL."""
    try:
        response = requests.get(url, stream=True, timeout=10)
        response.raise_for_status()
        with open(destination_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Successfully downloaded: {destination_path}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error downloading {url}: {e}")
        return False

def extract_zip(zip_path, extract_to_dir):
    """Extracts a zip file."""
    try:
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_to_dir)
        print(f"Successfully extracted: {zip_path} to {extract_to_dir}")
        return True
    except zipfile.BadZipFile:
        print(f"Error: Invalid or corrupted zip file: {zip_path}")
        return False
    except Exception as e:
        print(f"Error extracting {zip_path}: {e}")
        return False

def find_itch_io_download_link(page_url):
    """
    Placeholder for attempting to find a direct download link from an itch.io page.
    Currently, this function will always return None and print instructions, as
    reliable automatic download from itch.io is complex.
    """
    print(f"Attempting to find download link on: {page_url} (Automatic parsing is disabled for itch.io)")
    print("Could not automatically find a direct download link for itch.io page.")
    print("Please visit the page and download the file manually.")
    print("Look for a 'Download Now' button, then click 'No thanks, just take me to the downloads', then the actual download link.")
    return None

def create_asset_folders():
    """Creates the necessary subfolders in the main assets directory if they don't exist."""
    subfolders = [
        "sprites/player",
        "sprites/enemies",
        "sprites/items",
        "tiles",
        "backgrounds",
        "ui"
    ]
    if not os.path.exists(ASSETS_TARGET_DIR):
        os.makedirs(ASSETS_TARGET_DIR)
        print(f"Created main assets directory: {ASSETS_TARGET_DIR}")

    for subfolder_path_suffix in subfolders:
        full_path = os.path.join(ASSETS_TARGET_DIR, subfolder_path_suffix.replace('/', os.sep))
        if not os.path.exists(full_path):
            os.makedirs(full_path)
            print(f"Created subfolder: {full_path}")
        
# --- Main Download Logic ---
def main():
    print("--- Starting Asset Downloader ---")

    if not os.path.exists(DOWNLOAD_DIR):
        os.makedirs(DOWNLOAD_DIR)
    
    create_asset_folders()

    manual_downloads_needed = []

    for pack in ASSET_PACKS:
        print(f"\nProcessing asset pack: {pack['name']}")
        pack_url = pack["url"]
        pack_dest_folder_name = pack["destination_folder"]
        
        download_link = None
        
        if pack["download_page_type"] == "itch.io":
            find_itch_io_download_link(pack_url) # This will print instructions
            manual_downloads_needed.append({"name": pack["name"], "url": pack_url, "type": "itch.io"})
            print(f"Skipping automatic download for {pack['name']} from itch.io.")
            print("Please download it manually into the 'temp_downloads' folder (e.g., super_mango.zip).")
            continue
            
        elif pack["download_page_type"] == "direct":
            download_link = pack_url 
        else:
            print(f"Unsupported download page type: {pack['download_page_type']} for {pack['name']}")
            continue

        if not download_link:
            # This case should ideally not be hit if page_type is handled correctly
            print(f"Could not determine download link for {pack['name']}. Added to manual list.")
            manual_downloads_needed.append({"name": pack["name"], "url": pack_url, "type": "unknown"})
            continue

        # Construct file name from URL
        file_name_from_url = download_link.split('/')[-1]
        if '?' in file_name_from_url: # Remove query parameters for cleaner names
            file_name_from_url = file_name_from_url.split('?')[0]
        
        # Ensure file_name_from_url is not empty if URL ends with /
        if not file_name_from_url and pack.get("expected_filename"):
            file_name_from_url = pack["expected_filename"]
        elif not file_name_from_url:
            print(f"Could not determine filename for {pack['name']} from URL: {download_link}. Skipping.")
            manual_downloads_needed.append({"name": pack["name"], "url": download_link, "type": "no_filename"})
            continue
            
        local_file_path = os.path.join(DOWNLOAD_DIR, file_name_from_url)

        print(f"Attempting to download {pack['name']} from {download_link} to {local_file_path}")

        if download_file_from_url(download_link, local_file_path):
            if local_file_path.endswith('.zip'):
                extract_path = os.path.join(DOWNLOAD_DIR, pack_dest_folder_name)
                if not os.path.exists(extract_path):
                    os.makedirs(extract_path)
                
                if extract_zip(local_file_path, extract_path):
                    print(f"Successfully downloaded and extracted {pack['name']}.")
                    print(f"Assets are in: {extract_path}")
                    print(f"Please MANUALLY review {extract_path} and move relevant files to '{ASSETS_TARGET_DIR}' subfolders.")
                else:
                    print(f"Failed to extract {local_file_path}. Please extract manually.")
            else:
                print(f"Downloaded {local_file_path}, but it is not a zip file. Please handle manually.")
        else:
            print(f"Failed to download {pack['name']}.")
            manual_downloads_needed.append({"name": pack["name"], "url": download_link, "type": "failed_download"})

    if manual_downloads_needed:
        print("\n--- Manual Action Required ---")
        print("Some assets need manual attention:")
        for item in manual_downloads_needed:
            print(f"- Pack: {item['name']} (URL: {item['url']})")
            if item.get('type') == "itch.io":
                print(f"  Action: Download the .zip from itch.io and place in '{DOWNLOAD_DIR}'.")
            elif item.get('type') == "failed_download":
                 print(f"  Action: Download failed. Try URL manually, place in '{DOWNLOAD_DIR}'.")
            elif item.get('type') == "no_filename":
                 print(f"  Action: Could not get filename from URL. Download manually, place in '{DOWNLOAD_DIR}'.")
            else:
                print(f"  Action: Download manually, place in '{DOWNLOAD_DIR}'.")
        print("\nThen: 1. Manually extract archives. 2. Copy images to relevant '{ASSETS_TARGET_DIR}' subfolders.")

    print("\n--- Asset Downloader Finished ---")
    print(f"Check '{DOWNLOAD_DIR}' for downloads. Ensure assets are in '{ASSETS_TARGET_DIR}' for the game.")

if __name__ == "__main__":
    main() 