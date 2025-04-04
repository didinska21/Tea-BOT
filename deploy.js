require("dotenv").config();
const { ethers } = require("ethers");
const readline = require("readline");
const chalk = require("chalk");
const boxen = require("boxen");
const figlet = require("figlet");
const gradient = require("gradient-string");
const { generateContractCode } = require("./generateContractCode");

// Tampilkan Banner
function showBanner() {
  console.clear();
  const banner = figlet.textSync("TEA DEPLOY", {
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

const rpcUrl = "https://tea-sepolia.g.alchemy.com/public";
const explorerUrl = "https://sepolia.tea.xyz/address/";
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
const privateKey = process.env.PRIVATE_KEY;

if (!privateKey) {
  console.log(chalk.redBright("PRIVATE_KEY tidak ditemukan di file .env"));
  process.exit(1);
}

const wallet = new ethers.Wallet(privateKey, provider);

async function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

(async () => {
  try {
    const name = await askQuestion(chalk.cyan("Nama Token: "));
    const symbol = await askQuestion(chalk.cyan("Symbol Token: "));
    const supply = await askQuestion(chalk.cyan("Jumlah Supply (misal: 1000000): "));

    console.log(chalk.gray("\nMemproses deploy smart contract...\n"));

    const { abi, bytecode } = generateContractCode(name, symbol, supply);

    const factory = new ethers.ContractFactory(abi, bytecode.object, wallet);
    const contract = await factory.deploy();
    await contract.deployed();

    const message = `
${chalk.greenBright.bold("✓ SUCCESS DEPLOYED")}
Token           : ${chalk.cyan(name)} (${chalk.yellow(symbol)})
Total Supply    : ${chalk.magenta(supply)} Token
Contract Address: ${chalk.cyan(contract.address)}
Explorer        : ${chalk.underline(`${explorerUrl}${contract.address}`)}
    `;

    console.log(boxen(message, {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "green",
    }));

    rl.close();
  } catch (err) {
    const errorBox = boxen(`
${chalk.redBright.bold("✗ GAGAL DEPLOY")}
Error: ${chalk.red(err.message)}
`, {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "red",
    });

    console.log(errorBox);
    rl.close();
  }
})();
