export function goPrint() {
    location.hash = ''
    let bodyHtml = window.document.body.innerHTML;
    let startElement = "<!--startPrint-->";
    let overElement = "<!--endPrint-->";
    let printElement = bodyHtml.substr(bodyHtml.indexOf(startElement) + 17);
    printElement = printElement.substring(0, printElement.indexOf(overElement));
    window.document.body.innerHTML = printElement;
    window.print();
    window.document.body.innerHTML = bodyHtml
    location.reload()
}   