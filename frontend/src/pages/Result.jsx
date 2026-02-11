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
  <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-4">

    <h2 className="text-4xl font-bold mb-8">Skill DNA</h2>

    <div className="w-full max-w-md bg-gray-800 rounded-xl p-6 shadow-lg">
      <Radar data={radarData} options={radarOptions} />
    </div>

    <div className="mt-8 w-full max-w-md space-y-6">

      <div>
        <h3 className="text-xl font-semibold mb-2">Career Alignment Score</h3>
        <p className="text-3xl font-bold text-blue-400">
          {state.career_alignment}%
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">
          Recommended Learning Order
        </h3>
        <ul className="list-disc list-inside space-y-1 text-gray-300">
          {state.roadmap.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2 text-red-400">
          What NOT to Learn Right Now
        </h3>
        <ul className="list-disc list-inside space-y-1 text-gray-400">
          {state.avoid_for_now.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </div>

    </div>
  </div>
);
}
