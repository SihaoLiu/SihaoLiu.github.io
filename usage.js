"use strict";

async function showUsage() {
  const content = document.getElementById("usage-content");
  const status = document.getElementById("usage-status");
  const controls = document.getElementById("usage-controls");
  const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 });
  const integer = new Intl.NumberFormat("en-US");
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  try {
    const response = await fetch("data/usage.json", { cache: "no-cache" });
    if (!response.ok) throw new Error("Snapshot unavailable");
    const snapshot = await response.json();
    if (snapshot.schema_version !== 1 || !Array.isArray(snapshot.daily) || !snapshot.daily.length) throw new Error("Unsupported snapshot");
    const generated = new Date(snapshot.generated_at);
    if (!Number.isFinite(generated.getTime())) throw new Error("Invalid snapshot date");
    const fresh = Date.now() - generated.getTime() <= 86400000;
    status.textContent = fresh ? "Latest snapshot" : "Saved snapshot";
    status.classList.toggle("is-fresh", fresh);
    const buttons = [7, 30].filter(days => days <= snapshot.daily.length).map(days => {
      const button = element("button", "usage-range", `${days}d`);
      button.type = "button";
      button.setAttribute("aria-label", `Last ${days} days`);
      button.addEventListener("click", () => render(days));
      controls.append(button);
      return { days, button };
    });
    const result = element("div", "usage-result");
    const update = element("p", "usage-updated", `Snapshot ${generated.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "UTC" })} UTC. Daily totals use Pacific time; the last day is partial.`);
    content.replaceChildren(result, update);
    function render(days) {
      buttons.forEach(item => item.button.setAttribute("aria-pressed", String(item.days === days)));
      const daily = snapshot.daily.slice(-days);
      const totals = daily.reduce((sum, day) => {
        ["total", "cache_hit", "prefill", "decoding", "requests"].forEach(key => { sum[key] += day[key]; });
        return sum;
      }, { total: 0, cache_hit: 0, prefill: 0, decoding: 0, requests: 0 });
      const headline = element("p", "usage-total", compact.format(totals.total));
      const label = element("p", "usage-total-label", `tokens processed over ${daily.length} calendar days`);
      headline.title = `${integer.format(totals.total)} total tokens, including cache reads`;
      const secondary = element("div", "usage-secondary");
      const share = totals.total ? totals.cache_hit / totals.total * 100 : 0;
      for (const [value, name] of [[compact.format(totals.decoding), "Generated"], [`${share.toFixed(1)}%`, "Cache hits"], [compact.format(totals.requests), "Requests"]]) {
        const stat = element("div", "usage-stat");
        stat.append(element("strong", "", value), element("span", "", name));
        secondary.append(stat);
      }
      const chart = element("div", "usage-chart");
      chart.setAttribute("role", "img");
      chart.setAttribute("aria-label", `Daily token usage from ${daily[0].date} to ${daily.at(-1).date}. ${integer.format(totals.total)} total tokens, including cache reads.`);
      const max = Math.max(1, ...daily.map(day => day.total));
      daily.forEach(day => {
        const bar = element("div", "usage-bar");
        bar.style.height = `${day.total / max * 100}%`;
        bar.title = `${day.date}: ${integer.format(day.total)} tokens; ${integer.format(day.decoding)} generated`;
        for (const key of ["decoding", "prefill", "cache_hit"]) {
          const part = element("span", `token-${key}`);
          part.style.flexGrow = day[key];
          bar.append(part);
        }
        chart.append(bar);
      });
      const axis = element("div", "usage-axis");
      axis.append(element("span", "", daily[0].date), element("span", "", daily.at(-1).date));
      const legend = element("div", "usage-legend");
      for (const [key, name] of [["cache_hit", "Cached"], ["prefill", "Prefill"], ["decoding", "Generated"]]) legend.append(element("span", `legend-${key}`, name));
      result.replaceChildren(headline, label, secondary, chart, axis, legend);
    }
    render(Math.min(30, snapshot.daily.length));
  } catch {
    status.textContent = "Temporarily unavailable";
    controls.replaceChildren();
    content.replaceChildren(element("p", "usage-empty", "The usage snapshot is temporarily unavailable. Please check back later."));
  }
}

showUsage();
