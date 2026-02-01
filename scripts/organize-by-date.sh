#!/bin/bash

SOURCE_DIR="/Users/hwang-injun/Downloads/누리 인준 히스토리"
OUTPUT_DIR="/Users/hwang-injun/Downloads/누리인준-정리됨"

# 출력 폴더 생성
mkdir -p "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR/_no_date"

echo "📁 이미지 EXIF 날짜 분석 및 분류 시작..."
echo "소스: $SOURCE_DIR"
echo "출력: $OUTPUT_DIR"
echo ""

# 카운터
total=0
with_date=0
no_date=0

# 모든 이미지 파일 처리
find "$SOURCE_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.heic" \) | while read file; do
    filename=$(basename "$file")
    total=$((total + 1))

    # EXIF DateTimeOriginal 추출
    date_taken=$(exiftool -DateTimeOriginal -s3 "$file" 2>/dev/null)

    # DateTimeOriginal이 없으면 CreateDate 시도
    if [ -z "$date_taken" ]; then
        date_taken=$(exiftool -CreateDate -s3 "$file" 2>/dev/null)
    fi

    if [ -n "$date_taken" ]; then
        # 날짜 형식: "2024:04:06 19:47:33" -> "2024-04"
        year_month=$(echo "$date_taken" | sed 's/^\([0-9]\{4\}\):\([0-9]\{2\}\).*/\1-\2/')

        # 유효한 날짜인지 확인 (2020년 이후)
        year=$(echo "$year_month" | cut -d'-' -f1)
        if [ "$year" -ge 2020 ] && [ "$year" -le 2030 ]; then
            mkdir -p "$OUTPUT_DIR/$year_month"
            cp "$file" "$OUTPUT_DIR/$year_month/$filename"
            echo "✓ $filename -> $year_month/"
            with_date=$((with_date + 1))
        else
            cp "$file" "$OUTPUT_DIR/_no_date/$filename"
            echo "✗ $filename -> _no_date/ (invalid year: $year)"
            no_date=$((no_date + 1))
        fi
    else
        cp "$file" "$OUTPUT_DIR/_no_date/$filename"
        echo "✗ $filename -> _no_date/ (no EXIF date)"
        no_date=$((no_date + 1))
    fi
done

echo ""
echo "================================"
echo "📊 분류 완료!"
echo "================================"

# 결과 통계
echo ""
echo "📂 폴더별 이미지 수:"
for dir in "$OUTPUT_DIR"/*/; do
    if [ -d "$dir" ]; then
        count=$(find "$dir" -type f | wc -l | tr -d ' ')
        dirname=$(basename "$dir")
        echo "  $dirname: $count개"
    fi
done
