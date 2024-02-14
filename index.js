const exampleAPIResponse = {
    latestDrafts: [
        {
            code: '<style>\r\n    p {\r\n        color: red;\r\n    }\r\n</style>\r\n\r\n<div class="delete-me">\r\n    <p>Good luck and have fun!</p>\r\n</div>',
            contestantName: "keppi",
            ctime: "2024-01-12T15:10:42.250537+00:00",
            id: "018cfe39-ae4a-dcba-72fc-2cf9c7e9efec",
            nonce: "DcsJqmS65g1T",
        },
        {
            code: '<style>\r\n    p {\r\n        color: red;\r\n    }\r\n</style>\r\n\r\n<div class="delete-me">\r\n    <p>Good luck and have fun!</p>\r\n</div>',
            contestantName: "heppi",
            ctime: "2024-01-12T15:10:42.250537+00:00",
            id: "118cfe39-ae4a-dcba-72fc-2cf9c7e9efec",
            nonce: "DcsJqmS65g1T",
        },
        {
            code: '<style>\r\n    p {\r\n        color: red;\r\n    }\r\n</style>\r\n\r\n<div class="delete-me">\r\n    <p>Good luck and have fun!</p>\r\n</div>',
            contestantName: "neppi",
            ctime: "2024-01-12T15:10:42.250537+00:00",
            id: "218cfe39-ae4a-dcba-72fc-2cf9c7e9efec",
            nonce: "DcsJqmS65g1T",
        },
        {
            code: '<style>\r\n    p {\r\n        color: red;\r\n    }\r\n</style>\r\n\r\n<div class="delete-me">\r\n    <p>Good luck and have fun!</p>\r\n</div>',
            contestantName: "reppi",
            ctime: "2024-01-12T15:10:42.250537+00:00",
            id: "318cfe39-ae4a-dcba-72fc-2cf9c7e9efec",
            nonce: "DcsJqmS65g1T",
        },
        {
            code: '<style>\r\n    p {\r\n        color: red;\r\n    }\r\n</style>\r\n\r\n<div class="delete-me">\r\n    <p>Good luck and have fun!</p>\r\n</div>',
            contestantName: "1eppi",
            ctime: "6024-01-12T15:10:42.250537+00:00",
            id: "818cfe39-ae4a-dcba-72fc-2cf9c7e9efec",
            nonce: "DcsJqmS65g1T",
        }
    ],
};

const contestantFrames = {};

/**
 * @typedef ApiResponse
 * @property { DraftEntry[] } latestDrafts
 * */

/**
 * @typedef DraftEntry
 * @property { string } code
 * @property { string } contestantName
 * @property { string } ctime
 * @property { string } id
 * @property { string } nonce
 * */

/**
 * @param {ApiResponse} apiResponse
 */
export function updatePreviewWindows(apiResponse) {

    for (const draft of apiResponse.latestDrafts) {
        let contestantFrame = contestantFrames[draft.id];
        if (!contestantFrame) {
            contestantFrame = initFrame(draft);
        }

        const html = `<html>${draft.code}</html>`;
        const blob = new Blob([html], { type: "text/html" });
        contestantFrame.src = window.URL.createObjectURL(blob);
        contestantFrame.parentElement.style.setProperty("--window-count", apiResponse.latestDrafts.length + '');
        contestantFrame.parentElement.style.setProperty("--contestant-name", draft.contestantName);
    }

}

/**
 * @param {ApiResponse} exampleAPIResponse
 */
export function initializeFrames(exampleAPIResponse) {
    exampleAPIResponse.latestDrafts.forEach((draft) => {
        initFrame(draft);
    });
}

/**
 * @param {DraftEntry} draftEntry
 */
function initFrame(draftEntry) {
    const div = document.createElement("div");
    const iframe = document.createElement("iframe");
    const contestantNameEl = document.createElement("label");
    contestantNameEl.innerText = draftEntry.contestantName;

    div.appendChild(iframe);
    div.appendChild(contestantNameEl);
    document.body.appendChild(div);

    contestantFrames[draftEntry.id] = iframe;
    return iframe;
}

function getLatestProgress() {
    return fetch("https://citd.kaljaa.fi/progress/czg").then(res => res.json());
}

const initialResponse = await getLatestProgress();
initializeFrames(initialResponse);

setInterval(async () => {
    const apiResponse = await getLatestProgress();
    updatePreviewWindows(apiResponse);
}, 3000);
