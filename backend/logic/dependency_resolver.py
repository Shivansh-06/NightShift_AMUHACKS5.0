from collections import deque


def expand_dependency_closure(skills_data, required_skills):
    """
    Recursively collect all prerequisites for required skills.
    Returns a set of all skills involved.
    """
    closure = set()

    def dfs(skill):
        if skill in closure:
            return
        closure.add(skill)

        prerequisites = skills_data.get(skill, {}).get("prerequisites", [])
        for prereq in prerequisites:
            dfs(prereq)

    for skill in required_skills:
        dfs(skill)

    return closure


def build_graph(skills_data, closure):
    """
    Build adjacency list and in-degree map
    only for skills inside closure.
    """
    graph = {skill: [] for skill in closure}
    in_degree = {skill: 0 for skill in closure}

    for skill in closure:
        prerequisites = skills_data.get(skill, {}).get("prerequisites", [])
        for prereq in prerequisites:
            if prereq in closure:
                graph[prereq].append(skill)
                in_degree[skill] += 1

    return graph, in_degree


def topological_sort_kahn(graph, in_degree):
    """
    Perform Kahn's algorithm for topological sorting.
    Raises ValueError if cycle detected.
    """
    queue = deque()
    ordered = []

    # Start with nodes that have no incoming edges
    for skill, degree in in_degree.items():
        if degree == 0:
            queue.append(skill)

    while queue:
        current = queue.popleft()
        ordered.append(current)

        for neighbor in graph[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    if len(ordered) != len(graph):
        raise ValueError("Cycle detected in skill dependency graph.")

    return ordered


def resolve_roadmap(skills_data, required_skills, skill_levels):
    """
    Main resolver function.
    Returns dependency-safe roadmap based on weak/missing skills.
    """

    # Step 1: Expand dependency closure
    closure = expand_dependency_closure(skills_data, required_skills)

    # Step 2: Build graph
    graph, in_degree = build_graph(skills_data, closure)

    # Step 3: Topological sort
    ordered_skills = topological_sort_kahn(graph, in_degree)

    # Step 4: Filter weak/missing skills
    roadmap = []
    for skill in ordered_skills:
        if skill_levels.get(skill) != "Strong":
            roadmap.append(skill)

    return roadmap
