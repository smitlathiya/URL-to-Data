import React, { useState } from "react";
import axios from "axios";
import * as cheerio from "cheerio";

const App = () => {
  const [url, setUrl] = useState("");
  const [isSafe, setIsSafe] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [websiteDetail, setWebsiteDetail] = useState({
    image: "",
    title: "",
    description: "",
    author: "",
    type: "",
    canonicalUrl: "",
    locale: "",
    publishedDate: "",
  });

  const checkSafety = async () => {
    try {
      const apiKey = "AIzaSyDZp45WtxbGKKnWdvhrjAEZfkFmLvkZZ3w";
      const requestUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;
      const requestBody = {
        client: {
          clientId:
            "327282251510-sie04qoc3mpc9bqd6lsq4a641f6rk8ne.apps.googleusercontent.com",
          clientVersion: "1.0",
        },
        threatInfo: {
          threatTypes: ["MALWARE"],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [
            {
              url,
            },
          ],
        },
      };

      const googleRes = await axios.post(requestUrl, requestBody);

      console.log(googleRes.data);

      axios
        .get("https://app.scrapingbee.com/api/v1", {
          params: {
            api_key:
              "9XZE7CVMI1K45BDS30CG31KGKE8LX4P3BY3L3N6ACK9IH8WY5VGXIXJO1TZTV8TBJJTBAK3YV8UC5BLW",
            url: url,
            // 'screenshot': true,
          },
        })
        .then(function (response) {
          const $ = cheerio.load(response.data);

          const data = {
            title: $("title").text(),
            description: $('meta[name="description"]').attr("content"),
            author: $('meta[name="author"]').attr("content"),
            image: $('meta[property="og:image"]').attr("content"),
            type: $('meta[property="og:type"]').attr("content"),
            canonicalUrl: $('link[rel="canonical"]').attr("href"),
            locale: $("html").attr("lang"),
            publishedDate: $('meta[property="article:published_time"]').attr(
              "content"
            ),
          };

          setWebsiteDetail(data);
        });
    } catch (error) {
      console.error(error);
    }
  };
console.log(websiteDetail)
  return (
    <div>
      <input
        type="text"
        placeholder="Enter URL"
        value={url}
        onChange={(e) => {
          let url = e.target.value;
          setUrl(url);
          const regex =
            /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
          if (url.match(regex)) {
            setIsValid(true);
          } else {
            setIsValid(false);
          }
        }}
      />
      <button onClick={checkSafety} disabled={!isValid}>Check Safety</button>
      {isSafe !== null && (
        <p> {isSafe ? "The URL is safe" : "The URL is malicious"} </p>
      )}
    </div>
  );
};

export default App;
