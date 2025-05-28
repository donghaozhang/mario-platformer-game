import requests
import os
import zipfile
import shutil

# --- Configuration ---
ASSET_PACKS = [
    {
        "name": "SuperMangoPixelPack",
        "url": "https://juhosprite.itch.io/super-mango-2d-pixelart-platformer-asset-pack16x16",
        "download_page_type": "itch.io", # Helps determine how to find the download link
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
    \'\'\'Downloads a file from a direct URL.\'\'\'
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status() # Raise an exception for HTTP errors
        with open(destination_path, \'wb\') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"Successfully downloaded: {destination_path}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error downloading {url}: {e}")
        return False

def extract_zip(zip_path, extract_to_dir):
    \'\'\'Extracts a zip file.\'\'\'
    try:
        with zipfile.ZipFile(zip_path, \'r\') as zip_ref:
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
    \'\'\'
    Attempts to find a direct download link from an itch.io page.
    This is a simplified example and might need adjustments for different page layouts.
    Itch.io pages often use JavaScript to initiate downloads, which makes direct scraping hard.
    This function will look for direct .zip, .rar, .7z links.
    For itch.io, users usually need to click a download button, which might trigger an API call.
    A more robust solution would involve a browser automation tool like Selenium,
    or finding if the itch.io API can be used for this.
    
    For now, this will likely fail for most itch.io pages that don't have direct links.
    \'\'\'
    try:
        print(f"Attempting to find download link on: {page_url}")
        response = requests.get(page_url, headers={\'User-Agent\': \'Mozilla/5.0\'})
        response.raise_for_status()
        
        # Basic search for direct links (very simplified)
        # In a real scenario, you'd parse HTML with BeautifulSoup
        content = response.text.lower()
        import re
        
        # Look for links ending with common archive extensions
        # This is a very naive approach and might not work for dynamically generated links
        match = re.search(r\'href=[\'"]([^\'"]+\.(zip|rar|7z))[\'"]\', content)
        
        if match:
            download_url = match.group(1)
            # Ensure it's an absolute URL
            if not download_url.startswith(\'http\'):
                from urllib.parse import urljoin
                download_url = urljoin(page_url, download_url)
            print(f"Found potential direct link: {download_url}")
            return download_url
        else:
            print(f"Could not automatically find a direct download link on {page_url}.")
            print("Please visit the page and download the file manually.")
            print("Look for a \'Download Now\' button, then click \'No thanks, just take me to the downloads\', then the actual download link.")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"Error fetching page {page_url}: {e}")
        return None

def create_asset_folders():
    \'\'\'Creates the necessary subfolders in the main assets directory if they don\'t exist.\'\'\'
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
        full_path = os.path.join(ASSETS_TARGET_DIR, subfolder_path_suffix.replace(\'/\', os.sep))
        if not os.path.exists(full_path):
            os.makedirs(full_path)
            print(f"Created subfolder: {full_path}")
        
# --- Main Download Logic ---
def main():
    print("--- Starting Asset Downloader ---")

    # Create download and asset directories if they don\'t exist
    if not os.path.exists(DOWNLOAD_DIR):
        os.makedirs(DOWNLOAD_DIR)
    
    create_asset_folders()

    manual_downloads_needed = []

    for pack in ASSET_PACKS:
        print(f"\\nProcessing asset pack: {pack['name']}")
        pack_url = pack["url"]
        pack_dest_folder_name = pack["destination_folder"] # Subfolder within DOWNLOAD_DIR
        
        download_link = None
        
        if pack["download_page_type"] == "itch.io":
            print(f"This is an itch.io page. Note: Automatic download from itch.io is tricky.")
            print(f"Please visit {pack_url} and look for the download button.")
            print(f"Often, you need to click \'Download Now\', then possibly \'No thanks, just take me to the downloads\', then the actual file link (usually a .zip).")
            manual_downloads_needed.append({"name": pack["name"], "url": pack_url, "type": "itch.io"})
            # For now, we'll skip automatic download for itch.io and instruct user
            # download_link = find_itch_io_download_link(pack_url) 
            # The find_itch_io_download_link is very basic and likely to fail.
            # Itch.io usually requires interaction or uses JS to serve downloads.
            print(f"Skipping automatic download for {pack['name']} from itch.io due to complexity.")
            print("Please download it manually into the \'temp_downloads\' folder and name it appropriately (e.g., super_mango.zip).")
            continue # Skip to next pack for now
            
        elif pack["download_page_type"] == "direct": # If you have a direct link in the future
            download_link = pack_url 
        else:
            print(f"Unsupported download page type: {pack['download_page_type']} for {pack['name']}")
            continue

        if not download_link:
            print(f"Could not determine download link for {pack['name']}. Skipping.")
            manual_downloads_needed.append({"name": pack["name"], "url": pack_url})
            continue

        file_name = os.path.join(DOWNLOAD_DIR, download_link.split(\'/\')[-1])
        
        # Sanitize file name if it has query parameters
        if \'?\' in file_name:
            file_name = file_name.split(\'?\')[0]

        print(f"Attempting to download {pack['name']} from {download_link} to {file_name}")

        if download_file_from_url(download_link, file_name):
            # Assuming successful download, attempt to extract if it's a zip
            if file_name.endswith(\'.zip\'):
                extract_path = os.path.join(DOWNLOAD_DIR, pack_dest_folder_name)
                if not os.path.exists(extract_path):
                    os.makedirs(extract_path)
                
                if extract_zip(file_name, extract_path):
                    print(f"Successfully downloaded and extracted {pack['name']}.")
                    print(f"Assets are in: {extract_path}")
                    print(f"Please MANUALLY review the contents of {extract_path} and move the relevant images/sprites to the appropriate subfolders within \'{ASSETS_TARGET_DIR}\'.")
                    print(f"For example, player sprites go into \'{os.path.join(ASSETS_TARGET_DIR, 'sprites', 'player')}\'")
                else:
                    print(f"Failed to extract {file_name}. Please extract manually.")
            else:
                print(f"Downloaded {file_name}, but it\'s not a zip file. Please handle manually.")
        else:
            print(f"Failed to download {pack['name']}.")
            manual_downloads_needed.append({"name": pack["name"], "url": download_link, "type": "failed_download"})


    if manual_downloads_needed:
        print("\\n--- Manual Action Required ---")
        print("Some assets could not be downloaded or processed automatically:")
        for item in manual_downloads_needed:
            print(f"- Pack: {item['name']}")
            print(f"  URL: {item['url']}")
            if item.get(\'type\') == "itch.io":
                print(f"  Action: Please visit the itch.io page, download the .zip file, and place it in the \'{DOWNLOAD_DIR}\' folder.")
                print(f"            Then, you can try re-running the script or manually extract and place assets.")
            elif item.get(\'type\') == "failed_download":
                 print(f"  Action: Download failed. Please try downloading from the URL manually and place it in \'{DOWNLOAD_DIR}\'.")
            else:
                print(f"  Action: Please download manually and place in \'{DOWNLOAD_DIR}\'.")
        print("\\nOnce manual downloads are in \'temp_downloads\', you might need to:")
        print("1. Manually extract them if they are archives.")
        print(f"2. Manually copy the relevant image files from the extracted folders into the correct subdirectories within \'{ASSETS_TARGET_DIR}\'.")
        print(f"   (e.g., player sprites to \'{ASSETS_TARGET_DIR}/sprites/player/\', tiles to \'{ASSETS_TARGET_DIR}/tiles/\', etc.)")

    print("\\n--- Asset Downloader Finished ---")
    print(f"Please check the \'{DOWNLOAD_DIR}\' for downloaded files and extracted content.")
    print(f"Ensure all necessary assets are correctly placed into the subfolders of \'{ASSETS_TARGET_DIR}\' for the game to use them.")

if __name__ == "__main__":
    main() 