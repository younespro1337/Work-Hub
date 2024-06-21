

async function translateText(text, targetLanguage) {
  const apiKey = 'YOUR_TRANSLATION_API_KEY';
  const url = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${targetLanguage}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': apiKey,
      'Content-type': 'application/json',
      'X-ClientTraceId': generateGuid(),
    },
    body: JSON.stringify([{ Text: text }]),
  });

  const data = await response.json();
  return data[0].translations[0].text;
}

// Helper function to generate a unique ID
function generateGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// translateText()

