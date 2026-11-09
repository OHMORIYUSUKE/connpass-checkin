"use strict";

function connpassUrl(value) {
  try {
    let normalized = value.normalize("NFKC").replace(/[\t ]/g, "").trim();
    normalized = normalized.replace(
      /^(https:\/\/connpass\.com)[/・]event[/・](\d+)[/・]qr_checkin[/・](\d+)[/・](\d+)[/・]?$/,
      "$1/event/$2/qr_checkin/$3/$4/",
    );
    if (/^https:\/\/connpass\.com\/event\/\d+\/qr_checkin\/\d+\/\d+\/$/.test(normalized)) {
      return new URL(normalized);
    }
  } catch {
    return null;
  }
  return null;
}

const input = document.getElementById("url");
const form = document.getElementById("scan-form");
const status = document.getElementById("status");

let scanTimeout;

function scanError(message) {
  input.value = "";
  status.dataset.state = "error";
  status.textContent = message;
}

function openCheckin(url) {
  delete status.dataset.state;
  input.value = "";
  status.textContent = "QRを読み取りました。別タブで出席結果を確認してください。";
  window.open(url.href, "_blank", "noopener,noreferrer");
}

function openCompleteScan(event) {
  clearTimeout(scanTimeout);
  if (!input.value || event.isComposing) return;
  delete status.dataset.state;
  status.textContent = "受付票を読み取っています。";

  const url = connpassUrl(input.value);
  if (url && /[/／・･]\s*$/.test(input.value)) {
    openCheckin(url);
    return;
  }

  scanTimeout = setTimeout(() => {
    const message = /[/／・･]\s*$/.test(input.value)
      ? "受付票のURLを確認できませんでした。connpass の受付票をもう一度スキャンしてください。"
      : "読み取りが途中で止まりました。受付票をもう一度スキャンしてください。";
    scanError(message);
  }, 1500);
}

input.addEventListener("input", openCompleteScan);
input.addEventListener("compositionend", openCompleteScan);

document.addEventListener("keydown", (event) => {
  if (event.target === input || event.defaultPrevented || event.ctrlKey ||
      event.metaKey || event.altKey || event.isComposing || event.key.length !== 1 || event.key === " ") return;
  if (event.target.closest?.("input, textarea, select, [contenteditable]")) return;

  event.preventDefault();
  input.focus();
  input.value += event.key;
  openCompleteScan(event);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearTimeout(scanTimeout);
  const url = connpassUrl(input.value);
  input.value = "";

  if (!url) {
    scanError("受付票のURLを確認できませんでした。入力ソースを英数にして、もう一度スキャンしてください。");
    input.focus();
    return;
  }

  openCheckin(url);
});
