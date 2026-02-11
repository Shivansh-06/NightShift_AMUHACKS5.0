const BASE_URL = "https://nightshift-amuhacks5-0.onrender.com";

export async function fetchQuestions(career) {
  const response = await fetch(
    `${BASE_URL}/questions?career=${encodeURIComponent(career)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }

  return response.json();
}

export async function submitAssessment(data) {
  const response = await fetch(`${BASE_URL}/assess`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to submit assessment");
  }

  return response.json();
}
