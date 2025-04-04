require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const readline = require("readline");
const chalk = require("chalk");
const boxen = require("boxen");
const figlet = require("figlet");
const gradient = require("gradient-string");

// Tampilan banner
function showBanner() {
  console.clear();
  const banner = figlet.textSync("TEA AUTO TX", {
    font: "ANSI Shadow",
    horizontalLayout: "default",
    verticalLayout: "default",
  });
  console.log(gradient.pastel.multiline(banner));
  console.log(chalk.whiteBright("owner : t.me/didinska\n"));
}

showBanner();

// Setup provider & wallet
const rpcUrl = "https://tea-sepolia.g.alchemy.com/public";
const explorerUrl = "https://sepolia.tea.xyz/tx/";
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
const privateKey = process.env.PRIVATE_KEY;

if (!privateKey) {
  console.log(chalk.redBright("PRIVATE_KEY tidak ditemukan di .env"));
  process.exit(1);
}

const wallet = new ethers.Wallet(privateKey, provider);
const addressList = JSON.parse(fs.readFileSync("address.json", "utf-8"));

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function sendTea(to, amountInEther, index, total) {
  try {
    const tx = await wallet.sendTransaction({
      to,
      value: ethers.utils.parseEther(amountInEther),
    });

    await tx.wait();

    const balance = await wallet.getBalance();

    const message = `
${chalk.greenBright.bold("✓ SUCCESS")}  [${index}/${total}]
To        : ${chalk.cyan(to)}
TX Hash   : ${chalk.yellow(tx.hash)}
Explorer  : ${chalk.underline(explorerUrl + tx.hash)}
Sisa TEA  : ${chalk.magenta(ethers.utils.formatEther(balance))} TEA
`;

    console.log(boxen(message, {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "green",
    }));
  } catch (error) {
    const message = `
${chalk.redBright.bold("✗ GAGAL")} [${index}/${total}]
To       : ${chalk.cyan(to)}
Error    : ${chalk.red(error.message)}
`;
    console.log(boxen(message, {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "red",
    }));
  }
}

// CLI input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(chalk.yellowBright(`Kirim ke berapa address pertama? (1-${addressList.length}): `), async (input) => {
  const total = parseInt(input);

  if (isNaN(total) || total < 1 || total > addressList.length) {
    console.log(chalk.red("Input tidak valid."));
    rl.close();
    return;
  }

  for (let i = 0; i < total; i++) {
    const target = addressList[i];
    console.log(chalk.blueBright(`\n[${i + 1}/${total}] Mengirim ke: ${target}`));
    await sendTea(target, "0.1", i + 1, total);

    const delayMs = Math.floor(Math.random() * 5000) + 5000;
    console.log(chalk.gray(`Menunggu ${delayMs / 1000} detik...\n`));
    await delay(delayMs);
  }

  console.log(chalk.greenBright(`\n✓ Selesai mengirim ke ${total} address.`));
  rl.close();
});
