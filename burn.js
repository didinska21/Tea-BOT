require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const readline = require("readline");
const chalk = require("chalk");
const boxen = require("boxen");
const figlet = require("figlet");
const gradient = require("gradient-string");

// Tampilkan Banner
function showBanner() {
  console.clear();
  const banner = figlet.textSync("TEA BURN", {
    font: "ANSI Shadow",
    horizontalLayout: "default",
    verticalLayout: "default",
  });
  console.log(gradient.pastel.multiline(banner));
  console.log(chalk.gray.bold("owner : t.me/didinska\n"));
}
showBanner();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

const rpcUrl = "https://tea-sepolia.g.alchemy.com/public";
const explorerUrl = "https://sepolia.tea.xyz/address/";
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
const privateKey = process.env.PRIVATE_KEY;

if (!privateKey) {
  console.log(chalk.redBright("PRIVATE_KEY tidak ditemukan di .env"));
  process.exit(1);
}

const wallet = new ethers.Wallet(privateKey, provider);

(async () => {
  try {
    const tokenAddress = await askQuestion(chalk.cyan("Alamat Kontrak Token: "));
    const amountToBurn = await askQuestion(chalk.cyan("Jumlah Token yang akan dibakar: "));

    const abi = JSON.parse(fs.readFileSync("./build/abi.json", "utf-8"));
    const contract = new ethers.Contract(tokenAddress, abi, wallet);

    const decimals = await contract.decimals();
    const amountInWei = ethers.utils.parseUnits(amountToBurn, decimals);

    const tx = await contract.transfer("0x000000000000000000000000000000000000dEaD", amountInWei);
    await tx.wait();

    const message = `
${chalk.greenBright.bold("✓ SUCCESS BURN")}
Amount Burned   : ${chalk.yellow(amountToBurn)} TOKEN
Burn Address     : ${chalk.gray("0x000...dEaD")}
TX Hash          : ${chalk.cyan(tx.hash)}
Explorer         : ${chalk.underline(`https://sepolia.tea.xyz/tx/${tx.hash}`)}
`;

    console.log(boxen(message, {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "green",
    }));

    rl.close();
  } catch (error) {
    const message = `
${chalk.redBright.bold("✗ GAGAL BURN")}
Error: ${chalk.red(error.message)}
`;

    console.log(boxen(message, {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "red",
    }));
    rl.close();
  }
})();
