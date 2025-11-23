import random
import os

def generate_shadows(n):
    shadows = []
    for _ in range(n):
        x = random.randint(0, 2000)
        y = random.randint(0, 2000)
        shadows.append(f"{x}px {y}px #FFF")
    return ", ".join(shadows)

css_content = f"""
.starContainer {{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    z-index: -1;
    pointer-events: none;
    overflow: hidden;
}}

.stars {{
    width: 1px;
    height: 1px;
    background: transparent;
    box-shadow: {generate_shadows(700)};
    animation: animStar 50s linear infinite;
}}

.stars:after {{
    content: " ";
    position: absolute;
    top: 2000px;
    width: 1px;
    height: 1px;
    background: transparent;
    box-shadow: {generate_shadows(700)};
}}

.stars2 {{
    width: 2px;
    height: 2px;
    background: transparent;
    box-shadow: {generate_shadows(200)};
    animation: animStar 100s linear infinite;
}}

.stars2:after {{
    content: " ";
    position: absolute;
    top: 2000px;
    width: 2px;
    height: 2px;
    background: transparent;
    box-shadow: {generate_shadows(200)};
}}

.stars3 {{
    width: 3px;
    height: 3px;
    background: transparent;
    box-shadow: {generate_shadows(100)};
    animation: animStar 150s linear infinite;
}}

.stars3:after {{
    content: " ";
    position: absolute;
    top: 2000px;
    width: 3px;
    height: 3px;
    background: transparent;
    box-shadow: {generate_shadows(100)};
}}

@keyframes animStar {{
    from {{
        transform: translateY(0px);
    }}
    to {{
        transform: translateY(-2000px);
    }}
}}
"""

# Ensure directory exists
os.makedirs('src/styles/components', exist_ok=True)

with open('src/styles/components/StarBackground.module.css', 'w') as f:
    f.write(css_content)
