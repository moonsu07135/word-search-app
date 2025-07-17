
const PIXABAY_API_KEY = "50822515-a15f41d2a3e61659d9e671300";

async function searchTerm() {
  const word = document.getElementById("termInput").value.trim();
  const defDiv = document.getElementById("definition");
  const imgDiv = document.getElementById("images");

  defDiv.innerHTML = "🔍 검색 중...";
  imgDiv.innerHTML = "";

  let showedDefinition = false;

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
    if (response.ok) {
      const data = await response.json();
      const definition = data[0].meanings[0].definitions[0].definition;
      const example = data[0].meanings[0].definitions[0].example || "(예문 없음)";
      defDiv.innerHTML = `
        📘 <strong>${word}</strong>: ${definition}<br><em>예: ${example}</em><br><br>
        <a href="https://translate.google.com/?sl=en&tl=ko&text=${encodeURIComponent(definition)}" target="_blank">
        🔗 한국어 번역 보기</a>
      `;
      showedDefinition = true;
    }
  } catch (err) {
    console.log("영어 뜻 검색 실패:", err);
  }

  if (!showedDefinition) {
    defDiv.innerHTML = "⚠️ 뜻을 찾을 수 없지만 관련 이미지를 보여드릴게요.";
  }

  try {
    const imgRes = await fetch(`https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(word)}&image_type=photo&per_page=3`);
    const imgData = await imgRes.json();
    if (imgData.hits.length === 0) {
      imgDiv.innerHTML = "😢 관련 이미지를 찾을 수 없어요.";
    } else {
      imgData.hits.forEach(img => {
        const imageTag = document.createElement("img");
        imageTag.src = img.webformatURL;
        imageTag.alt = word;
        imgDiv.appendChild(imageTag);
      });
    }
  } catch (err) {
    console.error("이미지 검색 실패:", err);
    imgDiv.innerText = "⚠️ 이미지를 불러오는 중 오류가 발생했어요.";
  }
}

function playPronunciation() {
  const word = document.getElementById("termInput").value.trim();
  if (!word) return;
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

// Enter 키로 검색
document.getElementById("termInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    searchTerm();
  }
});

// 서비스 워커 등록 (PWA)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("✅ 서비스 워커 등록됨"))
    .catch(err => console.error("❌ 서비스 워커 등록 실패:", err));
}