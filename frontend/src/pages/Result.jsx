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
import StepProgress from "../components/StepProgress";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// Skill → Domain mapping
const skillDomainMap = {
  "Probability": "Mathematics",
  "Statistics": "Mathematics",
  "Linear Algebra": "Mathematics",

  "Python Basics": "Programming",
  "Python for Data": "Programming",

  "SQL": "Data Handling",
  "Excel": "Data Handling",
  "Data Visualization": "Data Handling",

  "Machine Learning": "Machine Learning",
  "Model Evaluation": "Machine Learning",

  "Model Deployment": "Systems",
  "System Design": "Systems",
};

export default function Result() {
  const { state } = useLocation();
  const [displayScore, setDisplayScore] = useState(0);

  if (!state) return <p>No results found.</p>;

  useEffect(() => {
    let start = 0;
    const end = state.career_alignment;
    const duration = 800;
    const increment = end / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayScore(end);
        clearInterval(counter);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [state]);

  // Radar setup
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
        ticks: { stepSize: 20 },
      },
    },
  };

  return (
    <div className="animate-fade-in min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-4">
      <StepProgress currentStep={3} />

      <div className="w-full max-w-3xl space-y-8">

        {/* Alignment Hero */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-lg text-center">
          <h3 className="text-lg text-gray-400 mb-2">
            Career Alignment Score
          </h3>

          <div className="text-5xl font-bold mb-4">
            {displayScore}%
          </div>

          <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
            <div
              className="bg-blue-500 h-4 rounded-full transition-all duration-700"
              style={{ width: `${displayScore}%` }}
            />
          </div>

          {displayScore >= 80 && (
            <p className="text-green-400">Strong alignment for this path.</p>
          )}
          {displayScore < 80 && displayScore >= 50 && (
            <p className="text-yellow-400">
              Moderate alignment — improvement recommended.
            </p>
          )}
          {displayScore < 50 && (
            <p className="text-red-400">
              Significant skill gaps detected.
            </p>
          )}
        </div>

        {/* Diagnostic Summary */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">
            Diagnostic Summary
          </h3>

          {state.insights.primary_gap ? (
            <div className="border-l-4 border-red-500 bg-gray-900 p-4 rounded-lg mb-4">
              🔎 Your biggest bottleneck is{" "}
              <strong>{state.insights.primary_gap}</strong>.
            </div>
          ) : (
            <div className="border-l-4 border-green-500 bg-gray-900 p-4 rounded-lg mb-4">
              🎯 You are strongly aligned with this career path.
            </div>
          )}

          {state.insights.high_impact_gap && (
            <p className="text-red-400 mb-4">
              Fixing {state.insights.high_impact_gap} unlocks multiple downstream skills.
            </p>
          )}

          <div className="flex gap-6 text-sm">
            <span className="text-red-400">
              Missing: {state.insights.missing_count}
            </span>
            <span className="text-yellow-400">
              Weak: {state.insights.weak_count}
            </span>
            <span className="text-green-400">
              Strong: {state.insights.strong_count}
            </span>
          </div>
        </div>

        {/* Domain Coverage */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4">
            Domain Coverage
          </h3>

          {Object.entries(
            Object.keys(state.skill_dna).reduce((acc, skill) => {
              const domain = skillDomainMap[skill];
              if (!acc[domain]) acc[domain] = [];
              acc[domain].push(state.skill_dna[skill]);
              return acc;
            }, {})
          ).map(([domain, levels]) => {
            const strong = levels.filter(l => l === "Strong").length;
            const weak = levels.filter(l => l === "Weak").length;
            const missing = levels.filter(l => l === "Missing").length;

            let status = "Strong";
            let color = "text-green-400";

            if (missing > 0) {
              status = "Needs Attention";
              color = "text-red-400";
            } else if (weak > 0) {
              status = "Moderate";
              color = "text-yellow-400";
            }

            return (
              <div key={domain} className="flex justify-between mb-3">
                <span>{domain}</span>
                <span className={color}>{status}</span>
              </div>
            );
          })}
        </div>

        {/* Skill DNA Radar */}
        <div className="text-center">
          <h2 className="text-3xl font-bold">Skill DNA</h2>
          <p className="text-gray-400 text-sm mb-4">
            Competency distribution across evaluated skills
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <Radar data={radarData} options={radarOptions} />
        </motion.div>

        {/* Recommended Learning Path */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-6">
            Recommended Learning Path
          </h3>

          {state.roadmap.length === 0 ? (
            <p className="text-green-400">
              No immediate gaps. You're ready for advanced growth.
            </p>
          ) : (
            <div className="space-y-4">
              {state.roadmap.map((skill, index) => (
                <div
                  key={skill}
                  className="bg-gray-900 p-4 rounded-lg hover:bg-gray-700 transition"
                >
                  <strong>{index + 1}.</strong> {skill}
                </div>
              ))}

            </div>
          )}
        </div>
        


        {/* Focus Later */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-2 text-gray-300">
            Focus Later
          </h3>
          <p className="text-gray-400 text-sm mb-3">
            These skills are currently strong and do not require immediate attention.
          </p>

          <ul className="list-disc list-inside space-y-1 text-gray-400">
            {state.avoid_for_now.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
          <p className="text-gray-400 text-sm mb-4 mt-4">
            Note: Skills are ordered based on prerequisite dependencies and foundational importance.
          </p>
        </div>

      </div>
    </div>
  );
}
