import { generateExposedKeyPair } from '../src/lib/solana/wallet-generator.js';

async function test() {
  const wallet = await generateExposedKeyPair();
  console.log('Public Key:', wallet.publicKey);
  console.log('Private Key:', wallet.privateKey);
}

test();