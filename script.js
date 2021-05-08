//References to our elements are defined.
let button = document.getElementsByClassName('tagButton')[0];
let input = document.getElementsByClassName('tagInput')[0];
let tagsDiv = document.getElementsByClassName('tagsDiv')[0];
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
    new Tag({
        name: tagParam
    });
}

function modelLoaded() {
    console.log('Model Loaded!');
}
function addToGroup(tagParam) {
    chrome.runtime.sendMessage({addToGroup: tagParam});
}

/*chrome.storage.sync.get(['tags'], function(result) {
    tagsArr = (result.tags) ? Object.keys(result.tags) : [];
    for (let i = 0; i < tagsArr.length; i++) {
        new Tag({
            name: tagsArr[i],
            content: result.tags[tagsArr[i]]
        });
    }
});*/



class Tag {
    constructor(info) {
        this.info = info;
        this.element = this.create();
    }
    create() {
        var elem = document.createElement('div');
        elem.className = 'tagDiv';
        elem.innerHTML = this.info.name;
        for (var i = 0; i < this.info.content.length; i++) {
            new Tab({
                parent: elem,
                title: this.info.content[i].title,
                url: this.info.content[i].url
            });
        }
        tagsDiv.appendChild(elem);
        return elem;
    }
}
class Tab {
    constructor(info) {
        this.info = info;
        this.element = this.create();
    }
    create() {
        var elem = document.createElement('div');
        elem.className = 'tabDiv';
        var title = document.createElement('span');
        var url = document.createElement('a');
        title.innerHTML = this.info.title;
        url.innerHTML = this.info.url;
        url.href = this.info.url;
        elem.appendChild(title);
        elem.appendChild(document.createElement('br'));
        elem.appendChild(url);
        this.info.parent.appendChild(elem);
    }
}