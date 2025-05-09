import xml.etree.ElementTree as ET
import pandas as pd

def extract_features_from_svg(file_path):
    try:
        # Открываем и читаем SVG-файл. Если это не XML, сразу возвращаем None
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read().strip()
            if not content.startswith('<'):
                return None
            root = ET.fromstring(content)
    except Exception:
        # Если файл не читается как XML — возвращаем None
        return None

    # Инициализация всех признаков, которые мы будем извлекать из SVG
    num_paths = 0
    num_groups = 0
    num_fills = 0
    num_strokes = 0
    stroke_widths = []
    has_text = 0
    max_depth = 0
    total_path_length_estimate = 0

    # Рекурсивный обход SVG-дерева
    def traverse(element, depth=0):
        nonlocal num_paths, num_groups, num_fills, num_strokes
        nonlocal stroke_widths, has_text, max_depth, total_path_length_estimate

        max_depth = max(max_depth, depth)
        tag = element.tag.lower()

        # Считаем количество <path>, <g>, <text> и оцениваем длину пути по длине атрибута "d"
        if 'path' in tag:
            num_paths += 1
            d = element.attrib.get('d', '')
            total_path_length_estimate += len(d)
        if 'g' in tag:
            num_groups += 1
        if 'text' in tag:
            has_text = 1

        # Анализируем стили: заливка, обводка, толщина обводки
        style = element.attrib.get('style', '')
        fill = element.attrib.get('fill', '')
        stroke = element.attrib.get('stroke', '')
        stroke_width = element.attrib.get('stroke-width', '')

        if 'fill:' in style or fill not in ['', 'none']:
            num_fills += 1
        if 'stroke:' in style or stroke not in ['', 'none']:
            num_strokes += 1

        # Пытаемся извлечь числовое значение толщины обводки
        if 'stroke-width:' in style:
            try:
                value = style.split('stroke-width:')[1].split(';')[0]
                stroke_widths.append(float(value))
            except:
                pass
        elif stroke_width:
            try:
                stroke_widths.append(float(stroke_width))
            except:
                pass

        # Обход всех вложенных элементов
        for child in element:
            traverse(child, depth + 1)

    traverse(root)

    # Вычисляем среднюю толщину обводки (если есть)
    avg_stroke_width = sum(stroke_widths) / len(stroke_widths) if stroke_widths else 0

    # Собираем все признаки в словарь
    return {
        "num_paths": num_paths,
        "num_groups": num_groups,
        "num_fills": num_fills,
        "num_strokes": num_strokes,
        "avg_stroke_width": avg_stroke_width,
        "has_text": has_text,
        "max_depth": max_depth,
        "total_path_length_estimate": total_path_length_estimate
    }
