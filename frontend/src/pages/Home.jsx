import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const startAssessment = () => {
    navigate("/assessment", {
      state: { career: "Data Analyst" }
    });
  };

  return (
    <div>
      <h1>SkillMap AI</h1>
      <p>Select a career to begin skill diagnosis.</p>

      <button onClick={startAssessment}>
        Start Data Analyst Assessment
      </button>
    </div>
  );
}
