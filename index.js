// VARIABLES
// body element variable
const body = document.querySelector("body");
const dictionary = document.querySelector("#dictionary");
const dictionaryMain = document.querySelector("#dictionary__main");
const dictionaryFooter = document.querySelector("#dictionary__footer");
const errorScreen = document.querySelector("#error-screen");
// font selector variables
const fontSelector = document.querySelector("#font-selector__btn");
const currentSelection = document.querySelector("#current-selection");
const dropdown = document.querySelector("#dropdown");
const selectorIcon = document.querySelector("#font-selector__icon");
// theme toggler/checkbox variable
const themeToggler = document.querySelector("#checkbox");
// fonts array variable
const fonts = document.querySelectorAll(".dropdown__item");
// search input variables
const form = document.querySelector("#form");
const formInput = document.querySelector("#form__search");
const formSearchIcon = document.querySelector("#form__search-icon");
// result variables
const displayWord = document.querySelector("#results__word");
const displayPhonetics = document.querySelector("#results__phonetics");
const displayButton = document.querySelector("#results__button");
const displaySynonym = document.querySelector("#results__synonym");
const nounDefinitions = document.querySelector("#noun-definitions");
const verbDefinitions = document.querySelector("#verb-definitions");
const displayExample = document.querySelector("#result-example");
const displayLink = document.querySelector("#dictionary__link");

// FUNCTIONS

// Event target function (development only)
// document.addEventListener("click", (e) => {
//   console.log(e.target)
// })

// toggle visually-hidden class when font selector is clicked
fontSelector.addEventListener("click", () => {
  dropdown.classList.toggle("visually-hidden");
  document.addEventListener("click", (e) => {
    if (e.target === themeToggler || e.target === formInput) {
      dropdown.classList.add("visually-hidden");
    }
  });
});
// hide font selector when scrolling
document.addEventListener("scroll", () => {
  dropdown.classList.add("visually-hidden");
})

// Font-changer loop/function NOT IN USE
for (let font of fonts) {
  font.addEventListener("click", (e) => {
    if ((e.target = font)) {
      currentSelection.innerHTML = font.innerHTML;
      body.style.fontFamily = font.id;
    }
  });
}
// ThemeToggle function
themeToggler.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});
// Search results loop function
const searchResults = (results, location) => {
  for (let result of results) {
    const definitionText = result.definition;
    const newP = document.createElement("p");
    newP.classList.add("body");
    newP.append(definitionText);
    location.append(newP);
  }
};
// SearchWord function
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = formInput.value;
  // -check for valid entry
  if (!input || !isNaN(input)) {
    console.log("invalid");
    dictionaryMain.classList.add("visually-hidden");
    dictionaryFooter.classList.add("visually-hidden");
    return form.classList.add("invalid");
  }
  try {
    // -clear data before new search request
    nounDefinitions.innerHTML = "";
    verbDefinitions.innerHTML = "";
    form.classList.remove("invalid");
    errorScreen.classList.add("visually-hidden");
    // -make api call base on user input
    const res = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${input}`
    );
    // -check for request error
    if (res.status === 404) throw e;
    // remove visually-hidden class on successful search
    dictionaryMain.classList.remove("visually-hidden");
    dictionaryFooter.classList.remove("visually-hidden");
    dictionaryMain.classList.remove("no-src");
    //- save dictionary link based off user input and display
    displayLink.innerHTML = `https://en.wiktionary.org/wiki/${input}`;
    displayLink.href = `https://en.wiktionary.org/wiki/${input}`;
    // Gather and display result data
    displayWord.innerHTML = res.data[0].word;
    // -save phonetics results and display if it exists
    const phoneticsResults = res.data[0].phonetics[0].text;
    if (phoneticsResults) {
      displayPhonetics.innerHTML = phoneticsResults;
    } else displayPhonetics.innerHTML = "";
    // -save synonym results and display if it exists
    const resultSynonym = res.data[0].meanings[0].synonyms[0];
    if (resultSynonym) {
      displaySynonym.innerHTML = resultSynonym;
      displaySynonym.href = `https://en.wiktionary.org/wiki/${resultSynonym}`;
    } else displaySynonym.innerHTML = "";
    // -save noun results and display if it exists
    if (res.data[0].meanings[0] === undefined) {
      verbDefinitions.innerHTML = "";
    } else if (res.data[0].meanings[0]) {
      const nounResults = res.data[0].meanings[0].definitions;
      searchResults(nounResults, nounDefinitions);
    }
    //  -save verb results and display if it exists
    if (res.data[0].meanings[1] === undefined) {
      verbDefinitions.innerHTML = "";
    } else if (res.data[0].meanings[1]) {
      const verbResults = res.data[0].meanings[1].definitions;
      searchResults(verbResults, verbDefinitions);
    }
    
    // - save audio results and play on displayButton click
    const audioOne = (res.data[0].phonetics[0].audio);
    const audioTwo = (res.data[0].phonetics[1].audio);
    const audioThree = (res.data[0].phonetics[2].audio);
    const audioSources = [audioOne, audioTwo, audioThree];
    audioSources.sort()
    const resultAudio = new Audio(audioSources[2]);
    displayButton.addEventListener("click", () => {
    resultAudio.play();
    setTimeout(clearAudio, 3000);
    });
    // Clear audio src function
    clearAudio = () => {
      resultAudio.src = "";
    };
    
    // -save example results and display if it exists
    const resultExample = res.data[0].meanings[1].definitions[0].example;
    if (resultExample) {
      displayExample.innerHTML = resultExample;
    } else displayExample.innerHTML = "";

    // Catch and resolve errors
  } catch (e) {
    // console.log(e);
    console.dir(e);
    // Hide elements on network error
    if (e.name === "AxiosError") {
      dictionaryMain.classList.add("visually-hidden");
      dictionaryFooter.classList.add("visually-hidden");
      errorScreen.classList.remove("visually-hidden");
    }
  }
});
