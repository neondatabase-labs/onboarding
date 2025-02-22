import sodium from "libsodium-wrappers";

// Pasted from https://docs.github.com/en/rest/guides/encrypting-secrets-for-the-rest-api?apiVersion=2022-11-28#example-encrypting-a-secret-using-nodejs
export const sodiumEncrypt = async (message: string, key: string) => {
  await sodium.ready;
  const binkey = sodium.from_base64(key, sodium.base64_variants.ORIGINAL);
  const binsec = sodium.from_string(message);
  const encBytes = sodium.crypto_box_seal(binsec, binkey);
  const output = sodium.to_base64(encBytes, sodium.base64_variants.ORIGINAL);
  return output;
};
