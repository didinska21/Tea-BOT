# TEA-BOT

Bot otomatis untuk **deploy**, **transfer**, dan **burn** token ERC20 di jaringan **TEA Sepolia Testnet**.

## Owner
**[t.me/didinska](https://t.me/didinska)**

---

## Fitur
- [x] Auto Transfer token ke banyak address
- [x] Auto Deploy token ERC20
- [x] Burn token yang sudah dideploy
- [x] Tampilan CLI menarik dengan banner & warna
- [x] Menu utama (index.js) untuk akses fitur cepat

---

## Cara Instalasi & Setup

### 1. Clone Repository
```bash
git clone https://github.com/didinska21/Tea-BOT.git
cd Tea-BOT
```
### 2. Install module
```bash
npm install
```
### 3. Buat file .env masukkan private key disini.
```bash
PRIVATE_KEY=0xyourprivatekeyhere
```
### 4. Buat file address.json masukkan address target. 
berikut formatnya
```bash
[
  "0x123...",
  "0xabc..."
]
```
## Menjalankan SCRIPT.
### auto transfer
```bash
node main.js
```
### deploy smart contract
```bash
node deploy.js
```
### burn token deploy
```bash
node burn.js
```
## Struktur Folder
```bash
Tea-BOT/
│
├── address.json              // Daftar address tujuan
├── .env                      // Private key
├── build/abi.json            // ABI hasil compile
│
├── index.js                  // Menu utama
├── main.js                   // Auto transfer
├── deploy.js                 // Auto deploy token
├── burn.js                   // Burn token
├── generateContractCode.js   // Buat & compile smart contract ERC20
```
## Tips & Catatan 

Proyek ini hanya untuk pengujian testnet

Gunakan wallet testnet, bukan wallet utama

Pastikan saldo TEA cukup untuk gas fee dan transfer

Explorer resmi: https://sepolia.tea.xyz/

### RPC SEPOLIA TEA TESTNET
```bash
name :Tea Sepolia Testnet
url : https://tea-sepolia.g.alchemy.com/public
chain : 10218
symbol : TEA
explorer : sepolia.tea.xyz/
```
