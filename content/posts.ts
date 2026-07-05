export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  tag: string;
  /** Simple markdown-ish body: paragraphs split by \n\n, `## ` for h2, `- ` for list items */
  body: string;
};

export const posts: Post[] = [
  {
    slug: "how-long-does-video-editing-take",
    title: "How long does professional video editing actually take?",
    description:
      "Realistic turnaround times for short-form, YouTube videos, ads, and motion graphics — and what separates a 48-hour agency from a 3-week one.",
    date: "2026-06-18",
    readingTime: "6 min read",
    tag: "Process",
    body: `Ask ten editors how long a video takes and you'll get ten answers — because the honest answer is "it depends on the system behind the editor." After 1,300+ projects, here's what turnaround actually looks like when post-production runs as an operation instead of a favor.

## The realistic benchmarks

- Short-form clip (Reel / TikTok / Short): 24–48 hours
- YouTube video, 10–20 minutes: 48–72 hours
- Video ad with variants: 48–72 hours per batch
- Motion graphics package: 3–6 days
- Documentary-style long-form: 5–10 days

These numbers assume the edit starts when the footage lands. The gap between agencies isn't editing speed — it's everything around the edit.

## Where time actually goes

Most delays in video projects happen before the timeline is even opened: unclear briefs, footage scattered across three platforms, feedback that arrives as a voice note. A professional pipeline attacks exactly those points.

A written brief with references kills the biggest source of revision cycles. Structured footage intake — one folder, one naming convention — saves half a day per project. And timestamped feedback turns a week of back-and-forth into one afternoon.

## What "fast" should never mean

Speed achieved by skipping the retention pass, sound design, or color is not speed — it's just shipping something unfinished sooner. The right question for any editing partner isn't "how fast can you go?" but "what's included at that speed?" If the answer doesn't cover pacing, sound, captions, and revisions, the quoted turnaround is fiction.

## The takeaway

If your current editing process takes more than a week for standard content, the bottleneck is almost never the editing itself. It's the absence of a system. Fix the intake, the brief, and the feedback loop — or work with a partner who has already fixed them.`,
  },
  {
    slug: "youtube-retention-editing-guide",
    title: "Retention editing: how the best YouTube videos hold attention",
    description:
      "The editing decisions that keep viewers watching — pacing, pattern interrupts, open loops, and the first 30 seconds that decide everything.",
    date: "2026-06-30",
    readingTime: "8 min read",
    tag: "Craft",
    body: `Two videos can share the same script, the same presenter, and the same information — and one will hold 60% of its audience at the midpoint while the other bleeds out before the first minute ends. The difference lives in the edit.

## The first 30 seconds are a different discipline

Viewers decide to stay or leave in a compressed window at the start. Retention editing treats the opening as its own project: cut every second that doesn't earn its place, front-load the promise of the video, and never open with a logo animation. The intro's only job is to make skipping feel like a loss.

## Pattern interrupts are rhythm, not decoration

A pattern interrupt is any deliberate change that resets attention: a cut to b-roll, a zoom, a caption, a sound cue, a moment of silence. Used randomly, they're noise. Used rhythmically — roughly every time a viewer's attention would naturally dip — they function like a drummer keeping the audience in the song.

The practical rule we edit by: nothing on screen should stay identical for longer than the content itself is gripping. Talking-head sections tolerate less stillness than storytelling peaks.

## Open loops keep the midpoint alive

The midpoint slump is where most videos quietly die. The antidote is structural: open a question early that only resolves late, reference "what's coming" honestly, and sequence sections so each one hands momentum to the next. This is editing as story architecture — deciding what the viewer knows and when.

## Sound is half the retention

Watch a high-retention video with the sound off and it feels strangely dead. Sound design — risers into reveals, ambience under b-roll, the subtle duck before a key line — carries emotional pacing that visuals alone can't. It's also the most commonly skipped step in cheap edits.

## Measure, then edit differently

Retention graphs are editing feedback, not vanity metrics. A dip at 0:45 is a note about your intro. A cliff at a chapter transition is a note about that transition. The channels that grow treat every published video as data for the next edit — which is exactly how an editing partner should work too.`,
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
