const forge = require('node-forge')({ disableNativeCode: true });

export function encrypt(data, secret, callback) {
  const key = secret || forge.random.getBytesSync(32);
  const iv = forge.random.getBytesSync(16);
  const keyHex = forge.util.bytesToHex(key);
  const ivHex = forge.util.bytesToHex(iv);

  const cipher = forge.cipher.createCipher('AES-CBC', key);
  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(data));
  cipher.finish();

  const dataHex = cipher.output.toHex();

  const obj = {
    key: keyHex,
    iv: ivHex,
    data: dataHex
  };

  return callback(obj);
}

export function decrypt(obj, secret, callback) {
  /**
   * Obj: key (HEX), iv (HEX), data (STRING)
   */
  const key = secret || forge.util.hexToBytes(obj.key);
  const iv = forge.util.hexToBytes(obj.iv);
  const data = forge.util.hexToBytes(obj.data);
  const decipher = forge.cipher.createDecipher('AES-CBC', key);
  decipher.start({ iv: iv });
  decipher.update(forge.util.createBuffer(data));
  decipher.finish();

  return callback(decipher.output.data);
}
