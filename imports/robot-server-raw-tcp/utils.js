export const readTerminatedString = (data) => {
  const stringEnd = data.indexOf('\0');
  return [data.slice(0, stringEnd), data.slice(stringEnd + 1)];
};

export const intToBin = int => {
  const arr = new ArrayBuffer(4);
  const view = new DataView(arr);
  view.setUint32(0, int);
  return arr;
};

export const binToInt = bin => {
  const view = new DataView(bin);
  return view.getUint32(0);
};

export const concatBuffers = function(buffer1, buffer2) {
  const t = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  t.set(new Uint8Array(buffer1), 0);
  t.set(new Uint8Array(buffer2), buffer1.byteLength);
  return t.buffer;
};

export const packMessage = (message) => {
  const t = new Uint8Array(4 + message.byteLength);
  t.setUint32(0, message.length);
  t.set(message, 4);
  return t.buffer;
};

export const unpackMessage = (message) => {
  if (message.byteLength < 4) return [null, message];
  const contentLength = binToInt(message);
  if (message.byteLength < 4 + contentLength) return [null, message];
  return [message.slice(4, 4 + contentLength), message.slice(4 + contentLength)];
};
