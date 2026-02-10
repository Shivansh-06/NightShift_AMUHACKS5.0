import { useLocation } from "react-router-dom";

export default function Result() {
  const { state } = useLocation();

  if (!state) return <p>No results found.</p>;

  return (
    <div>
      <h2>Skill DNA</h2>

      <ul>
        {Object.entries(state.skill_dna).map(([skill, level]) => (
          <li key={skill}>
            {skill}: {level}
          </li>
        ))}
      </ul>

      <h3>Career Alignment Score</h3>
      <p>{state.career_alignment}%</p>

      <h3>Recommended Learning Order</h3>
      <ul>
        {state.roadmap.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </div>
  );
}
