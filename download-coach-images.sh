#!/bin/bash
# Run this script from the "WORDPRESS SITE" folder to download all coach images.
# Usage: bash download-coach-images.sh

mkdir -p pictures/coaches

echo "Downloading coach images..."

curl -L -o "pictures/coaches/andrew-gillis.jpg"    "https://resiliencefitness.ca/wp-content/uploads/2025/07/Untitled-design-14.jpg"
curl -L -o "pictures/coaches/joshua-greenbaum.jpg" "https://resiliencefitness.ca/wp-content/uploads/2025/09/Untitled-design-26.jpg"
curl -L -o "pictures/coaches/cara-gillis.jpg"      "https://resiliencefitness.ca/wp-content/uploads/2025/07/Untitled-design-34.jpg"
curl -L -o "pictures/coaches/lanny-korbee.jpg"     "https://resiliencefitness.ca/wp-content/uploads/2025/09/Untitled-design-22.jpg"
curl -L -o "pictures/coaches/robbie-zicari.jpg"    "https://resiliencefitness.ca/wp-content/uploads/2025/09/Untitled-design-16.jpg"
curl -L -o "pictures/coaches/nikki-plante.jpg"     "https://resiliencefitness.ca/wp-content/uploads/2025/09/Untitled-design-28.jpg"
curl -L -o "pictures/coaches/meron-ogbae.jpg"      "https://resiliencefitness.ca/wp-content/uploads/2025/09/Untitled-design-27.jpg"
curl -L -o "pictures/coaches/shyla-davenport.jpg"  "https://resiliencefitness.ca/wp-content/uploads/2026/01/Untitled-design-15.jpg"
curl -L -o "pictures/coaches/jazz-lindsey.jpg"     "https://resiliencefitness.ca/wp-content/uploads/2025/09/Untitled-design-24.jpg"
curl -L -o "pictures/coaches/moe-elleithy.jpg"     "https://resiliencefitness.ca/wp-content/uploads/2025/09/Untitled-design-23.jpg"
curl -L -o "pictures/coaches/daniel-lee-hunte.jpg" "https://resiliencefitness.ca/wp-content/uploads/2025/07/Untitled-design-21.jpg"
curl -L -o "pictures/coaches/jada-singh.jpg"       "https://resiliencefitness.ca/wp-content/uploads/2026/01/Untitled-design-29.jpg"
curl -L -o "pictures/coaches/julia-listro.jpg"     "https://resiliencefitness.ca/wp-content/uploads/2026/01/Untitled-design-31.jpg"
curl -L -o "pictures/coaches/vlad-zamrii.png"      "https://resiliencefitness.ca/wp-content/uploads/2026/01/Untitled-design-53.png"

echo "Done! Check pictures/coaches/ to confirm all 14 images downloaded."
