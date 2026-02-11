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
