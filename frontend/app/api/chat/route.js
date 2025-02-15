import axios from "axios";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Sending to backend:", body);

    // Make request to backend
    const response = await axios.post("http://localhost:5000/api/chat", body);
    console.log("Received from backend:", response.data);

    // Return response properly
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error:", error);


    if (axios.isAxiosError(error)) {
      return new Response(JSON.stringify({
        type: "text",
        data: `Backend Error: ${error.response?.data || "Unknown error"}`
      }), {
        status: error.response?.status || 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ type: "text", data: "Error processing your request." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
