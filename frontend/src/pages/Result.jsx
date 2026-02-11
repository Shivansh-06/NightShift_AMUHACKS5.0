import { useLocation } from "react-router-dom";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);


export default function Result() {
    const { state } = useLocation();
  

    if (!state) return <p>No results found.</p>;
    const levelToScore = {
    Strong: 80,
    Weak: 50,
    Missing: 20,
    };
    const labels = Object.keys(state.skill_dna);
    const dataValues = labels.map(
        (skill) => levelToScore[state.skill_dna[skill]]
        );
    const radarData = {
        labels,
        datasets: [
            {
            label: "Skill DNA",
            data: dataValues,
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(59, 130, 246, 1)",
            },
        ],
        };
    const radarOptions = {
        scales: {
            r: {
                min: 0,
                max: 100,
                ticks: {
                stepSize: 20,
                },
            },
        },
    };


return (
<div>
    <h2>Skill DNA</h2>

        <div style={{ maxWidth: "500px", marginBottom: "2rem" }}>
        <Radar data={radarData} />
        </div>


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
      <h3>What NOT to Learn Right Now</h3>
      <ul>
        {state.avoid_for_now.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>

    </div>
  );
}



