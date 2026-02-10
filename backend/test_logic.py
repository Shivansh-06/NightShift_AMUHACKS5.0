from logic.evaluator import calculate_score, get_skill_level
from logic.roadmap import generate_roadmap

# -----------------------------
# Simulated assessment results
# -----------------------------

# Imagine the student answered:
# Statistics: 0/1 correct
# Python: 1/1 correct
# SQL: 1/1 correct

raw_results = {
    "Statistics": {"correct": 0, "total": 1},
    "Python": {"correct": 1, "total": 1},
    "SQL": {"correct": 1, "total": 1}
}

# -----------------------------
# Generate Skill DNA
# -----------------------------

skill_dna = {}

for skill, result in raw_results.items():
    score = calculate_score(result["correct"], result["total"])
    level = get_skill_level(score)
    skill_dna[skill] = level

print("Skill DNA:")
for skill, level in skill_dna.items():
    print(f" - {skill}: {level}")

# -----------------------------
# Generate Roadmap
# -----------------------------

roadmap, avoid = generate_roadmap(skill_dna)

print("\nRoadmap (Learn First):")
for skill in roadmap:
    print(f" - {skill}")

print("\nAvoid For Now:")
for skill in avoid:
    print(f" - {skill}")
