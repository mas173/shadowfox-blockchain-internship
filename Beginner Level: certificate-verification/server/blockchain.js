const crypto = require("crypto");

function createHash(data) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");
}

class Blockchain {
  constructor() {
    this.chain = [];
  }

  addBlock(data) {
    const previousBlock = this.chain[this.chain.length - 1];

    const block = {
      index: this.chain.length,
      timestamp: new Date().toISOString(),
      data,
      previousHash: previousBlock ? previousBlock.hash : "0",
    };

    block.hash = createHash({
      index: block.index,
      timestamp: block.timestamp,
      data: block.data,
      previousHash: block.previousHash,
    });

    this.chain.push(block);

    return block;
  }

  verifyBlock(block) {
    const calculatedHash = createHash({
      index: block.index,
      timestamp: block.timestamp,
      data: block.data,
      previousHash: block.previousHash,
    });

    return calculatedHash === block.hash;
  }
}

module.exports = { Blockchain, createHash };
