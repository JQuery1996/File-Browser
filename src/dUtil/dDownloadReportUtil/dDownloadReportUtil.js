
import configData from "../../config.json";

export const downloadReport = (reportObject) => {
    let commandUrl, requestOptions;
    commandUrl = configData.SERVER_URL + "Report";
    requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reportObject),
    };

    setTimeout(function () {
        fetch(commandUrl, requestOptions).then((response) => {
            if (response.ok)
                return response.blob();
        })
            .then((blob) => {
                if (blob) {
                    const myFile = new File([blob], {
                        type: blob.type,
                    });
                    // Create blob link to download
                    const url = window.URL.createObjectURL(myFile);

                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute(
                        'download',
                        `${reportObject.arName}.${reportObject.type}`,
                    );
                    // Append to html link element page
                    document.body.appendChild(link);

                    // Start download
                    link.click();

                    setTimeout(function () {
                        window.URL.revokeObjectURL(link);
                    }, 200)
                    // Clean up and remove the link
                    link.parentNode.removeChild(link);
                }
                else {
                    return;
                }
            })
    }, 3000)
}
// export default downloadReport;