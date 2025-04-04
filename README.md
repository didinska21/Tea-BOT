---

# TEA-BOT

Bot otomatis untuk
**deploy**
**transfer**
**burn** 

## Owner
**t.me/didinska**

---

## Fitur
- [x] Auto Transfer token ke banyak address
- [x] Auto Deploy token ERC20
- [x] Burn token yang sudah dideploy
- [x] Tampilan CLI menarik dengan banner & warna
- [x] Menu utama (index.js) untuk akses fitur cepat

---

## Instalasi

1. Clone repository:
```bash
git clone https://github.com/didinska21/Tea-BOT.git
cd Tea-BOT

2. Install dependencies:



npm install

3. Buat file .env dan isi dengan private key wallet:



PRIVATE_KEY=0x123456789abcdef...

4. Siapkan file address.json (untuk transfer) berisi daftar address tujuan dalam format:



[
  "0xAddress1",
  "0xAddress2"
]


---

Cara Penggunaan

1. Menu Utama

node index.js

Akan muncul pilihan:

TEA AUTO TRANSFER

TEA DEPLOY

TEA BURN


Pilih menu sesuai kebutuhan.


---

2. Auto Transfer

node main.js

Meminta jumlah address yang ingin dikirimi.

Mengirim 0.1 TEA ke setiap address.

Menampilkan TX hash dan sisa saldo.



---

3. Auto Deploy

node deploy.js

Input nama token, symbol, dan total supply.

Menampilkan address kontrak hasil deploy.

Menyimpan ABI otomatis di build/abi.json.



---

4. Burn Token

node burn.js

Membakar jumlah token yang kamu tentukan.

Gunakan setelah deploy jika ingin mengurangi total supply.



---

Struktur File

Tea-BOT/
│
├── address.json            // Daftar address tujuan
├── .env                    // Private key
├── build/abi.json          // ABI hasil compile
│
├── index.js                // Menu utama
├── main.js                 // Auto transfer
├── deploy.js               // Auto deploy token
├── burn.js                 // Burn token
├── generateContractCode.js // Generator & compiler smart contract


---

Catatan

Proyek ini hanya untuk pengujian di testnet.

Jangan gunakan private key wallet utama.
