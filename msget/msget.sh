#!/bin/bash

# Check if an extension list file is provided as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 [-k] <extensions.txt>"
  exit 1
fi

# Check for the -k flag
keep_files=false
if [ "$1" == "-k" ]; then
  keep_files=true
  shift # Shift the arguments to remove the flag
fi

extensions="$1"

# Check if the file exists
if [ ! -f "$extensions" ]; then
  echo "Error: Extension list file '$extensions' not found."
  exit 1
fi

# Create the msget directory if it doesn't exist
msget_dir="msget"
mkdir -p "$msget_dir"

# Create the vsix subdirectory if it doesn't exist
vsix_dir="$msget_dir/vsix"
mkdir -p "$vsix_dir"

# Read the extension IDs from the file line by line
while IFS= read -r line || [[ -n "$line" ]]; do
  # Split the line by '==' to separate extension ID and version (if any)
  extension_id=$(echo "$line" | awk -F'==' '{print $1}')
  version=$(echo "$line" | awk -F'==' '{print $2}')

  # If version is not specified, default to "latest"
  if [ -z "$version" ]; then
    version="latest"
  fi
  
  # Extract the publisher name and extension name from the ID
  publisher=$(echo "$extension_id" | cut -d'.' -f1)
  package=$(echo "$extension_id" | cut -d'.' -f2)

  # Construct the download URL using the version variable
  download_url="https://${publisher}.gallery.vsassets.io/_apis/public/gallery/publisher/${publisher}/extension/${package}/${version}/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage"

  # Construct the filename with the extension ID and version (if specified)
  vsix_filename="${extension_id}"
  if [ "$version" != "latest" ]; then
    vsix_filename="${vsix_filename}-${version}"
  fi
  vsix_filename="${vsix_filename}.vsix"
  vsix_filepath="$vsix_dir/$vsix_filename"

  # Download the VSIX file using the constructed URL, overwriting if it exists
  curl -L -o "$vsix_filepath" "$download_url"

  echo "Download process completed for $vsix_filepath"

  # Install the VSIX using the 'code' command
  code --install-extension "$vsix_filepath"

  echo "Installation process completed for $package extension"

  # Delete the .vsix file if -k is not specified
  if ! $keep_files; then
    rm "$vsix_filepath"
    echo "Deleted $vsix_filepath"
  fi
done < "$extensions"

# Delete the directories if -k is not specified
if ! $keep_files; then
  rmdir "$vsix_dir" "$msget_dir"
  echo "Deleted directories $vsix_dir and $msget_dir"
fi