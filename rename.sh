#!/bin/bash

FRONTEND="/home/worldwide/Documents/nesto_frontend/nesto/src"

echo "🔄 Kubadilisha NESTO → LOKESTA kwenye files zote..."

# Replace in all TSX and TS files
find "$FRONTEND" -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) | while read file; do
  sed -i 's/NESTO/LOKESTA/g' "$file"
  sed -i 's/nesto/lokesta/g' "$file"
  echo "✅ $file"
done

echo ""
echo "🎉 Imekamilika! NESTO imebadilishwa na LOKESTA"
