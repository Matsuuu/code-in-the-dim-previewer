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

    contestantNameEl.addEventListener("click", () => {
        iframe.parentElement.toggleAttribute("focused");
    });

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
