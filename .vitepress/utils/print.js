export function goPrint() {
    window.onbeforeprint = beforePrint;
    window.onafterprint = afterPrint;
    location.hash = ''
    let bodyHtml = window.document.body.innerHTML;
    let startElement = "<!--startPrint-->";
    let overElement = "<!--endPrint-->";
    let printElement = bodyHtml.substr(bodyHtml.indexOf(startElement) + startElement.length);
    printElement = printElement.substring(0, printElement.indexOf(overElement));
    window.document.body.innerHTML = printElement;
    window.print();

    
    //打印前事件
    function beforePrint(e){
        // alert('1')
        console.log(e)
    }
    function afterPrint(e){
        // location.reload()
        // console.log(bodyHtml)
        window.document.body.innerHTML = bodyHtml
		location.reload()
    }
    //打印后事件

}
