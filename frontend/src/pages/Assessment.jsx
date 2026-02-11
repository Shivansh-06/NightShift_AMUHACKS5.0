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
  const allAnswered = questions.length === Object.keys(answers).length;


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
  <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-4">

    <h2 className="text-3xl font-bold mb-8">
      {career} Skill Assessment
    </h2>

    <div className="w-full max-w-2xl space-y-6">

      {questions.map((q) => (
        <div
          key={q.id}
          className="bg-gray-800 p-6 rounded-xl shadow-md"
        >
          <p className="text-lg font-semibold mb-4">
            {q.question}
          </p>

          <div className="space-y-3">
            {q.options.map((opt) => (
              <label
                key={opt}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition ${
                  answers[q.id] === opt
                    ? "bg-blue-600"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={() => handleSelect(q.id, opt)}
                  className="hidden"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className={`w-full py-3 rounded-xl font-semibold text-lg transition ${
            allAnswered
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-600 cursor-not-allowed"
          }`}
      >
        Submit Assessment
      </button>


    </div>
  </div>
);
}