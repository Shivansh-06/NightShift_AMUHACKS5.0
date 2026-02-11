const BASE_URL = "http://127.0.0.1:8000";

export async function fetchQuestions(career) {
  const response = await fetch(
    `${BASE_URL}/questions?career=${encodeURIComponent(career)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }

  return response.json();
}
