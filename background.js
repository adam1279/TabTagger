/*const wordVectors = ml5.word2vec('data/wordvecs5000.json', modelLoaded);

function modelLoaded() {

}*/

chrome.tabs.onCreated.addListener(function(tab) {
    //console.log(tab);
    //console.log(getSemanticTags(tab.title));
    chrome.storage.sync.get([tab.url], function(result) {
        if (result[tab.url]) {
            funcs.addToGroup(result[tab.url][0]);
        }
    });
});
//chrome.tabs.onActivated.addListener(function())

funcs = {
    addTag: function(tagParam) {
        tag = tagParam.toLowerCase();
        chrome.tabs.query({'active': true}, function(tab) {
            //console.log(getSemanticTags(tab[0].title));
            tabInfo = {
                url: tab[0].url,
                title: tab[0].title
            };
            chrome.storage.sync.get([tag, tab[0].url], function(result) {
                data = (result[tag]) ? result[tag] : [];
                data.push(tabInfo);
                obj = {};
                obj[tag] = data;
                chrome.storage.sync.set(obj);
    
                data = (result[tab[0].url]) ? result[tab[0].url] : [];
                data.push(tag);
                obj = {};
                obj[tab[0].url] = data;
                chrome.storage.sync.set(obj);
            });
        });
    },
    addToGroup: function(tagParam) {
        tag = tagParam.toLowerCase();
        chrome.tabGroups.query({'title': tag}, function(group) {
            chrome.tabs.query({'active': true}, function(tab) {
                console.log(tag);
                if (group[0]) {
                    chrome.tabs.group({tabIds: tab[0].id, groupId: group[0].id});
                } else {
                    chrome.tabs.group({tabIds: tab[0].id}, function(id) {
                        chrome.tabGroups.update(id, {title: tag});
                    });
                }
            });
        });
    }
};
chrome.runtime.onMessage.addListener(function(msg) {
    /*console.log('who');
    if (msg.addToGroup) {
        addToGroup(msg.addToGroup);
    }*/
    for (func of Object.keys(funcs)) {
        if (msg[func]) {
            funcs[func](msg[func]);
        }
    }
    /*fetch('https://unpkg.com/ml5@0.6.1/dist/ml5.min.js')
	    .then(response => response.json())
	    .then(data => console.log(data))
	    .catch(err => console.error(err));*/
});
chrome.tabGroups.onMoved.addListener(function() {
    console.log('weeet');
});
/*function getSemanticTags(sentence) {
    words = sentence.split(" ");
    tags = [];
    for (let word of words) {
        wordVectors.nearest(word, (err, results) => {
            tags.push(results);
        });
    }
    return tags;
}*/