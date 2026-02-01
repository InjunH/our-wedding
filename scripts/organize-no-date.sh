#!/bin/bash

NO_DATE_DIR="/Users/hwang-injun/Downloads/누리인준-정리됨/_no_date"
OUTPUT_DIR="/Users/hwang-injun/Downloads/누리인준-정리됨"

echo "📁 파일명에서 날짜 추출 시작..."
echo ""

moved=0
remain=0

for file in "$NO_DATE_DIR"/*; do
    [ -f "$file" ] || continue
    filename=$(basename "$file")

    # Wuta_YYYYMMDD_HHMMSS 패턴
    if [[ $filename =~ Wuta_([0-9]{4})([0-9]{2})([0-9]{2})_ ]]; then
        year="${BASH_REMATCH[1]}"
        month="${BASH_REMATCH[2]}"
        year_month="${year}-${month}"

        if [ "$year" -ge 2020 ] && [ "$year" -le 2030 ]; then
            mkdir -p "$OUTPUT_DIR/$year_month"
            mv "$file" "$OUTPUT_DIR/$year_month/$filename"
            echo "✓ $filename -> $year_month/"
            moved=$((moved + 1))
            continue
        fi
    fi

    # YYYYMMDD_HHMMSS 패턴 (숫자로 시작)
    if [[ $filename =~ ^([0-9]{4})([0-9]{2})([0-9]{2})_ ]]; then
        year="${BASH_REMATCH[1]}"
        month="${BASH_REMATCH[2]}"
        year_month="${year}-${month}"

        if [ "$year" -ge 2020 ] && [ "$year" -le 2030 ]; then
            mkdir -p "$OUTPUT_DIR/$year_month"
            mv "$file" "$OUTPUT_DIR/$year_month/$filename"
            echo "✓ $filename -> $year_month/"
            moved=$((moved + 1))
            continue
        fi
    fi

    echo "✗ $filename (날짜 추출 불가)"
    remain=$((remain + 1))
done

echo ""
echo "================================"
echo "📊 완료!"
echo "  이동됨: $moved개"
echo "  남음: $remain개"
echo "================================"

# 남은 파일 수 확인
remaining=$(ls -1 "$NO_DATE_DIR" 2>/dev/null | wc -l | tr -d ' ')
echo ""
echo "📂 _no_date에 남은 파일: ${remaining}개"
