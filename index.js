#!/usr/bin/env node
import commandLineArgs from "command-line-args";
import { getSiteInfo, getSiteData } from "./site-fetcher/index.js";
import { publishUpdates } from "./update-publisher/index.js";
import consolestamp from "console-stamp";

// override console to have timestamping
consolestamp(console);

const refreshSiteData = async (site, filter) => {
  const html = await getSiteInfo(site);

  return getSiteData(html, filter);
}

let data = [];

const main = async (site, filter, updateTopic) => {
  const newData = await refreshSiteData(site, filter);
  if (!newData || newData.length < 1) {
    return;
  }
  const updates = [];
  newData.forEach((elem) => {
    const elemExists = data.find((e) => e.title && elem.title == e.title);
    if (!elemExists) {
      console.log(`change happened on ${site}, new element has appeared: ${elem.title}`);
      updates.push({ title: elem.title, action: "ADDED" })
    }
  });
  data.forEach((elem) => {
    const elemExists = newData.find((e) => e.title && elem.title == e.title);
    if (!elemExists) {
      console.log(`change happened on ${site}, new element has disappeared: ${elem.title}`);
      updates.push({ title: elem.title, action: "REMOVED" })
    }
  });
  if (updates.length > 0 && data.length > 0) {
    await publishUpdates(updateTopic, site, updates);
  } else {
    console.log(`no changes happened on ${site}`);
  }
  data = newData;
}

const app = () => {
  const optionDefinitions = [
    { name: "site", alias: "s", type: String },
    { name: "filter", alias: "f", type: String },
    { name: "updateTopic", alias: "u", type: String },
    { name: "interval", alias: "i", type: Number, defaultValue: 5 }
  ]
  
  const options = commandLineArgs(optionDefinitions)
  console.log(`polling site ${options.site} with filter "${options.filter}"`)
  main(options.site, options.filter, options.updateTopic);
  
  setInterval(() => {
    console.log(`updating site data ${options.site} with filter "${options.filter}"`)
    main(options.site, options.filter, options.updateTopic);
  }, options.interval * 60 * 1000);
}

app();
