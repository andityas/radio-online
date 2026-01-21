export async function handler(event, context) {
  const url = "http://103.246.184.62:1935/noice_genfm/genfm/playlist.m3u8";

  try {
    const res = await fetch(url);
    const body = await res.text();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/vnd.apple.mpegurl"
      },
      body
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "Proxy error: " + err.message
    };
  }
}