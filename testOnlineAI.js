const testOnlineAI = async () => {
    console.log("Running AI Feedback Test for Online Web App...");

    const testData = { 
        history: [{ role: "user", content: "What are the benefits of eating vegetables?" }] 
    };

    try {
        const response = await fetch("https://ai-personal-nutritionist-web-app-gfynbob.vercel.app/main", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(testData),
        });

        if (!response.ok) {
            console.error(`❌ Test Failed: Server returned ${response.status} ${response.statusText}`);
            return;
        }

        const resultText = await response.text();  // First, get raw text response
        if (!resultText.trim()) {
            console.error("❌ Test Failed: Response is empty.");
            return;
        }

        let result;
        try {
            result = JSON.parse(resultText);  // Try parsing JSON
        } catch (err) {
            console.error("❌ Test Failed: Server returned non-JSON data:", resultText);
            return;
        }

        console.log("AI Response:", result.message);

        if (!result.message || result.message.length < 5) {
            console.error("❌ Test Failed: AI response is too short or empty!");
        } else {
            console.log("✅ Test Passed: AI response is valid.");
        }
    } catch (error) {
        console.error("❌ Test Failed: Error occurred!", error);
    }
};

testOnlineAI();
