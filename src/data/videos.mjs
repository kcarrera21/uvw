// Official YouTube videos shown on venue pages. Click-to-play: only the thumbnail loads (from YouTube's image server) until someone presses play.
// Rules: uploaded by the venue's own channel (or the public agency that runs the place), embedding allowed,
// and it shows the venue itself. kind "wedding" = shows weddings at the venue; "venue" = a look at the place (the caption says so).
// The build checks each one against YouTube oEmbed and drops any that are deleted, private or no longer embeddable.
// Checked 2026-10-16.
export const VIDEOS = {
  "the-neon-museum": { id: "y4HH4SmRWL0", title: "Brilliant! A Neon Museum Experience", channel: "The Neon Museum", channelUrl: "https://www.youtube.com/@TheNeonMuseum", kind: "venue" },
  "springs-preserve": { id: "Plg1KtKlIWw", title: "Event Venues at the Springs Preserve", channel: "Springs Preserve", channelUrl: "https://www.youtube.com/@SpringsPreserve", kind: "venue" },
  "little-church-of-the-west": { id: "GgeIcc1DExI", title: "Las Vegas Weddings - The Historic Little Church of the West in Las Vegas", channel: "Little Church of the West", channelUrl: "https://www.youtube.com/@littlechurchofthewest", kind: "wedding" },
  "chapel-of-the-flowers": { id: "yZCW0Cp9b-o", title: "Gazebo | Chapel of the Flowers | Garden Weddings in Las Vegas", channel: "Chapel of the Flowers", channelUrl: "https://www.youtube.com/@littlechapel", kind: "venue" },
  "viva-las-vegas-wedding-chapel": { id: "AiOttIlw2co", title: "Pirates of the Caribbean Jack Sparrow Themed Wedding at Viva Las Vegas Wedding Chapel", channel: "Viva Las Vegas Wedding Chapel", channelUrl: "https://www.youtube.com/@vivalasvegasweddingchapel", kind: "wedding" },
  "maverick-helicopters-weddings": { id: "8ljewUqNx14", title: "A Grand Canyon Wedding With Maverick Style", channel: "Maverick Helicopters", channelUrl: "https://www.youtube.com/@Maverickhelicopters", kind: "wedding" },
  "valley-of-fire-state-park": { id: "vPd7ETh64kE", title: "Valley of Fire: A Journey Through Time and Stone Trailer", channel: "Nevada Division of State Parks", channelUrl: "https://www.youtube.com/@NVStateParks", kind: "venue" },
  "the-mob-museum": { id: "74WUj8mhUao", title: "Weddings at The Mob Museum", channel: "The Mob Museum", channelUrl: "https://www.youtube.com/@TheMobMuseum", kind: "wedding" },
  "area15": { id: "5gE9U5M0XOQ", title: "Oddwood Tour for Your Next Event at AREA15 Las Vegas", channel: "AREA15", channelUrl: "https://www.youtube.com/@area15.official", kind: "venue" },
  "omega-mart-meow-wolf": { id: "3Pua8Sq-UMM", title: "The Omega Mart Experience | Meow Wolf", channel: "Meow Wolf", channelUrl: "https://www.youtube.com/@meowwolf", kind: "venue" },
  "venetian-gondola-weddings": { id: "J4N11RLbEJc", title: "The Venetian Las Vegas | The Historic Gondola", channel: "The Venetian Resort Las Vegas", channelUrl: "https://www.youtube.com/@venetianvegas", kind: "venue" },
  "spring-mountain-ranch-state-park": { id: "Cdh1ig9_T8c", title: "Spring Mountain Ranch State Park", channel: "Nevada Division of State Parks", channelUrl: "https://www.youtube.com/@NVStateParks", kind: "venue" },
  "welcome-to-fabulous-las-vegas-sign": { id: "YBbH3geum1Y", title: "Welcome to Las Vegas Sign Weddings by the Little Church of the West", channel: "Little Church of the West", channelUrl: "https://www.youtube.com/@littlechurchofthewest", kind: "wedding" },
  "the-little-vegas-chapel": { id: "xm9fAhgsh20", title: "The Wedding Experience | The Little Vegas Chapel", channel: "The Little Vegas Chapel", channelUrl: "https://www.youtube.com/@TheLittleVegasChapel", kind: "wedding" },
  "sahara-las-vegas": { id: "uIx_PvySt9Y", title: "Plan Your Next Event, Meeting or Wedding at SAHARA", channel: "SAHARA Las Vegas", channelUrl: "https://www.youtube.com/@SAHARALasVegas", kind: "venue" },
};
