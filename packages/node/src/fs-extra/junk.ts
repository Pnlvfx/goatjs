const ignoreList = [
  // # All
  String.raw`^npm-debug\.log$`, // Error log for npm
  String.raw`^\..*\.swp$`, // Swap file for vim state

  // # macOS
  String.raw`^\.DS_Store$`, // Stores custom folder attributes
  String.raw`^\.AppleDouble$`, // Stores additional file resources
  String.raw`^\.LSOverride$`, // Contains the absolute path to the app to be used
  String.raw`^Icon\r$`, // Custom Finder icon: http://superuser.com/questions/298785/icon-file-on-os-x-desktop
  String.raw`^\._.*`, // Thumbnail
  String.raw`^\.Spotlight-V100(?:$|\/)`, // Directory that might appear on external disk
  String.raw`\.Trashes`, // File that might appear on external disk
  '^__MACOSX$', // Resource fork

  // # Linux
  '~$', // Backup file

  // # Windows
  String.raw`^Thumbs\.db$`, // Image file cache
  String.raw`^ehthumbs\.db$`, // Folder config file
  String.raw`^[Dd]esktop\.ini$`, // Stores custom folder attributes
  '@eaDir$', // Synology Diskstation "hidden" folder where the server stores thumbnails
];

export const junkRegex = new RegExp(ignoreList.join('|'));

export function isJunk(filename: string) {
  return junkRegex.test(filename);
}
