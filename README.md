# 🌌 Varun Sivanesan - Portfolio

![Portfolio Banner](https://socialify.git.ci/ilvoirr/portfolio/image?description=1&descriptionEditable=Full%20Stack%20Software%20Engineering%20Developer&font=Inter&language=1&name=1&owner=1&pattern=Circuit%20Board&theme=Dark)

> A highly interactive, cosmic-themed personal portfolio and digital garden built with Next.js, Framer Motion, and Tailwind CSS.

## 🚀 Overview

This portfolio serves as a central hub for my **Projects** (prototypes & hackathons), **Notes** (PDF library for C/C++/ML), and personal lore. It features a **cosmic/space theme** with shooting stars, dynamic backgrounds, and fluid animations.

The architecture is split into distinct **Desktop** and **Mobile** experiences to ensure optimized performance and layout for every device.

## ✨ Key Features

* **🎭 "Curtain" Transitions:** A custom-engineered routing system. Navigating between major sections (Projects ↔ Notes) triggers a rapid **0.1s white curtain wipe**, providing a snappy, native-app feel.
* **🌌 Atmospheric UI:** Canvas-based Shooting Stars, Star Backgrounds, and Glassmorphism effects.
* **🍎 Floating Dock:** macOS-inspired interactive navigation that scales on hover.
* **📱 "Liquid Glass" Mobile Menu:** A custom mobile drawer with a notch-style trigger.
* **📚 Digital Notes Library:** Integrated PDF viewer for reading handwritten engineering notes directly in the browser.
* **🎮 Personal Touch:** Dedicated sections for League of Legends lore and personal statistics.

## 🛠️ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)

## 📸 Gallery

### 🖥️ Desktop Experience
| **Home Dashboard** | **Project Showcase** |
|:---:|:---:|
| ![Home Desktop](./public/home-desktop.png) | ![Projects Page](./public/projects.png) |

### 📱 Mobile & Details
| **Mobile View** | **Notes Library** |
|:---:|:---:|
| <img src="./public/mobile.png" width="300" /> | ![Notes Page](./public/notes.png) |

### 🎨 UI Details
| **Glassmorphism Navigation** |
|:---:|
| ![Glass Bar](./public/glassbar.png) |

## 📂 Project Structure

Based on the actual architecture of the repository:

```bash
├── app/
│   ├── notes/
│   │   └── page.tsx          # Notes Library & PDF Viewer
│   ├── portfolio/
│   │   └── page.tsx          # Alternate/Draft Portfolio view
│   ├── projects/
│   │   └── page.tsx          # Projects Showcase Grid
│   ├── reference/
│   │   └── page.tsx          # Reference/Test components
│   ├── desktop.tsx           # Main Desktop Layout & Logic
│   ├── mobileview.tsx        # Dedicated Mobile Layout & Menu
│   ├── layout.tsx            # Root Layout
│   ├── page.tsx              # Smart Switcher (Detects device width)
│   └── globals.css           # Tailwind & Global Styles
├── components/               # Shared UI Components (Cards, Buttons)
├── data/                     # Static data files
├── lib/                      # Utility functions (cn, merge)
├── public/                   # Static Assets
│   ├── aphe.jpg
│   ├── home-desktop.png
│   ├── mobile.png
│   ├── notes.png
│   ├── projects.png
│   ├── resume.pdf
│   └── ... (PDFs & Images)
└── ...