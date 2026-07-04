const ytdl = require('@distube/ytdl-core');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { videoId, quality } = req.query;
  if (!videoId) return res.status(400).json({ error: 'Falta videoId' });

  try {
    const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`);
    let format;
    try {
      format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
    } catch {
      format = info.formats
        .filter(f => f.mimeType && f.mimeType.includes('audio/mp4'))
        .sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0))[0];
    }

    res.json({
      title: info.videoDetails.title,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      duration: info.videoDetails.lengthSeconds,
      url: format.url
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
