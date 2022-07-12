const crypto = require("crypto");

export function createSlug(title: String) {
  const id = crypto.randomBytes(8).toString("hex");

  const slugWithoutSpecialCharacters = title.replace(
    /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
    ""
  );
  const slugWithoutNumbers = slugWithoutSpecialCharacters.replace(/[0-9]/g, "");
  const slugWithOneSpace = slugWithoutNumbers.replace(/\s\s+/g, " ");
  const slugWithSlashesAndLowercase = slugWithOneSpace
    .split(" ")
    .join("-")
    .toLowerCase();

  const slug = `${slugWithSlashesAndLowercase}-${id}`;

  return slug;
}

export function createSummary(summaryInput: String) {
  const summary = `${summaryInput}...`;

  return summary;
}
