export async function GET(req) {
  try {
    // Example data for the response
    const tokenUsage = {
      usedTokens: 100,
      maxTokens: 500,
    };

    // Return JSON response with appropriate headers
    return new Response(JSON.stringify(tokenUsage), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching token usage:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch token usage" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
