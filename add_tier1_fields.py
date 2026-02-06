"""
Correct and complete script to add Tier 1 data fields to salaryData.js
This script properly handles the role structure without corruption.
"""
import re
import random
import json

random.seed(42)

def get_time_to_fill(scarcity):
    """Get random timeToFill weeks based on scarcity level"""
    scarcity = float(scarcity)
    ranges = [
        (3.5, (4, 6)),
        (4.5, (5, 8)),
        (5.5, (7, 10)),
        (6.5, (9, 13)),
        (7.5, (12, 16)),
        (8.5, (16, 22)),
        (10, (20, 28))
    ]
    for threshold, (min_val, max_val) in ranges:
        if scarcity <= threshold:
            return random.randint(min_val, max_val)
    return random.randint(20, 28)

def get_candidate_pool(scarcity):
    """Get candidatePoolSize string based on scarcity"""
    scarcity = float(scarcity)
    pools = [
        (3.5, "2,000-4,000"),
        (4.5, "800-1,500"),
        (5.5, "400-800"),
        (6.5, "200-400"),
        (7.5, "100-200"),
        (8.5, "40-100"),
        (10, "15-40")
    ]
    for threshold, pool in pools:
        if scarcity <= threshold:
            return pool
    return "15-40"

def get_turnover(scarcity, category, trends):
    """Get turnover data (avgTenure, annualTurnover) based on role characteristics"""
    scarcity = float(scarcity)
    is_maritime = any(w in category.lower() for w in ["yacht", "maritime", "crew", "superyacht", "captain", "deckhand"])
    is_csuite = "C-Suite" in category
    
    if is_maritime:
        tenure = round(random.uniform(1.5, 3.0), 1)
        turnover = round(random.uniform(0.20, 0.35), 2)
    elif is_csuite:
        tenure = round(random.uniform(5.0, 8.0), 1)
        turnover = round(random.uniform(0.06, 0.12), 2)
    elif scarcity <= 5.5:
        tenure = round(random.uniform(1.5, 2.5), 1)
        turnover = round(random.uniform(0.25, 0.35), 2)
    elif scarcity <= 6.5:
        tenure = round(random.uniform(2.5, 4.0), 1)
        turnover = round(random.uniform(0.15, 0.25), 2)
    elif scarcity <= 8.5:
        tenure = round(random.uniform(3.5, 5.5), 1)
        turnover = round(random.uniform(0.10, 0.18), 2)
    else:
        tenure = round(random.uniform(4.5, 7.0), 1)
        turnover = round(random.uniform(0.08, 0.15), 2)
    
    return (tenure, turnover)

def get_demand_trend(trends):
    """Get demand trend direction and yoyChange based on trends text"""
    trends_lower = trends.lower()
    
    growth_words = ["up", "growing", "increasing", "demand", "rising", "surge", "competitive", "strong demand", "up roughly"]
    stable_words = ["stable", "steady", "unchanged", "consistent", "flat"]
    decline_words = ["declining", "reducing", "decreased", "down", "falling", "weakness"]
    
    has_decline = any(w in trends_lower for w in decline_words)
    has_stable = any(w in trends_lower for w in stable_words)
    has_growth = any(w in trends_lower for w in growth_words)
    
    if has_decline:
        direction = "declining"
        yoy_change = round(random.uniform(-0.15, -0.05), 2)
    elif has_stable:
        direction = "stable"
        yoy_change = round(random.uniform(-0.02, 0.03), 2)
    elif has_growth:
        direction = "growing"
        yoy_change = round(random.uniform(0.05, 0.25), 2)
    else:
        direction = "stable"
        yoy_change = round(random.uniform(-0.02, 0.03), 2)
    
    return (direction, yoy_change)

def process_file(file_path):
    """Main function to process salaryData.js and add Tier 1 fields"""
    
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find BENCHMARKS declaration
    benchmarks_match = re.search(r'export const BENCHMARKS = \{', content)
    if not benchmarks_match:
        print("ERROR: Could not find BENCHMARKS declaration")
        return False
    
    # Split content into before and after BENCHMARKS
    before_benchmarks = content[:benchmarks_match.end() + 1]
    after_benchmarks_start = benchmarks_match.end() + 1
    
    # Find all role definitions using regex
    # Pattern: "RoleName": { ... closing brace ...
    role_pattern = r'"([^"]+)":\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}'
    
    result = before_benchmarks + '\n'
    current_pos = after_benchmarks_start
    role_count = 0
    
    # Process each role match
    for match in re.finditer(role_pattern, content[after_benchmarks_start:], re.DOTALL):
        role_name = match.group(1)
        role_content = match.group(2)
        
        # Extract metadata from role content
        scarcity_m = re.search(r'scarcity:\s*([\d.]+)', role_content)
        category_m = re.search(r'category:\s*"([^"]+)"', role_content)
        trends_m = re.search(r'trends:\s*"([^"]*)"', role_content)
        
        if scarcity_m and category_m and trends_m:
            scarcity = scarcity_m.group(1)
            category = category_m.group(1)
            trends = trends_m.group(1)
            
            # Generate Tier 1 data
            ttf = get_time_to_fill(scarcity)
            pool = get_candidate_pool(scarcity)
            tenure, turnover_rate = get_turnover(scarcity, category, trends)
            direction, yoy = get_demand_trend(trends)
            
            # Reconstruct role with new fields
            # Remove closing brace from role_content
            role_content_clean = role_content.rstrip()
            if role_content_clean.endswith('}'):
                role_content_clean = role_content_clean[:-1]
            
            # Ensure last field has comma if it doesn't
            if not role_content_clean.rstrip().endswith(','):
                role_content_clean = role_content_clean.rstrip() + ','
            
            # Build the updated role
            result += f'  "{role_name}": {{\n'
            result += role_content_clean + '\n'
            result += f'    timeToFill: {ttf},\n'
            result += f'    candidatePoolSize: "{pool}",\n'
            result += f'    turnover: {{ avgTenure: {tenure}, annualTurnover: {turnover_rate} }},\n'
            result += f'    demandTrend: {{ direction: "{direction}", yoyChange: {yoy} }}\n'
            result += '  },\n'
            
            role_count += 1
        else:
            # If we can't extract metadata, keep original (shouldn't happen if file is well-formed)
            result += f'  "{role_name}": {{{role_content}}},\n'
            role_count += 1
    
    # Add closing brace for BENCHMARKS
    result += '};\n'
    
    # Add any remaining content after BENCHMARKS
    benchmarks_end = content.rfind('};', after_benchmarks_start)
    if benchmarks_end != -1:
        result += content[benchmarks_end + 2:]
    
    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(result)
    
    print(f"SUCCESS: Added Tier 1 fields to {role_count} roles")
    return True

if __name__ == "__main__":
    file_path = "/sessions/nice-ecstatic-hawking/search-calculator/src/salaryData.js"
    process_file(file_path)
