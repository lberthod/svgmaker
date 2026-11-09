import { spawn } from 'node:child_process'
import { writeFile } from 'node:fs/promises'

export const FFMPEG = process.env.SVGMAKER_FFMPEG || 'ffmpeg'

/** Lance ffmpeg ; résout à la fin, rejette avec stderr en cas d'échec. */
export function run(args, { input } = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: [input ? 'pipe' : 'ignore', 'ignore', 'pipe'] })
    let err = ''
    p.stderr.on('data', (d) => (err += d))
    p.on('error', reject)
    p.on('close', (c) => (c ? reject(new Error(`ffmpeg (${c}) : ${err.trim().slice(-800)}`)) : resolve()))
    if (input) input(p.stdin)
  })
}

// Couleurs : Chrome capture en sRGB plein écart (JPEG yuvj) → on convertit explicitement
// en BT.709 « TV range », ce qu'Instagram/TikTok attendent (évite les couleurs délavées).
const COLOR = ['-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709']

/**
 * Encodeur de segment : reçoit des JPEG sur stdin, écrit un segment MPEG-TS H.264.
 * Retourne { write(buf), end() }.
 */
export function segmentEncoder(out, { fps, width, height, crf, preset }) {
  const p = spawn(
    FFMPEG,
    [
      '-hide_banner', '-loglevel', 'error', '-y',
      '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(fps), '-i', '-',
      '-vf', `scale=${width}:${height}:flags=lanczos:in_range=full:out_range=tv:out_color_matrix=bt709,format=yuv420p`,
      '-c:v', 'libx264', '-preset', preset, '-crf', String(crf), '-g', String(fps * 2),
      '-x264-params', 'colorprim=bt709:transfer=bt709:colormatrix=bt709:range=tv',
      ...COLOR, '-f', 'mpegts', out,
    ],
    { stdio: ['pipe', 'ignore', 'pipe'] },
  )
  let err = ''
  p.stderr.on('data', (d) => (err += d))
  const done = new Promise((resolve, reject) => {
    p.on('error', reject)
    p.on('close', (c) => (c ? reject(new Error(`ffmpeg segment (${c}) : ${err.trim().slice(-800)}`)) : resolve()))
  })
  return {
    async write(buf) {
      if (!p.stdin.write(buf)) await new Promise((r) => p.stdin.once('drain', r))
    },
    async end() {
      p.stdin.end()
      await done
    },
  }
}

/** Assemble les segments, ajoute la musique (fondus + loudnorm), écrit le MP4 final. */
export async function finalize({ segments, listFile, out, duration, music, musicVolume, loudnorm }) {
  await writeFile(listFile, segments.map((s) => `file '${s.replace(/'/g, "'\\''")}'`).join('\n'))
  const args = ['-f', 'concat', '-safe', '0', '-i', listFile]
  if (music) {
    const fo = Math.max(0, duration - 1.2).toFixed(3)
    const chain = [`atrim=0:${duration}`, 'asetpts=PTS-STARTPTS', 'afade=t=in:d=0.3', `afade=t=out:st=${fo}:d=1.2`]
    chain.push(loudnorm ? 'loudnorm=I=-14:TP=-1.5:LRA=11' : `volume=${musicVolume}`)
    // -stream_loop -1 : une musique plus courte que la vidéo repart au début (pas de silence final)
    args.push('-stream_loop', '-1', '-i', music, '-filter_complex', `[1:a]${chain.join(',')}[a]`, '-map', '0:v', '-map', '[a]', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000')
  } else {
    args.push('-map', '0:v')
  }
  args.push('-c:v', 'copy', '-t', duration.toFixed(3), '-movflags', '+faststart', out)
  await run(args)
}

export const cover = (mp4, out, at) =>
  run(['-ss', String(at), '-i', mp4, '-frames:v', '1', '-q:v', '3', out])

export const gif = (mp4, out, { fps = 12, width = 360 } = {}) =>
  run([
    '-i', mp4, '-vf',
    `fps=${fps},scale=${width}:-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4`,
    '-loop', '0', out,
  ])

/** Planche horizontale à partir de JPEG. */
export const sheet = (frames, out, height = 640) =>
  run([
    ...frames.flatMap((f) => ['-i', f]),
    '-filter_complex', frames.map((_, i) => `[${i}]scale=-2:${height}[s${i}]`).join(';') + ';' + frames.map((_, i) => `[s${i}]`).join('') + `hstack=${frames.length}`,
    '-q:v', '4', out,
  ])
