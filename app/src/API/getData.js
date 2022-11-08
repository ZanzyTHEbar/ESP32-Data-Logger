export default async function getData(url, sendTime = false) {
    try {
        let response = {};
        if (sendTime) {
            response = await fetch(url + "?" + new Date().getTime() / 1000);
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
        } else {
            response = await fetch(url);
        }
        let jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.log(error);
        return null;
    }
}
