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

const COLORS = [
    'rgb(54, 162, 235)', // blue
    'rgb(255, 99, 132)', // red
    'rgb(255, 159, 64)', // orange
    'rgb(255, 205, 86)', // yellow
    'rgb(75, 192, 192)', // green
    'rgb(153, 102, 255)', // purple
    'rgb(201, 203, 207)' // grey
];

const ROUND_ID = "czg";

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

    console.log(apiResponse)
    let i = 0;
    for (const draft of apiResponse.latestDrafts) {
        let contestantFrame = contestantFrames[draft.nonce];
        if (!contestantFrame) {
            contestantFrame = initFrame(draft);
        }

        const html = `<html>${draft.code}</html>`;
        const blob = new Blob([html], { type: "text/html" });
        contestantFrame.src = window.URL.createObjectURL(blob);
        contestantFrame.parentElement.style.setProperty("--contestant-color", COLORS[i]);
        i++;
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

    contestantFrames[draftEntry.nonce] = iframe;
    return iframe;
}

function getLatestProgress() {
    return fetch(`https://citd.kaljaa.fi/progress/${ROUND_ID}`).then(res => res.json());
}

const initialResponse = await getLatestProgress();
initializeFrames(initialResponse);
updatePreviewWindows(initialResponse);

setInterval(async () => {
    const apiResponse = await getLatestProgress();
    updatePreviewWindows(apiResponse);
}, 3000);
