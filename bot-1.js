console.log("bot.js loaded");
const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-input");

let useApi = true;

function appendMessage(username, message, isUser) {
  const messageElement = document.createElement("div");
  messageElement.className = `message ${
    isUser ? "user-message" : "bot-message"
  }`;
  messageElement.innerHTML = `<div class="username">${username}</div> ${message}`;
  return messageElement;
}

async function sendMessage() {
  console.log("sendMessage called");
  const userMessage = userInput.value.trim();
  if (userMessage === "") return;

  const username = "salman";
  const userMessageElement = appendMessage(username, userMessage, true);
  chatLog.appendChild(userMessageElement);

  try {
    const botResponse = await generateBotResponse(userMessage);
    const botMessageElement = appendMessage("Bot", botResponse, false);
    chatLog.appendChild(botMessageElement);
  } catch (error) {
    console.error("Error generating bot response:", error.message);
  }

  userInput.value = "";
}

function goToMainMenu() {
  chatLog.innerHTML = "";
  const welcomeMessage = "Selamat datang di Menu Utama!";
  const botMessageElement = appendMessage("Bot", welcomeMessage, false);
  chatLog.appendChild(botMessageElement);
  userInput.focus();

  console.log("Kembali ke menu utama");

  window.location.href = "index.html";
}

const toggleButton = document.getElementById("toggle-api-button");

toggleButton.addEventListener("click", function () {
  useApi = !useApi;
  const status = useApi ? "ON" : "OFF";
  console.log(`API is now ${status}`);

  toggleButton.classList.toggle("off", !useApi);
});

async function generateBotResponse(userMessage) {
  if (useApi) {
    const apiKey = "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";
    const endpoint = "https://api.openai.com/v1/chat/completions";
    const model = "gpt-3.5-turbo";

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: userMessage },
        ],
      }),
    };

    try {
      const response = await fetch(endpoint, requestOptions);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch data. Status: ${response.status}. Error: ${errorText}`
        );
      }

      const data = await response.json();

      if (
        data.choices &&
        data.choices.length > 0 &&
        data.choices[0].message &&
        data.choices[0].message.content
      ) {
        const botReply = data.choices[0].message.content;
        return botReply;
      } else {
        throw new Error("Invalid response format from the API");
      }
    } catch (error) {
      console.error("Error generating bot response from API:", error.message);
    }
  } else {
    if (userMessage.toLowerCase().includes("hai")) {
      return "menyala abangku";
    } else if (userMessage.toLowerCase().includes("siapa yang buat kamu?")) {
      return "muhammad salman alfarisi";
    } else if (userMessage.toLowerCase().includes("makanan kesukaan salman?")) {
      return "nasi goreng dong";
    } else {
      return 'Maaf, saya hanya menjawab "beberapa pertanya terkait pembuat saya" ketika tombol off.';
    }
  }
}

document.getElementById("send-button").addEventListener("click");
document.getElementById("back-button").addEventListener("click", goToMainMenu);
