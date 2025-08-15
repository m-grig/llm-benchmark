export function parseJSON(responseString: string) {
  const jsonString = responseString
    .replace(/^[^\{\[]*/g, '') // remove everything before first { or [
    .replace(/[^\}\]]*$/g, ''); // remove everything after last } or ]
  return JSON.parse(jsonString);
}
