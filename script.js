//References to our elements are defined.
let button = document.getElementsByClassName('tagButton')[0];
let input = document.getElementsByClassName('tagInput')[0];
//let result = document.getElementsByClassName('resultText')[0];
//const wordVectors = ml5.word2vec('data/wordvecs5000.json', modelLoaded);

//A function to return all words or "tags" semantically associated with a specific sentence.
function getSemanticTags(sentence) {
    //All punctuation is removed from the sentence and it is split up into words.
    words = sentence.replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()|]/g,"").replace(/\s{2,}/g, " ").split(" ");
    console.log(words);
    tags = [];
    //The nearest ten associated tags are found for each word with ml5
    for (let word of words) {
        wordVectors.nearest(word, (err, results) => {
            //The results are pushed to the returned array.
            //console.log(results);
            resultTags = [word.toUpperCase()];
            if (results) {
                for (let tag of results) {
                    if (tag.word) {
                        resultTags.push(tag.word.toUpperCase());
                    }
                }
            }
            tags.push(resultTags);
        });
    }
    return tags;
}

input.addEventListener('input', function(event) {
    event.target.value = event.target.value.replace(' ', '-');
});
button.addEventListener('click', function() {
    addTag('#'+input.value);
    addToGroup('#'+input.value);
});

function addTag(tagParam) {
    chrome.runtime.sendMessage({addTag: tagParam});
}

function modelLoaded() {
    console.log('Model Loaded!');
}
function addToGroup(tagParam) {
    chrome.runtime.sendMessage({addToGroup: tagParam});
}