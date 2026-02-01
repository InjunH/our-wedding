#!/bin/bash

# 정리된 폴더에서 S3 업로드 (썸네일 + 원본)

SOURCE_DIR="/Users/hwang-injun/Downloads/누리인준-정리됨"
BUCKET="nuri-injun-wedding-card"
THUMB_WIDTH=300
FULL_WIDTH=1920
TEMP_DIR="/tmp/wedding-upload-temp"

# AWS 자격 증명 (.env에서 로드)
source "$(dirname "$0")/../.env" 2>/dev/null || true
export AWS_ACCESS_KEY_ID="${VITE_AWS_ACCESS_KEY_ID}"
export AWS_SECRET_ACCESS_KEY="${VITE_AWS_SECRET_ACCESS_KEY}"
export AWS_DEFAULT_REGION="${VITE_AWS_REGION:-ap-northeast-2}"

# 임시 폴더 생성
mkdir -p "$TEMP_DIR"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         S3 업로드 (썸네일 + 원본)                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "소스: $SOURCE_DIR"
echo "버킷: $BUCKET"
echo ""

# 업로드할 폴더 목록 (2023-04 ~ 2026-01, _no_date 제외)
folders=$(find "$SOURCE_DIR" -maxdepth 1 -type d -name "202*" | sort)

total_files=0
for folder in $folders; do
    count=$(find "$folder" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.heic" \) 2>/dev/null | wc -l | tr -d ' ')
    total_files=$((total_files + count))
    period=$(basename "$folder")
    echo "  $period: ${count}개"
done

echo ""
echo "📷 총 이미지: ${total_files}개"
echo ""

success=0
fail=0
current=0

for folder in $folders; do
    period=$(basename "$folder")
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📁 $period 업로드 중..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    find "$folder" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.heic" \) 2>/dev/null | while read file; do
        current=$((current + 1))
        filename=$(basename "$file")
        baseName="${filename%.*}"
        outputName="${baseName}.jpg"

        printf "  %s... " "${filename:0:30}"

        # 썸네일 생성
        thumbPath="$TEMP_DIR/thumb_${outputName}"
        if ! magick "$file" -resize "${THUMB_WIDTH}x>" -quality 85 "$thumbPath" 2>/dev/null; then
            echo "✗ resize"
            fail=$((fail + 1))
            continue
        fi

        # 원본 리사이즈
        fullPath="$TEMP_DIR/${outputName}"
        if ! magick "$file" -resize "${FULL_WIDTH}x>" -quality 85 "$fullPath" 2>/dev/null; then
            echo "✗ resize"
            rm -f "$thumbPath"
            fail=$((fail + 1))
            continue
        fi

        # S3 업로드
        thumbKey="history/${period}/thumb/${outputName}"
        fullKey="history/${period}/${outputName}"

        if aws s3 cp "$thumbPath" "s3://${BUCKET}/${thumbKey}" --quiet && \
           aws s3 cp "$fullPath" "s3://${BUCKET}/${fullKey}" --quiet; then
            echo "✓"
            success=$((success + 1))
        else
            echo "✗ upload"
            fail=$((fail + 1))
        fi

        # 임시 파일 삭제
        rm -f "$thumbPath" "$fullPath"
    done
done

# 정리
rm -rf "$TEMP_DIR"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                     업로드 완료                              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
