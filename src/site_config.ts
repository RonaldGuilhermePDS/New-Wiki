// This file contains the site configuration for the theme.

// Metadata, SEO, and Social
export const SITE_TITLE = "CachyOS - Wiki"
export const SITE_DESCRIPTION = "A Wiki for CachyOS"
export const SITE_URL = "https://cachyos.org/"
export const SITE_DEFAULT_OG_IMAGE = ""

// Docs Sidebar
// Define the left sidebar items here.
// The path should match the folder name in src/content/docs/
export const SIDEBAR_ITEMS = {
  "Introduction to CachyOS": [
    "/docs/home",
    "/docs/features",
    "/docs/install-cachyos",
    "/docs/cachyos-performance",
    "/docs/screenshots",
    "/docs/cachyos-kernels",
    "/docs/kernel-manager",
    "/docs/notebooks",
    "/docs/repo",
  ],
  "First Steps": [
    "/docs/first-steps",
  ],
  "General Information": [
    "/docs/general-system-tweaks",
    "/docs/gaming",
    "/docs/faq",
  ],
  "Download": [
    "/docs/download",
    "https://sourceforge.net/projects/cachyos-arch/files/",
  ],
  "Changelog": [
    "/docs/changelog",
  ],
  "Be Connected": [
  ],
}
