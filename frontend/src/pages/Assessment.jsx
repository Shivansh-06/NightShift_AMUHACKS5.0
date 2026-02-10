import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchQuestions } from "../api/backend";

export default function Assessment() {
  const location = useLocation();
  const navigate = useNavigate();

  const career = location.state?.career;

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch questions on load
  useEffect(() => {
    if (!career) return;

    fetchQuestions(career)
      .then((data) => {
        setQuestions(data.questions);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [career]);

  const handleSelect = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      career,
      answers: Object.entries(answers).map(([qid, selected]) => ({
        question_id: Number(qid),
        selected,
      })),
    };

    const response = await fetch("http://127.0.0.1:8000/assess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    navigate("/result", { state: result });
  };

  // Guard states
  if (!career) return <p>No career selected.</p>;
  if (loading) return <p>Loading questions...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>{career} Assessment</h2>

      {questions.map((q) => (
        <div key={q.id}>
          <p><strong>{q.question}</strong></p>

          {q.options.map((opt) => (
            <label key={opt} style={{ display: "block" }}>
              <input
                type="radio"
                name={`question-${q.id}`}
                value={opt}
                checked={answers[q.id] === opt}
                onChange={() => handleSelect(q.id, opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}

      <button onClick={handleSubmit}>
        Submit Assessment
      </button>
    </div>
  );
}
