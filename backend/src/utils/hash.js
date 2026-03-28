import fs from "fs";
import crypto from "crypto";
import stringify from "fast-json-stable-stringify"


//////////////////////////////////////////////////////
// 🔹 GENERIC DATA HASH
//////////////////////////////////////////////////////
export const generateDataHash = (data) => {
  return crypto
    .createHash("sha256")
    .update(stringify(data))
    .digest("hex");
};

//////////////////////////////////////////////////////
// 🔥 DOCUMENT HASH (content + metadata)
//////////////////////////////////////////////////////
export const generateDocumentHash = ({
  filePath,
  fileName,
  documentId,
  type,
}) => {

  const fileBuffer = fs.readFileSync(filePath);

  const payload = {
    documentId,
    fileName,
    type,
    fileContentHash: crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex"),
  };

  return generateDataHash(payload);
};

//////////////////////////////////////////////////////
// 🔥 MILESTONE HASH (docs + milestone)
//////////////////////////////////////////////////////
export const generateMilestoneHash = ({ milestone, documentHashes }) => {

  const payload = {
    milestoneId: milestone.id,
    title: milestone.title,
    amount: milestone.amount,
    sequence: milestone.sequence,
    documents: documentHashes.sort(), // ensure consistency
  };

  return generateDataHash(payload);
};

//////////////////////////////////////////////////////
// 🔥 TRANSACTION HASH (payment)
//////////////////////////////////////////////////////
export const generateTransactionHash = ({
  milestoneId,
  fromAccount,
  toAccount,
  amount,
  timestamp,
}) => {

  return generateDataHash({
    milestoneId,
    fromAccount,
    toAccount,
    amount,
    timestamp,
  });
};