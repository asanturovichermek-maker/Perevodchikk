const source = document.getElementById("source");
const target = document.getElementById("target");
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const translateBtn = document.getElementById("translate");
const status = document.getElementById("status");

translateBtn.addEventListener("click", async function () {
  const text = inputText.value.trim();

  if (!text) {
    status.textContent = "Сначала введи текст!";
    inputText.focus();
    return;
  }

  if (source.value === target.value) {
    outputText.value = text;
    status.textContent = "Выбери другой язык для перевода.";
    return;
  }

  translateBtn.disabled = true;
  status.textContent = "Переводим...";

  try {
    const url =
      "https://api.mymemory.translated.net/get?q=" +
      encodeURIComponent(text) +
      "&langpair=" +
      encodeURIComponent(source.value + "|" + target.value);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Ошибка интернет-соединения");
    }

    const data = await response.json();

    if (
      data.responseStatus !== 200 ||
      !data.responseData ||
      !data.responseData.translatedText
    ) {
      throw new Error("Не удалось перевести текст");
    }

    outputText.value = data.responseData.translatedText;
    status.textContent = "Перевод готов! ✅";
  } catch (error) {
    status.textContent =
      "Ошибка перевода. Проверь интернет и попробуй ещё раз.";
  } finally {
    translateBtn.disabled = false;
  }
});

document.getElementById("swap").addEventListener("click", function () {
  const oldSource = source.value;
  source.value = target.value;
  target.value = oldSource;

  const oldText = inputText.value;
  inputText.value = outputText.value;
  outputText.value = oldText;

  status.textContent = "Языки поменялись местами.";
});

document.getElementById("copy").addEventListener("click", async function () {
  if (!outputText.value) {
    status.textContent = "Сначала получи перевод.";
    return;
  }

  try {
    await navigator.clipboard.writeText(outputText.value);
    status.textContent = "Перевод скопирован! ✅";
  } catch (error) {
    outputText.focus();
    outputText.select();
    status.textContent = "Выдели текст и скопируй его вручную.";
  }
});

document.getElementById("clear").addEventListener("click", function () {
  inputText.value = "";
  outputText.value = "";
  status.textContent = "Текст очищен.";
  inputText.focus();
});
