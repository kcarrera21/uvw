// =====================================================================
//  VENUES — facts verified against each venue's official page on 2026-10-04.
//  Descriptions are original UVW copy. Prices are "from" prices published
//  by the venue on the check date; the site always shows the check date.
//
//  status:  "listed"   = public info only (default)
//           "partner"  = venue has claimed/paid (shows Partner badge)
//  featured: true      = paid Featured/Spotlight placement (rotates on home)
//  priceFrom: number or null (null shows "Custom quote")
// =====================================================================

export const CATEGORIES = [
  { slug: "historic-iconic", name: "Historic & Iconic", blurb: "Neon relics, old courthouses and a real ghost town. Vegas history you can say vows in.",
    intro: "Las Vegas reinvents itself constantly, which makes the places that survived feel special. These venues have real history behind them: the Neon Museum's gallery of retired signs, the restored federal courthouse that houses the Mob Museum, the 1861 mining site at Nelson Ghost Town, and the Welcome to Fabulous Las Vegas sign. They suit couples who want a setting with a story and photos that could only have been taken here. Expect smaller guest counts and firm house rules, because several of these are museums or landmarks first and wedding venues second." },
  { slug: "desert-outdoors", name: "Desert & Outdoors", blurb: "Red sandstone, desert gardens, lakes and ranch lawns, all within a short drive of the Strip.",
    intro: "The Mojave starts where the Strip ends. Within about an hour of the hotels you can marry among red sandstone at Valley of Fire or Red Rock Canyon, in the gardens at Springs Preserve, on a historic ranch lawn, beside a park lake, or aboard a paddle wheeler on Lake Mead. Most of these sites are public land, so a permit is part of the plan, and heat decides the time of day. Spring and fall are the comfortable seasons. Our <a href=\"/guides/desert-wedding-permits/\">desert wedding permits guide</a> explains what each agency requires." },
  { slug: "sky-high", name: "Sky High", blurb: "Towers, observation wheels and helicopters. For couples who want the whole valley as a witness.",
    intro: "If the view matters most, go up. Las Vegas offers ceremonies in The STRAT's tower chapels, which it bills as 800 feet above the valley, in a private cabin on the High Roller observation wheel, at the top of the Eiffel Tower at Paris Las Vegas, and in helicopters that fly over the Strip or land on the floor of the Grand Canyon. Most of these options suit small groups, because cabins, decks and aircraft set the guest count. Time the ceremony for sunset if you want daylight and city lights in the same photos." },
  { slug: "strip-luxury", name: "Strip Luxury", blurb: "Fountains, gondolas and Roman gardens. Big-resort polish with the logistics handled.",
    intro: "The big resorts make a wedding easy on everyone. The ceremony, reception, rooms and restaurants sit on one property, and an in-house team runs the day. Options include the fountain-view terrace at Bellagio, a white gondola at The Venetian, Roman gardens and chapels at Caesars Palace, and the Waldorf Astoria's ballroom with floor-to-ceiling Strip views. Published prices are less common at this level. Several resorts quote by date and guest count, so ask for the ceremony, reception and room block in one request." },
  { slug: "quirky-pop-culture", name: "Quirky & Pop Culture", blurb: "Sharks, drive-thrus, portals and theme chapels. Only-in-Vegas, and proudly so.",
    intro: "Some weddings could only happen in Las Vegas. You can marry among the tanks at Shark Reef Aquarium, inside Meow Wolf's Omega Mart, under 360-degree projections at AREA15, at the drive-up window of the Tunnel of Love, or in full costume at the Viva Las Vegas theme chapel. These venues work for couples who want a day their guests will retell for years. Published prices run from $150 for the drive-thru to five figures for a full AREA15 production." },
  { slug: "classic-chapels", name: "Classic Chapels", blurb: "The chapels that made Las Vegas the wedding capital of the world. Still the fastest way to \"I do.\"",
    intro: "Chapels are the reason Las Vegas is known for weddings. Graceland Wedding Chapel was established in 1939, A Little White Wedding Chapel has hosted weddings since 1951, and Little Church of the West is on the National Register of Historic Places. A chapel is the quickest and most affordable route to a legal ceremony, with published packages starting at $150. Add-ons range from photography and flowers to an Elvis impersonator. Graceland, for one, also offers vow renewals and non-legal ceremonies." },
];

export const venues = [
  {
    name: "The Neon Museum", slug: "the-neon-museum", category: "historic-iconic",
    area: "Downtown / Fremont", drive: "10–15 min from the Strip", setting: "Outdoor",
    vibe: ["Vintage neon", "Retro", "Night glow", "Photogenic"],
    priceFrom: 2500, priceLabel: "Sweetheart Wedding (daytime)", guestMax: 90,
    facts: [
      "Ceremonies take place in the North Gallery among vintage, non-operational signs.",
      "The nighttime Stardust Wedding adds projection mapping to the signs.",
      "Published packages: Sweetheart Wedding (daytime) $2,500; Golden Hour +$500; Stardust Wedding $3,500; +10 guests $200.",
      "Up to 50 guests included (benches seat 48–50); up to 90 with add-ons.",
      "Daytime Sweetheart Weddings aren't booked June–August because of heat (sunrise weddings are offered). Stardust runs September–May.",
    ],
    bestFor: "Couples who want Old Vegas glamour without a slot machine in the background.",
    description: `Every sign in this place has a past life: hotels that were imploded, motels that faded, casinos that live on only in postcards. Getting married in the middle of them feels a little like borrowing the city's memory for the afternoon.

Book daytime and you get sun-bleached color and long shadows across rusted letters. Book the Stardust package after dark and the signs come back to life through projection mapping. It's the closest thing to time travel the Strip has. It's the backdrop people recognize from across the room at your anniversary party.`,
    tips: [
      "Summer heat rules out midday: plan for sunrise in June–August, or wait for Stardust season (Sept–May).",
      "Guest count matters here. Seating tops out around 50 before add-ons.",
      "The signs are fragile artifacts. Expect rules about touching, props and confetti.",
    ],
    url: "https://neonmuseum.org/weddings/", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "Springs Preserve", slug: "springs-preserve", category: "desert-outdoors",
    area: "West Las Vegas (near Downtown)", drive: "About 15 min from the Strip", setting: "Indoor & outdoor",
    vibe: ["Botanical", "Desert garden", "Natural", "Family-friendly"],
    priceFrom: 1565, priceLabel: "Ceremony-only, Gazebo (Thu & Sun)", guestMax: 200,
    facts: [
      "A 180-acre preserve built around the original Las Vegas Springs, the city's first water source.",
      "Full packages (Thu–Mon): Garden Terrace up to 100 guests $5,175; Agave Room up to 120 $5,665; Courtyard Plaza up to 200 $5,575.",
      "Ceremony-only (Thu & Sun): Garden Arbor up to 100 guests $1,775; Gazebo up to 100 $1,565.",
      "A licensed wedding coordinator is required.",
    ],
    bestFor: "Garden weddings with real desert character and room for the whole family.",
    description: `Before there was a Strip, there was water. Springs Preserve sits on the spring that gave Las Vegas its name ("the meadows"). Today it's 180 acres of desert gardens, trails and shaded terraces. It's the rare venue that feels like nature and still has restrooms, parking and a plan for 200 guests.

It's a strong pick for couples who want a garden ceremony that couldn't be mistaken for anywhere else. Think agave instead of roses, and a skyline you can barely see over the cactus.`,
    tips: [
      "Ceremony-only slots run on Thursdays and Sundays, which is the budget move.",
      "Build a licensed coordinator into your budget. The Preserve requires one.",
      "Booking windows are published, so check the calendar before you fall in love with a date.",
    ],
    url: "https://springspreserve.org/book/weddings.html", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "Nelson Ghost Town", slug: "nelson-ghost-town", category: "historic-iconic",
    area: "Eldorado Canyon (Nelson, NV)", drive: "About 1 hr from the Strip", setting: "Indoor & outdoor",
    vibe: ["Wild West", "Rustic", "Ghost town", "Desert"],
    priceFrom: 1999, priceLabel: "1-hour all-inclusive package", guestMax: null,
    facts: [
      "Site of the Techatticup Mine, where mining started in 1861. Weathered buildings, vintage vehicles and antiques throughout.",
      "Has an on-site wedding chapel. Weddings are booked through Scenic Las Vegas Weddings, which handles permits.",
      "All-inclusive packages: 1 hr $1,999; 2 hr $2,499; 3 hr $2,999 (officiant, photography, transportation and video included).",
      "Address: 16880 State Highway 165, Nelson, NV 89046.",
    ],
    bestFor: "Western, rustic or offbeat elopements with photos nobody back home will have seen.",
    description: `An hour from the Strip, the pavement gives way to Eldorado Canyon and a mining town that never quite left. Rusted trucks, sun-faded storefronts and a little chapel sit at the edge of a canyon carved toward the Colorado River.

Nelson is the antidote to the Vegas you've seen on TV. There's no neon, no casino crowds, no dress code. It's just you, a lot of history and light that does most of the photographer's work. The packages bundle transportation and photo/video, which is handy when your venue is a canyon an hour away.`,
    tips: [
      "Packages include transport, so you don't need to figure out the drive yourselves.",
      "Dress for dust and uneven ground. Boots photograph beautifully here.",
      "It's a working attraction, so ask how much privacy your time slot includes.",
    ],
    url: "https://nelsonghosttown.com/weddings", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "Waldorf Astoria Las Vegas", slug: "waldorf-astoria-las-vegas", category: "strip-luxury",
    area: "The Strip (CityCenter)", drive: "On the Strip", setting: "Indoor & outdoor",
    vibe: ["Refined", "Skyline views", "Elegant", "Understated"],
    priceFrom: null, priceLabel: null, guestMax: 800,
    facts: [
      "A 47-story hotel in the CityCenter complex, formerly the Mandarin Oriental.",
      "The Waldorf Ballroom has floor-to-ceiling Strip views and seats up to 450 at banquet or 800 for receptions.",
      "The eighth-floor outdoor Pool Deck hosts ceremonies and cocktail receptions. The Atriums hold 30–60 guests.",
    ],
    bestFor: "Couples who want Strip views without Strip noise. No casino floor to walk through.",
    description: `The Waldorf is the quiet one on the Strip. There's no casino floor, no lobby slot machines, and no wading through a crowd in a wedding dress. You get an elevator, a view and a dedicated events team.

The ballroom's floor-to-ceiling windows put the Strip skyline behind your reception. The eighth-floor pool deck makes an open-air ceremony feel almost private. For a big, polished wedding with an unmistakably Vegas view, it's one of the most elegant options in the city.`,
    tips: [
      "Pricing is quote-only. Ask for ceremony + reception bundles and room-block terms in the same email.",
      "The Atriums (30–60 guests) suit intimate weddings that still want luxury.",
      "There's no casino on site, which matters if you're bringing guests under 21.",
    ],
    url: "https://www.hilton.com/en/hotels/laswdwa-waldorf-astoria-las-vegas/events/weddings", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "Shark Reef Aquarium at Mandalay Bay", slug: "shark-reef-aquarium", category: "quirky-pop-culture",
    area: "The Strip (south)", drive: "On the Strip", setting: "Indoor",
    vibe: ["Underwater", "Sharks", "Unexpected", "Immersive"],
    priceFrom: null, priceLabel: null, guestMax: null,
    facts: [
      "Weddings by Mandalay Bay offers ceremonies inside Shark Reef Aquarium \"amongst an underwater audience.\"",
      "Home to more than 2,000 animals. The largest exhibit is the sunken-shipwreck \"Neptune's Fury.\"",
      "The first and only facility in Nevada accredited by the Association of Zoos & Aquariums.",
    ],
    bestFor: "Ocean lovers, divers, and anyone who wants their witnesses to have fins.",
    description: `In the middle of the Mojave there's a shipwreck full of sharks, and you can get married in front of it. The blue light, slow-moving rays and the occasional shark gliding past make everything look like a film still.

It's air-conditioned, which is no small thing in July. It's also on the Strip, so the reception can be an elevator ride away. Few venues anywhere get the "wait, where did you get married?" reaction this one does.`,
    tips: [
      "Book through Mandalay Bay's wedding team. Ask about the guest limit in the tunnel areas.",
      "Aquarium lighting is dim and blue. Hire a photographer who's comfortable with low light.",
      "It's a great hot-weather pick: indoors, cool and right on the Strip.",
    ],
    url: "https://mandalaybay.mgmresorts.com/en/meetings-groups/weddings.html", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "Little Church of the West", slug: "little-church-of-the-west", category: "classic-chapels",
    area: "The Strip (south, near the Welcome sign)", drive: "On the Strip", setting: "Indoor & outdoor",
    vibe: ["Historic", "Redwood chapel", "Old Vegas", "Hollywood history"],
    priceFrom: null, priceLabel: null, guestMax: null,
    facts: [
      "Listed on the National Register of Historic Places in 1992. It's described as the oldest building on the Strip.",
      "Featured in Viva Las Vegas (1964) with Elvis Presley and Ann-Margret.",
      "Ceremony venues: The Chapel, The Garden, the Las Vegas Sign, and Harley-Davidson.",
      "Elvis or Johnny Cash impersonator officiant add-on: $200.",
    ],
    bestFor: "History buffs and old-Hollywood romantics who want a real chapel, not a theme.",
    description: `Long before the megaresorts, there was this little wooden chapel. It's warm redwood inside, with a steeple and a garden. It's been moved more than once as the Strip grew up around it, and it has outlived nearly everything that stood near it.

It's on the National Register of Historic Places, it was in an Elvis movie, and it still feels like a church instead of a set. If you want classic Vegas with a sense of occasion, this is the one.`,
    tips: [
      "Ask about the Las Vegas Sign venue if you want the sign photo built into your ceremony.",
      "The impersonator officiant is an add-on. Classic and kitsch are both on the menu.",
      "The redwood interior photographs warm. Brides in ivory tend to love it.",
    ],
    url: "https://littlechurchofthewest.com/", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "A Little White Wedding Chapel", slug: "little-white-wedding-chapel", category: "classic-chapels",
    area: "The Strip (north)", drive: "About 10 min from the center Strip", setting: "Indoor & outdoor",
    vibe: ["Iconic", "Celebrity", "Elvis", "Pink Cadillac"],
    priceFrom: 150, priceLabel: "Little White Chapel, Gazebo or Pink Cadillac ceremony", guestMax: null,
    facts: [
      "Has hosted weddings since 1951. It was sold in 2022 to Vegas Weddings and now operates as part of Wed Famously Chapels.",
      "Venues: the Little White Chapel, the larger Chapel Amore, an outdoor gazebo, and the Tunnel of Love drive-thru.",
      "Published ceremonies: Little White Chapel, Gazebo or Pink Cadillac $150 each; Amore Chapel $450; Elvis Tribute $495; Ultimate I Do $995.",
      "On 6/26/26 the chapel group scheduled about 130 weddings (News 3 Las Vegas).",
    ],
    bestFor: "Spontaneous, fun, budget-friendly weddings with serious Vegas pedigree.",
    description: `This is the chapel your aunt has heard of. Since 1951 the Little White Wedding Chapel has been the shorthand for getting married in Las Vegas, with a white steeple, a pink Cadillac and the kind of guest book the tabloids love.

It's also one of the best values in town. A ceremony starts at $150, and you can scale up to Elvis, a bigger chapel, or the whole production. It's quick, cheerful and unapologetically Vegas. That's exactly why people keep coming back for vow renewals.`,
    tips: [
      "Lucky-number dates (like 6/26/26) fill up fast here. Book early for special dates.",
      "The Pink Cadillac ceremony is the same price as the chapel, and twice the photo.",
      "Want more seats? Chapel Amore is the larger room.",
    ],
    url: "https://www.alittlewhitechapel.com/shop/packages", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "Tunnel of Love Drive-Thru", slug: "tunnel-of-love-drive-thru", category: "quirky-pop-culture",
    area: "The Strip (north), at A Little White Wedding Chapel", drive: "About 10 min from the center Strip", setting: "Outdoor (in your car)",
    vibe: ["Drive-thru", "Kitschy", "Spontaneous", "Only in Vegas"],
    priceFrom: 150, priceLabel: "Drive-Thru Tunnel of Love ceremony", guestMax: null,
    facts: [
      "Billed as \"The Original Drive-Thru Wedding.\" The window was added after a 1991 decision to accommodate a couple with a disability, and it first opened on Valentine's Day.",
      "Ceremonies happen at a drive-up window for cars, motorcycles, bicycles or walk-ups.",
      "The tunnel has a cherub-painted ceiling with starlights.",
      "Drive-Thru Tunnel of Love ceremony: $150.",
    ],
    bestFor: "Road-trippers, motorcycle couples, and anyone who wants the most Vegas story possible.",
    description: `Yes, it's real. You pull up, roll down the window and get married under a painted ceiling of cherubs and starlights. Then you drive off married. Bring the convertible, the motorcycle or the rental, or walk up.

It began as an accessibility idea and turned into a legend. It's fast, affordable and impossible to forget. Nobody has ever said "remember that ballroom?" at an anniversary dinner. Everybody tells the drive-thru story.`,
    tips: [
      "You still need a valid Clark County marriage license, and a witness, to make it legal.",
      "Classic cars and motorcycles photograph best. Some couples rent a convertible just for this.",
      "It's a great second ceremony: legal wedding at home, Vegas drive-thru for fun.",
    ],
    url: "https://www.alittlewhitechapel.com/page/chapels", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "Graceland Wedding Chapel", slug: "graceland-wedding-chapel", category: "classic-chapels",
    area: "Downtown / Fremont", drive: "10–15 min from the Strip", setting: "Indoor",
    vibe: ["Elvis", "Original", "Old Vegas", "Rock and roll"],
    priceFrom: null, priceLabel: null, guestMax: null,
    facts: [
      "Established in 1939. It bills itself as the oldest wedding chapel in Las Vegas.",
      "Calls itself the world's first Elvis wedding chapel. Elvis ceremonies began here in 1977.",
      "Offers Elvis and traditional weddings, vow renewals, non-legal and group ceremonies, plus a newer Storybook Wedding Chapel.",
      "Ceremonies are offered in Spanish, French, Portuguese, German, Italian and Romanian.",
    ],
    bestFor: "Elvis fans who want the original, and international couples who want vows in their own language.",
    description: `If you're going to be married by the King, you might as well go where it started. Graceland has been marrying couples since 1939, and its Elvis ceremonies date back to 1977. It's small and sincere, and there's a lot more heart in it than you'd expect from a sequined jumpsuit.

It also quietly serves couples from all over the world, with ceremonies in six languages besides English. For a destination wedding where Grandma can follow along, that's a big deal.`,
    tips: [
      "Ask for a non-legal ceremony if you're already married at home.",
      "Language ceremonies need planning, so mention it when you first inquire.",
      "Downtown location: pair it with a Fremont Street reception or a Neon Museum photo session.",
    ],
    url: "https://www.gracelandchapel.com/", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "Chapel of the Flowers", slug: "chapel-of-the-flowers", category: "classic-chapels",
    area: "The Strip (north)", drive: "5–10 min from the center Strip", setting: "Indoor & outdoor",
    vibe: ["Garden", "Classic", "Polished", "Full-service"],
    priceFrom: 299, priceLabel: "Basic package", guestMax: 101,
    facts: [
      "Says it has hosted ceremonies on the Strip for 65 years.",
      "Venues: The Glass Gardens (101 guests), La Capella Chapel (80), Gazebo (30), Victorian Chapel (30), Magnolia Chapel (20) and the Married In Las Vegas Sign (20).",
      "Published packages: Basic $299; Traditional $495; Romantic $650.",
      "Also sells off-site packages for Valley of Fire, Red Rock, the High Roller, the Grand Canyon and helicopters.",
    ],
    bestFor: "Couples who want a traditional-feeling wedding, done right, without planning stress.",
    description: `Chapel of the Flowers is the polished choice. It has six ceremony spaces on one property, a team that runs weddings like clockwork, and gardens that make you forget there's a boulevard outside.

What makes it unusual is how far it reaches. The same team will take you to Valley of Fire, Red Rock, the High Roller or the floor of the Grand Canyon. It's one booking with one coordinator, and the venue changes with your nerve.`,
    tips: [
      "The Glass Gardens (up to 101) is the pick for larger groups.",
      "Ask about its off-site packages. It's an easy way to book a desert or sky ceremony with one vendor.",
      "Compare packages by photo minutes and prints included, not just the headline price.",
    ],
    url: "https://www.littlechapel.com/", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "Viva Las Vegas Wedding Chapel", slug: "viva-las-vegas-wedding-chapel", category: "quirky-pop-culture",
    area: "The Strip (north)", drive: "About 10 min from the center Strip", setting: "Indoor",
    vibe: ["Theme weddings", "Theatrical", "LGBTQ+ inclusive", "Over the top"],
    priceFrom: null, priceLabel: null, guestMax: null,
    facts: [
      "Bills itself as \"The First Theme Wedding Chapel in the World\": Elvis, gothic, 1920s, intergalactic and more.",
      "Calls itself the first LGBTQ+ wedding venue in Las Vegas, since 1999.",
      "Every wedding or vow renewal includes the couple's names on the chapel's Strip marquee.",
      "Ceremonies are livestreamed, and the chapel is also on EarthCam.",
    ],
    bestFor: "Theme-wedding dreamers, LGBTQ+ couples, and anyone who wants their names in lights.",
    description: `Want a gothic wedding? A 1920s speakeasy wedding? A wedding in space? Viva Las Vegas has been building theme ceremonies longer than anyone, and it commits to the bit with costumes, sets and characters.

It has also been welcoming LGBTQ+ couples since 1999, long before it was legal to marry in Nevada. And every couple gets their names on the marquee. That's free billing on Las Vegas Boulevard, which is more than most headliners can say.`,
    tips: [
      "Livestreaming is built in, so share the link with family who can't travel.",
      "Pick your theme early. Costumes and characters need lead time.",
      "Get a photo of your names on the marquee. It's the souvenir.",
    ],
    url: "https://www.vivalasvegasweddings.com/", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "Chapel in the Clouds at The STRAT", slug: "strat-chapel-in-the-clouds", category: "sky-high",
    area: "The Strip (north)", drive: "About 10 min from the center Strip", setting: "Indoor & outdoor",
    vibe: ["Sky high", "Panoramic", "Thrill", "Dramatic"],
    priceFrom: 400, priceLabel: "\"Minimony\" base-of-tower ceremony, up to 10 people (Sun–Thu)", guestMax: null,
    facts: [
      "Bills itself as the only venue in Las Vegas 800 feet above the valley. It has two chapels on Tower Level 103.",
      "Also offers indoor/outdoor observation-deck weddings (Levels 108–109), private balcony weddings (Level 112) and thrill-ride weddings.",
      "Published pricing: Minimony $400 Sun–Thu / $475 Fri–Sat; \"Just the Two of Us\" observation-deck package from $450.",
      "A SkyJump entrance to your ceremony can be arranged.",
    ],
    bestFor: "Thrill-seekers and view-chasers. You can literally jump into your wedding.",
    description: `The STRAT puts your ceremony 800 feet above the valley. That's high enough that the Strip looks like a model of itself. There are chapels on Level 103, open-air decks above that, and for the brave, a SkyJump entrance to the altar.

Short of that, it's still one of the most dramatic views you can get married in front of. Sunset to city lights is the move. Prices start lower than you'd guess, especially midweek.`,
    tips: [
      "Sunday–Thursday is cheaper than Friday and Saturday.",
      "Time it for sunset if you want daylight and city lights in the same album.",
      "If anyone in your party is afraid of heights, an indoor chapel on 103 is the gentler option.",
    ],
    url: "https://thestrat.com/groups/weddings/ceremony-packages", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "High Roller Observation Wheel", slug: "high-roller-wheel", category: "sky-high",
    area: "The Strip (center), at The LINQ", drive: "On the Strip", setting: "Airborne cabin",
    vibe: ["Skyline", "Private cabin", "Modern", "Panoramic"],
    priceFrom: 1870, priceLabel: "High Roller ceremony package via Chapel of the Flowers", guestMax: null,
    facts: [
      "Ceremonies happen \"550 feet above the Center Strip\" in private wedding cabins with expedited boarding.",
      "Operated by Caesars Entertainment at The LINQ.",
      "Chapel of the Flowers sells a High Roller Wedding Ceremony package for $1,870.",
    ],
    bestFor: "Small wedding parties that want a moving, 360° view with no wind in the veil.",
    description: `The High Roller turns a ceremony into a slow orbit over the center Strip. You get a private glass cabin, your people, and a view that keeps changing while you say your vows. The ceremony and the whole skyline fit into one rotation.

It's enclosed and climate-controlled, so it works any month. It's also one of the few "sky" weddings where nobody needs to be brave about heights.`,
    tips: [
      "Book a cabin close to sunset for the full day-to-night sky.",
      "Cabin capacity sets your guest count, so confirm it before you send invites.",
      "Book through Caesars directly or bundle it with Chapel of the Flowers.",
    ],
    url: "https://www.caesars.com/linq/things-to-do/attractions/high-roller/weddings", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "Eiffel Tower at Paris Las Vegas", slug: "eiffel-tower-paris-las-vegas", category: "sky-high",
    area: "The Strip (center)", drive: "On the Strip", setting: "Indoor & outdoor",
    vibe: ["Parisian", "Romantic", "View", "Intimate"],
    priceFrom: null, priceLabel: null, guestMax: 90,
    facts: [
      "A half-scale Eiffel Tower whose viewing deck is 46 stories up.",
      "Paris Las Vegas offers five ceremony venues, including the top of the Eiffel Tower for intimate ceremonies.",
      "Other venues: La Chapelle Royale (up to 90 guests), La Chapelle Champagne (30), Arc de Triomphe with the tower as backdrop (25) and Le Cabaret Lounge (35, 21+).",
    ],
    bestFor: "Paris on a Vegas budget and timeline. Intimate, romantic and a little bit cheeky.",
    description: `You could fly to France. Or you could take an elevator to the top of a half-scale Eiffel Tower, look down on the Bellagio Fountains, and say "oui" by dinner time.

Paris Las Vegas plays the romance straight. The tower top is for the most intimate ceremonies, and there are chapels and an Arc de Triomphe venue below for bigger groups. It's a little tongue-in-cheek and a lot of fun. The Bellagio Fountains across the street will happily photobomb your first kiss.`,
    tips: [
      "The tower top is for very small groups. Bring guests to La Chapelle Royale (up to 90).",
      "Le Cabaret Lounge is 21+, so plan around younger guests.",
      "Evening ceremonies catch the Bellagio Fountains running across the Strip.",
    ],
    url: "https://www.caesars.com/paris-las-vegas/things-to-do/weddings", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "Maverick Helicopters Grand Canyon Wedding", slug: "maverick-helicopters-weddings", category: "sky-high",
    area: "Departs Las Vegas; ceremony at Grand Canyon West, AZ", drive: "About 4 hrs total, hotel to hotel", setting: "Airborne + canyon floor",
    vibe: ["Adventure", "Canyon floor", "Helicopter", "Intimate"],
    priceFrom: 4399, priceLabel: "Desert Dreams Grand Canyon wedding", guestMax: null,
    facts: [
      "The Desert Dreams Grand Canyon wedding starts at $4,399, with Silver, Gold and Platinum tiers. A sunset upgrade is +$400.",
      "The ceremony happens on the banks of the Colorado River, 3,500 feet below the rim of Grand Canyon West.",
      "The flight passes Lake Las Vegas, Hoover Dam, Lake Mead and Fortification Hill. It's about 4 hours hotel to hotel with a limo transfer.",
    ],
    bestFor: "Bucket-list elopements. The ceremony location you'll never top.",
    description: `You leave Las Vegas by limo, lift off by helicopter, cross Hoover Dam and Lake Mead, and drop 3,500 feet into the Grand Canyon. Then you get married on the bank of the Colorado River. You're back at your hotel in about four hours.

It isn't cheap and it isn't big; this is an elopement-scale adventure. But if you've ever wanted a wedding story that ends with "and then we flew home over the dam," this is it.`,
    tips: [
      "Ask about weight and seat limits early. Helicopters are precise about both.",
      "The sunset upgrade costs more, and the light is worth it.",
      "Weather can delay flights, so keep the day after open as a backup.",
    ],
    url: "https://www.maverickhelicopter.com/grand-canyon/weddings/desert-dreams-wedding", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "Papillon Helicopter Weddings", slug: "papillon-helicopter-weddings", category: "sky-high",
    area: "Strip flights / Grand Canyon West Rim, AZ", drive: "Departs Las Vegas", setting: "Airborne",
    vibe: ["Strip lights", "Helicopter", "Elopement", "Bucket list"],
    priceFrom: 1249, priceLabel: "Las Vegas helicopter wedding (over the Strip)", guestMax: null,
    facts: [
      "Las Vegas helicopter wedding packages start at $1,249: the ceremony happens on a helicopter tour over the Strip.",
      "Grand Canyon weddings start at $4,799, on a private plateau 3,200 feet below the West Rim.",
      "Packages include a dedicated wedding planner, florals, photo/video and transportation.",
    ],
    bestFor: "Couples who want an airborne ceremony over the Strip at a lower price than a canyon trip.",
    description: `Papillon gives you two ways to say "I do" from a helicopter. The Strip flight marries you mid-air over the lights, and it's the most affordable airborne wedding in this guide. The Grand Canyon version sets you down on a private plateau below the West Rim.

Both come with a dedicated planner, flowers, photo and video, and transport. That's a lot of moving parts to have someone else carry when the venue is literally moving.`,
    tips: [
      "The Strip flight is best after dark. Ask about night departures.",
      "Cabin noise is real. Ask how vows and audio are handled for your video.",
      "Have a backup date ready in case of high winds.",
    ],
    url: "https://www.papillon.com/helicopter-weddings-proposals/las-vegas-helicopter-wedding/", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "Valley of Fire State Park", slug: "valley-of-fire-state-park", category: "desert-outdoors",
    area: "Overton / Moapa Valley", drive: "About 1 hr from the Strip", setting: "Outdoor",
    vibe: ["Red rock", "Desert", "Dramatic", "Elopement"],
    priceFrom: 2399, priceLabel: "Valley of Fire package via Chapel of the Flowers", guestMax: null,
    facts: [
      "Established in 1935, it's known for 40,000 acres of red Aztec sandstone, petrified trees and petroglyphs more than 2,000 years old.",
      "The park closes to all visitors December 1–14 each year, and weddings are prohibited during the closure.",
      "Weddings are a permitted commercial activity. A Special Use Permit carries a $25 processing fee; apply 60 days ahead (Nevada State Parks).",
      "Chapel of the Flowers' Valley of Fire package ($2,399) includes a 45-minute photoshoot, a limo for the couple plus up to 6 guests, and park fees and gratuities. It needs 5 days' notice.",
      "The West Entrance is closed Monday–Thursday from Aug 3, 2026 through the end of 2026.",
    ],
    bestFor: "Elopements and small weddings that want Mars-red rock and zero buildings in the shot.",
    description: `Nevada's oldest state park looks like it was set on fire and left to cool. The sandstone runs from rust to coral to almost purple, depending on the hour. There are petroglyphs older than anything in Las Vegas by about two thousand years.

Getting married here takes a permit or a planner who handles one, plus a willingness to trade convenience for awe. Most couples go small: an officiant, a photographer, maybe a handful of guests in a limo. In return you get photos that look like another planet.`,
    tips: [
      "December 1–14 is off-limits every year. Don't plan around it.",
      "Golden hour is the reason to come. Midday light is flat and hot.",
      "Professional photography in the park needs its own permit, so make sure your planner or photographer has it covered.",
    ],
    url: "https://www.littlechapel.com/wedding-packages/valley-of-fire", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "Red Rock Canyon National Conservation Area", slug: "red-rock-canyon", category: "desert-outdoors",
    area: "West Las Vegas (Summerlin edge)", drive: "About 30 min from the Strip", setting: "Outdoor",
    vibe: ["Mountain desert", "Sandstone", "Scenic", "Nature"],
    priceFrom: 3899, priceLabel: "Red Rock package via Chapel of the Flowers (+$900 venue fee)", guestMax: null,
    facts: [
      "Designated in 1990 as Nevada's first National Conservation Area. It has a 13-mile scenic drive.",
      "Weddings need a BLM Special Recreation Permit. The limits are 10 commercial wedding permittees (currently full) and 100 noncommercial wedding permits.",
      "Scenic Drive timed-entry reservations are required October 1–May 31.",
      "Chapel of the Flowers' Red Rock package is $3,899 plus a $900 venue fee, and includes a helicopter ride for the couple plus 2 guests.",
    ],
    bestFor: "Nature lovers who want big desert scenery 30 minutes from their hotel.",
    description: `Red Rock is where Las Vegas goes to breathe. Its striped sandstone cliffs rise straight out of the desert at the city's western edge. It's close enough for a morning ceremony and an afternoon pool party.

It's also federally protected land, which keeps it beautiful and keeps wedding permits limited. The simplest path is a permitted commercial operator, which is the job of the 10 commercial wedding permittees. Couples who'd rather do it themselves can apply for one of the noncommercial permits through the BLM.`,
    tips: [
      "From October to May, everyone in your party needs a timed-entry reservation for the Scenic Drive.",
      "Wedding portraits by a pro photographer need a separate film permit, which can take up to 60 days.",
      "Pack water and shade. Even spring ceremonies get warm on the rocks.",
    ],
    url: "https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "The Mob Museum", slug: "the-mob-museum", category: "historic-iconic",
    area: "Downtown / Fremont", drive: "About 15 min from the Strip", setting: "Indoor",
    vibe: ["Historic courtroom", "Noir", "Organized crime", "Quirky-elegant"],
    priceFrom: 700, priceLabel: "Wedding package, up to 10 people", guestMax: 120,
    facts: [
      "Housed in the restored former federal courthouse and U.S. Post Office.",
      "The ceremony and reception happen in the historic Courtroom. The Vintage Vegas and Champagne packages allow up to 120 guests.",
      "Wedding packages start at $700 for up to 10 people.",
      "Nevada Magazine named it \"Best Place to Get Married\" in Best of Nevada 2019.",
    ],
    bestFor: "Couples who want a historic, dramatic room with a wink. \"You may now sentence the groom.\"",
    description: `You'll say your vows in a real federal courtroom, the same restored room where history happened, inside one of downtown's grandest old buildings. Dark wood, tall windows and a judge's bench make it formal and theatrical at once.

The museum leans into the joke just enough. The puns write themselves, and so do the toasts. It's also a smart value: intimate packages start at $700, and larger ones fit up to 120 guests.`,
    tips: [
      "Ask about after-hours museum access for guests. It turns the reception into an activity.",
      "Downtown pairs well with a Neon Museum photo session nearby.",
      "The courtroom's natural light is limited. Plan for an evening, candlelit look.",
    ],
    url: "https://themobmuseum.org/events/private-events/weddings/", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "AREA15", slug: "area15", category: "quirky-pop-culture",
    area: "Just west of the Strip (S. Rancho Dr.)", drive: "5–10 min from the Strip", setting: "Indoor & outdoor",
    vibe: ["Immersive", "Projection mapping", "Futuristic", "Party"],
    priceFrom: 15500, priceLabel: "\"Twinkle\" package, 25–50 guests (++)", guestMax: 250,
    facts: [
      "The Portal has 360-degree projection mapping that can be themed for weddings.",
      "Published packages: Twinkle (25–50 guests) from $15,500++; Cosmic (75–120) from $28,000++; Galaxy in the Portal (120–250) from $40,000++.",
      "The To the Moon package (80–250 guests, from $50,000++) uses the Altair Sky Lounge, built around a repurposed Burning Man art plane.",
      "Address: 3215 South Rancho Dr.",
    ],
    bestFor: "Big, unforgettable party weddings. Your reception becomes the after-party everyone talks about.",
    description: `AREA15 is part art installation, part nightclub, part spaceship. Its Portal room wraps your ceremony in 360-degree projections that can turn into a galaxy, a garden or anything your designer dreams up.

This is a full-production wedding, priced like one, and it delivers a night your guests will still be describing at the next family reunion. If the dance floor matters more than the aisle, start here.`,
    tips: [
      "\"++\" means tax and service charges come on top. Budget for both.",
      "Ask what the projection content includes and what costs extra to customize.",
      "It's 5–10 minutes from the Strip, so run shuttles from your room-block hotel.",
    ],
    url: "https://www.area15.com/plan-an-event/weddings", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "Omega Mart by Meow Wolf", slug: "omega-mart-meow-wolf", category: "quirky-pop-culture",
    area: "Inside AREA15, just west of the Strip", drive: "5–10 min from the Strip", setting: "Indoor",
    vibe: ["Surreal", "Art-filled", "Playful", "Immersive"],
    priceFrom: null, priceLabel: null, guestMax: 750,
    facts: [
      "Meow Wolf's second installation. It opened inside AREA15 in 2021.",
      "The elopement package includes your choice of ceremony spots in the exhibit, an officiant who registers the legal documents, a photographer, admission for the couple and luxury-vehicle pickup.",
      "A full buyout for up to 750 guests is an option for weddings.",
    ],
    bestFor: "Creative couples who want an elopement that feels like walking into a dream.",
    description: `Omega Mart starts out as a grocery store and then the freezer door opens into another world. The whole exhibit is built on surprise. That makes it a strange and wonderful place to elope: you pick your favorite corner of the weird and get married there.

The elopement package covers the essentials, from the officiant who files your paperwork to the photographer and the pickup. For a big crowd, there's a full buyout for up to 750 guests.`,
    tips: [
      "Walk through as a visitor first. Choosing your ceremony spot is half the fun.",
      "Lighting changes room to room, so ask the photographer about low-light coverage.",
      "Pair it with an AREA15 reception for one-stop logistics.",
    ],
    url: "https://meowwolf.com/visit/las-vegas/private-events", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "Bellagio", slug: "bellagio", category: "strip-luxury",
    area: "The Strip (center)", drive: "On the Strip", setting: "Indoor & outdoor",
    vibe: ["Classic luxury", "Fountains", "Elegant", "Timeless"],
    priceFrom: null, priceLabel: null, guestMax: 100,
    facts: [
      "East Chapel holds up to 20 guests, and South Chapel up to 80. Each includes 30 minutes of ceremony time and a live broadcast.",
      "Terrazza di Sogno is a private terrace with the Bellagio Fountains as a backdrop, for up to 40 guests (24 seated).",
      "The Fountain Courtyard package holds up to 80 guests (100 with an added fee).",
      "The Conservatory is offered for proposals only, not ceremonies.",
    ],
    bestFor: "Timeless, elegant weddings with the most famous water show in the world behind you.",
    description: `Bellagio is classic Las Vegas romance at its most refined. It's European in style, Las Vegas in scale, and has the fountains everyone pictures when they picture this city.

The private terrace is the showstopper: a small wedding with the fountains dancing behind your vows. The chapels handle bigger groups with Bellagio polish and a live broadcast for family back home. Want to propose first? The Conservatory is reserved for exactly that.`,
    tips: [
      "Terrazza di Sogno seats only 24, so it's best for small weddings.",
      "Ask when the fountain shows run during your ceremony window.",
      "Planning a proposal-then-wedding trip? The Conservatory handles proposals.",
    ],
    url: "https://bellagio.mgmresorts.com/en/meetings-groups/weddings.html", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "SAHARA Las Vegas", slug: "sahara-las-vegas", category: "strip-luxury",
    area: "The Strip (north)", drive: "On the Strip", setting: "Indoor & outdoor",
    vibe: ["Rooftop pools", "Lounges", "Theaters", "North Strip"],
    priceFrom: null, priceLabel: null, guestMax: 1824,
    facts: [
      "SAHARA books weddings and receptions through its events team. Pricing is by custom quote, and no wedding package prices are published.",
      "AZILO Ultra Pool is 29,225 sq ft with an event capacity of 1,824, 10 cabanas, three bungalows and three LED screens. AZILO Ultra Lounge beside it is 3,819 sq ft and holds up to 240.",
      "Two rooftop pools: Alexandria Pool holds up to 300, with views of downtown and the mountains. Retro Pool Lounge is 10,000 sq ft for up to 250, with a VIP cabana, DJ booth and full bar.",
      "Blanca Tower Penthouse is a 2,156 sq ft two-bedroom suite with two roof decks, a fireplace and a hot tub, for up to 100 guests.",
      "The Theatre holds up to 999. The Magic Mike Live Theater is a two-story, 15,040 sq ft room for 446, with a 3,000 sq ft lounge for 150.",
      "Lounges: CASBAR Lounge (4,140 sq ft, up to 280), Paradise Lounge (1,944 sq ft, up to 150) and The Tangier (750 sq ft, up to 55).",
      "Sizes and capacities come from SAHARA's Unique Event Venues brochure dated April 2023, the version linked from its weddings page on the check date. Confirm the current list of spaces with the events team.",
    ],
    bestFor: "Couples who'd rather take over a pool, a rooftop or a lounge than book a ballroom.",
    description: `SAHARA sits at the north end of the Strip, and its wedding spaces aren't chapels. They're the resort's pools, lounges, theaters and a penthouse, each bookable as a private venue.

The range is the point. A wedding of 50 fits a lobby lounge or the penthouse roof decks. A few hundred guests fit a rooftop pool with views of downtown and the mountains. The largest space, AZILO Ultra Pool, is built for night events, with cabanas, bungalows and LED screens. Everything is priced by quote, so the first step is telling the events team your date, guest count and which space you have in mind.`,
    tips: [
      "Pricing is quote-only. Ask for the space fee, the food and beverage minimum and room-block terms in the same email.",
      "The published capacities are event capacities, not seated-dinner counts. Ask for the seated number for your space.",
      "The pool spaces are open-air. For June through August, ask about an evening start.",
      "The Magic Mike Live Theater is a working show room, so ask which dates it's available.",
    ],
    url: "https://www.saharalasvegas.com/meetings-events/weddings-special-events", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "The Venetian Resort (Gondola Weddings)", slug: "venetian-gondola-weddings", category: "strip-luxury",
    area: "The Strip (center)", drive: "On the Strip", setting: "Indoor & outdoor",
    vibe: ["Italian", "Gondola", "Romantic", "Grand"],
    priceFrom: 950, priceLabel: "Gondola Bianca package (Mon–Thu)", guestMax: 100,
    facts: [
      "Gondola Bianca packages start at $950 Monday–Thursday, with exclusive use of the Signature Venetian White Wedding Gondola for the couple.",
      "Wedding Chapel with Fountain View packages start at $2,150 Mon–Thu for up to 30 guests. The chapel holds up to 100 in larger packages.",
      "Other venues: Pool Garden Courtyard (100 guests), Waterfall Atrium (60) and the Wedding Fountain Terrace (40).",
    ],
    bestFor: "Romantics who want Venice, gondolier included, without the jet lag.",
    description: `A white gondola, a gondolier and a canal under a painted Venetian sky: the Venetian's gondola wedding is pure, joyful theater. It's also one of the most affordable "only in Vegas" experiences on the Strip.

For a bigger group, the resort has a chapel with a fountain view, a waterfall atrium and a pool garden courtyard. That's a lot of Italian romance in one address, and your guests can walk to the reception.`,
    tips: [
      "Monday–Thursday pricing is lower. The gondola doesn't know it's a weekday.",
      "The gondola is for the couple. Guests watch from the bridges and walkways.",
      "Ask whether the gondolier will sing. (It's a Venetian tradition worth asking about.)",
    ],
    url: "https://www.venetianlasvegas.com/resort/celebrations/weddings/wedding-packages.html", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "Caesars Palace", slug: "caesars-palace-weddings", category: "strip-luxury",
    area: "The Strip (center)", drive: "On the Strip", setting: "Indoor & outdoor",
    vibe: ["Roman", "Garden", "Opulent", "Iconic"],
    priceFrom: null, priceLabel: null, guestMax: 196,
    facts: [
      "Juno Garden seats up to 128 among tropical landscaping and classic Roman architecture.",
      "Venus Garden holds up to 115 guests, with a Roman-style temple, koi pond, fountain and stone aisle.",
      "The Temple Pool venue, in front of the Pool of the Gods, holds up to 100. Ceremonies are also offered at the Main Fountains.",
      "Indoor chapels: Classico (196 guests) and Tuscana (70).",
    ],
    bestFor: "Big, glamorous weddings with Roman grandeur and space for the whole guest list.",
    description: `Caesars has been the definition of Vegas glamour for generations, and its wedding venues lean all the way in. There are marble temples, garden colonnades, a koi pond and a stone aisle. Its pools feel like they belong to actual gods.

With chapels up to 196 guests and gardens over 100, it's one of the few Strip resorts that can host a large wedding with real outdoor ceremony options. Your guests can stay, eat, swim and celebrate without leaving the property.`,
    tips: [
      "The gardens are best in spring and fall. Summer ceremonies want early-morning or evening times.",
      "Venus Garden's temple and koi pond make the most distinctive backdrop.",
      "Ask about room-block perks if most of your guests will stay on property.",
    ],
    url: "https://www.caesars.com/caesars-palace/things-to-do/weddings", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "Spring Mountain Ranch State Park", slug: "spring-mountain-ranch-state-park", category: "desert-outdoors",
    area: "Red Rock / Blue Diamond area", drive: "35–40 min from the Strip", setting: "Outdoor",
    vibe: ["Historic ranch", "Lawn", "Mountain views", "Rustic"],
    priceFrom: 225, priceLabel: "Group use area ($200) + Special Use Permit fee ($25), plus vehicle entry", guestMax: 200,
    facts: [
      "A former working ranch and luxury retreat whose owners included Vera Krupp and Howard Hughes.",
      "The historic Sandstone Ranch was listed on the National Register of Historic Places in 1976.",
      "Park rules require weddings to reserve the group use area (up to 200 people, $200 plus per-vehicle entry). The event lawn and stage need a Special Use Permit.",
      "The park reopened May 5, 2026.",
    ],
    bestFor: "DIY couples who want a historic ranch lawn under red cliffs, at a park-permit price.",
    description: `Tucked under the Red Rock escarpment, Spring Mountain Ranch is a green lawn, shade trees and a sandstone ranch house with a past. Howard Hughes owned it once. Now it belongs to Nevada State Parks, which means the setting is spectacular and the price is set by a fee schedule, not a ballroom.

This is the do-it-yourself option. You handle the permit, the rentals and the vendors. In return you get a historic ranch wedding at a fraction of resort pricing.`,
    tips: [
      "Reserve the group use area first, then apply for the Special Use Permit for the lawn and stage.",
      "Every guest vehicle pays park entry. Consider a shuttle.",
      "It's 35–40 minutes from the Strip, so plan transport and timing for guests.",
    ],
    url: "https://parks.nv.gov/parks/spring-mountain-ranch", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "Floyd Lamb Park at Tule Springs", slug: "floyd-lamb-park", category: "desert-outdoors",
    area: "Northwest Las Vegas", drive: "About 30 min from the Strip", setting: "Indoor & outdoor",
    vibe: ["Lakes", "Peacocks", "Historic ranch", "Shady oasis"],
    priceFrom: 600, priceLabel: "Courtyard + Gazebo, 2 hrs, Mon–Thu (City rate card)", guestMax: 550,
    facts: [
      "A 680-acre city park with lakes and the historic Tule Springs Ranch.",
      "The restored Hay Barn and the Courtyard Gazebo are rented through the City of Las Vegas Park Special Events Unit.",
      "City rate card: Hay Barn + Lakeside Courtyard + Gazebo, Fri–Sun, $2,250 for 5 hours (up to 550 people). Courtyard + Gazebo, Mon–Thu, $600 for 2 hours (up to 275).",
      "Music must end by 7 p.m. in summer and 4 p.m. in winter. Park entry is $6 per vehicle.",
    ],
    bestFor: "Budget-smart rustic weddings with shade, water and a barn reception.",
    description: `Floyd Lamb is the Las Vegas nobody expects: shady cottonwoods, quiet ponds, roaming peacocks and an old ranch with a restored hay barn. It feels miles from the Strip because it nearly is.

Because the city runs it, prices come from a public rate card instead of a sales pitch. That makes it one of the best values in the valley for a barn reception with a real ceremony setting. Just mind the early music curfew.`,
    tips: [
      "The rate card on the city site is dated 2022, so reconfirm pricing with the Park Special Events Unit before you book.",
      "The music curfew (7 p.m. summer, 4 p.m. winter) shapes your timeline. Plan an after-party elsewhere.",
      "Weekday packages are dramatically cheaper.",
    ],
    url: "https://www.lasvegasnevada.gov/Residents/Parks-Facilities/Floyd-Lamb-Park", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "Lake Mead Cruises: Desert Princess", slug: "lake-mead-cruises-desert-princess", category: "desert-outdoors",
    area: "Boulder City area (Lake Mead)", drive: "About 40 min from the Strip", setting: "Indoor & outdoor (on the water)",
    vibe: ["Paddle wheeler", "Lake", "Scenic", "Relaxed"],
    priceFrom: null, priceLabel: null, guestMax: 150,
    facts: [
      "Ceremonies and receptions happen aboard the Desert Princess, a Mississippi River–style paddle wheeler, for up to 150 guests.",
      "The budget Top Deck Wedding is a 30–45 minute private top-deck ceremony after a scheduled scenic cruise.",
      "Operated by Aramark as an authorized National Park Service concessioner in Lake Mead National Recreation Area.",
    ],
    bestFor: "A relaxed lake wedding: desert mountains, open water and a reception that floats.",
    description: `Lake Mead makes for a different kind of desert wedding: blue water against bare mountains, a breeze off the lake, and a paddle wheeler that turns the reception into a cruise.

The Desert Princess holds up to 150 guests for a full wedding. The Top Deck option gives smaller groups a private ceremony on the upper deck at a lower price. It's an easy, scenic half-day from the Strip that pairs well with a Hoover Dam visit for out-of-town guests.`,
    tips: [
      "Lake Mead is a National Recreation Area, and park entrance fees apply to guest vehicles.",
      "Top Deck weddings follow a scheduled cruise, so confirm timing before booking flights.",
      "Bring layers. The lake breeze can be cool in winter evenings.",
    ],
    url: "https://www.lakemeadcruises.com/cruises/weddings/", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "Welcome to Fabulous Las Vegas Sign", slug: "welcome-to-fabulous-las-vegas-sign", category: "historic-iconic",
    area: "The Strip (south)", drive: "About 5 min from the south Strip", setting: "Outdoor",
    vibe: ["Iconic", "Quick", "Photo op", "Vegas classic"],
    priceFrom: null, priceLabel: null, guestMax: null,
    facts: [
      "Little Church of the West lists the Las Vegas Sign as one of its four ceremony venues.",
      "Chapel of the Flowers also lists a \"Married In Las Vegas Sign\" venue (up to 20 guests) on its own property. That's a different sign, but the same idea.",
    ],
    bestFor: "Quick, joyful ceremonies with the most famous photo backdrop in Nevada.",
    description: `It's the most photographed sign in the state, and for good reason. Getting married in front of it says exactly where you were and exactly what kind of fun you were having.

Ceremonies here run through chapel operators, since it's a public landmark with a parking lot and a line of tourists. That's part of the charm. Expect an audience of strangers who will absolutely cheer for you.`,
    tips: [
      "Book through a chapel that lists the sign as a venue. They know the timing and logistics.",
      "Early morning has the shortest line and the softest light.",
      "Consider it as a photo stop after a chapel ceremony rather than the ceremony itself.",
    ],
    url: "https://littlechurchofthewest.com/las-vegas-sign-wedding/", checked: "2026-10-04", status: "listed", featured: false,
  },
  {
    name: "The Big Apple Coaster at New York-New York", slug: "big-apple-coaster-wedding", category: "quirky-pop-culture",
    area: "The Strip (south)", drive: "On the Strip", setting: "Indoor & outdoor",
    vibe: ["Thrill ride", "Adrenaline", "Quirky", "Only in Vegas"],
    priceFrom: null, priceLabel: null, guestMax: null,
    facts: [
      "New York-New York offers wedding ceremonies on The Big Apple Coaster. Coaster weddings are booked by phone at 702.740.6616.",
      "The coaster tops 67 mph, with a 180-degree \"heartline\" twist and a 203-foot drop.",
      "Riders must be at least 54 inches tall.",
      "No wedding price is published. A standard ride ticket is $25.",
    ],
    bestFor: "Couples who'd rather scream their vows than whisper them.",
    description: `Most couples hold hands down the aisle. Here you hold on for dear life. The Big Apple Coaster loops around the New York-New York skyline on the Strip, and the resort will build a ceremony around it.

It's the most literal version of "ride or die" in Las Vegas. Expect a short, high-energy ceremony and a lot of photos of your faces mid-drop. Guests can watch from the ground, which is honestly the better seat.`,
    tips: [
      "Book by phone (702.740.6616). There's no online booking or published wedding price.",
      "Everyone riding must be at least 54 inches tall, so check with any young ring bearers first.",
      "Secure veils, hats and phones. The coaster tops 67 mph.",
      "Plan the photos on the ground before or after. Mid-ride photos are a bonus, not the plan.",
    ],
    url: "https://newyorknewyork.mgmresorts.com/en/entertainment/the-big-apple-coaster-and-arcade.html", checked: "2026-10-13", status: "listed", featured: false,
  },
  {
    name: "The Punk Rock Museum", slug: "punk-rock-museum", category: "quirky-pop-culture",
    area: "Arts District edge (Western Ave.)", drive: "About 10 min from the Strip", setting: "Indoor",
    vibe: ["Punk", "Music history", "Irreverent", "Elopement"],
    priceFrom: 500, priceLabel: "Partners in Crime elopement", guestMax: 30,
    facts: [
      "The $500 Partners in Crime package is a quick, no-frills elopement in the museum's Gallery.",
      "Till Death Do Us Punk ($2,700) includes one hour of private access to the museum's Chapel and Bar for up to 25 guests, with up to 5 more at $75 each.",
      "Packages don't include an officiant, marriage license filing or a photographer.",
      "For $1,000, couples can pick a punk from the museum's list to be their witness.",
    ],
    bestFor: "Couples whose first dance is a mosh pit.",
    description: `The Punk Rock Museum is a love letter to a genre that never asked permission, and it'll marry you on the same terms. Elope in the Gallery for a few hundred dollars, or take over the museum's own Chapel and Bar for an hour with your crew.

The best detail: you can pay for an actual punk from the museum's list to sign as your witness. That's a wedding story nobody else at brunch will have.`,
    tips: [
      "Bring your own officiant and photographer. Neither is included.",
      "The Chapel package caps at 25 guests plus 5 add-ons, so trim the list early.",
      "Ask which punks are on the witness list for your date before you pay for that add-on.",
      "File your marriage license yourself after the ceremony. The museum doesn't do it.",
    ],
    url: "https://www.thepunkrockmuseum.com/get-married-at-the-museum", checked: "2026-10-13", status: "listed", featured: false,
  },
  {
    name: "Lucky Little Wedding Chapel", slug: "lucky-little-wedding-chapel", category: "classic-chapels",
    area: "Downtown / Fremont", drive: "10–15 min from the Strip", setting: "Indoor",
    vibe: ["Budget", "Quick", "Classic chapel", "Downtown"],
    priceFrom: 99, priceLabel: "Lucky Mini (couple only)", guestMax: 26,
    facts: [
      "The Lucky Mini package is listed at $99 for the couple only on the packages page. The homepage shows it at $129, so confirm the price when you book.",
      "Packages work for legal weddings, vow renewals and commitment ceremonies.",
      "The larger packages allow up to 26 guests.",
      "The officiant's donation is a minimum of $60 and isn't included in package prices.",
    ],
    bestFor: "Couples who want a real chapel wedding for less than a nice dinner on the Strip.",
    description: `Lucky Little is the downtown chapel for couples who want the classic Vegas chapel moment without the classic Vegas bill. The entry package is just the two of you, and the bigger packages fit a small crowd.

It handles legal weddings, vow renewals and commitment ceremonies, so it works whether you're here to make it official or just to make it memorable.`,
    tips: [
      "Budget the officiant's donation separately. It's at least $60 on top of any package.",
      "The site lists two different prices for the Lucky Mini ($99 and $129). Ask which applies before you pay.",
      "Bringing guests? Check which package allows your headcount. The top tier holds 26.",
    ],
    url: "https://www.luckylittlechapel.com/packages/", checked: "2026-10-13", status: "listed", featured: false,
  },
  {
    name: "The Little Vegas Chapel", slug: "the-little-vegas-chapel", category: "classic-chapels",
    area: "Downtown / Arts District", drive: "About 10 min from the Strip", setting: "Indoor",
    vibe: ["Elvis", "Themed rooms", "Budget", "Fun"],
    priceFrom: 99, priceLabel: "Short & Sweet special (legal ceremony, up to 2 guests)", guestMax: 24,
    facts: [
      "Its Elvis weddings are officially licensed by Elvis Presley Enterprises.",
      "The $99 Short & Sweet special covers a legal ceremony with a maximum of 2 guests.",
      "Imperial Chapel packages allow up to 24 guests.",
      "It offers legal weddings, vow renewals and pretend weddings.",
      "A Halloween-themed special, Ghoulishly Ever After ($189), takes place in a Halloween-themed Sweetheart room.",
    ],
    bestFor: "Couples who want Elvis, a theme, or both, on a chapel budget.",
    description: `The Little Vegas Chapel leans all the way into the fun side of a Vegas wedding. Its Elvis ceremonies are officially licensed by Elvis Presley Enterprises, and its themed rooms change the mood from classic chapel to something closer to a costume party.

There's a budget special for a quick legal ceremony and bigger chapel packages for up to 24 guests. It also does pretend weddings, which is exactly what it sounds like and more popular than you'd think.`,
    tips: [
      "The $99 special is legal ceremonies only, with 2 guests at most. Bring more people? Look at the Imperial Chapel packages.",
      "Want Elvis? Ask for the licensed Elvis package specifically.",
      "Getting married around Halloween? Ask about the Ghoulishly Ever After special.",
    ],
    url: "https://www.thelittlevegaschapel.com/wedding-specials/", checked: "2026-10-13", status: "listed", featured: false,
  },
  {
    name: "Circa Resort & Casino (Legacy Club)", slug: "circa-legacy-club", category: "sky-high",
    area: "Downtown / Fremont", drive: "10–15 min from the Strip", setting: "Indoor & outdoor",
    vibe: ["Rooftop", "Skyline views", "Adults only", "Downtown"],
    priceFrom: null, priceLabel: null, guestMax: null,
    facts: [
      "Circa lists the Legacy Club, its rooftop lounge on the 60th floor, among its wedding spaces.",
      "Wedding spaces also include ballrooms and bridal suites. The Galaxy Terrace is 1,677 sq ft and sits next to the largest ballroom.",
      "Everyone in the wedding group must be 21 or older.",
      "No wedding prices are published. Pricing is by inquiry.",
    ],
    bestFor: "Adults-only crowds who want downtown's skyline from 60 floors up.",
    description: `Circa is the newer, taller face of downtown Las Vegas, and its Legacy Club rooftop looks out over the whole city from the 60th floor. For a wedding, that means a skyline backdrop without the Strip's crowds at street level.

Circa is adults-only, and that applies to your guests too. If your list is 21-and-up, it's a polished downtown alternative to the big Strip resorts, with ballrooms and a terrace for the reception.`,
    tips: [
      "Check your guest list first: every guest must be 21 or older.",
      "Ask specifically about using the Legacy Club for the ceremony. It's listed as a wedding space, but availability depends on the lounge's schedule.",
      "Pricing is by inquiry. Ask for the space fee, food and beverage minimum and room-block terms together.",
    ],
    url: "https://www.circalasvegas.com/weddings-receptions/", checked: "2026-10-13", status: "listed", featured: false,
  },
  {
    name: "Vegas Balloon Rides (Private Sunrise Flight)", slug: "vegas-balloon-rides", category: "sky-high",
    area: "Mojave Desert, west of Las Vegas", drive: "About 1 hr west of the Strip (transport included)", setting: "Airborne",
    vibe: ["Hot air balloon", "Sunrise", "Intimate", "Adventure"],
    priceFrom: 1999, priceLabel: "per person, VIP Private Sunrise Flight (up to 5 passengers)", guestMax: 5,
    facts: [
      "The operator promotes its private sunrise flight for proposals and weddings.",
      "The VIP Private Sunrise Flight costs $1,999 per person for up to 5 passengers and includes limo pickup and French champagne.",
      "Bigger parties need a custom quote from the office.",
      "Flights need stable winds under 10 knots and are canceled in unsafe weather.",
      "Passengers must be at least 6 years old and no more than 280 lbs. Pregnant passengers can't fly.",
    ],
    bestFor: "Couples who want sunrise over the Mojave and nobody else in the basket.",
    description: `A hot air balloon at sunrise is about as quiet as Las Vegas ever gets. The private flight takes off west of the city and drifts over the Mojave as the light comes up, with room for the two of you and a few others.

It's a small, early, weather-dependent kind of wedding: a few passengers, a dawn pickup, and champagne included. Have a backup date in mind, because the wind gets the final vote.`,
    tips: [
      "The price is per person. Multiply by everyone in the basket.",
      "Keep a backup date. Flights are canceled when winds aren't under 10 knots.",
      "Check the passenger rules before you invite anyone: 6 or older, under 280 lbs, and no pregnant passengers.",
      "Bring your own officiant if you want a legal ceremony aloft, and confirm the plan with the operator.",
    ],
    url: "https://www.vegasballoonrides.com/hot-air-balloon-rides/", checked: "2026-10-13", status: "listed", featured: false,
  },
  {
    name: "Hilton Lake Las Vegas (Over-Water Chapel)", slug: "hilton-lake-las-vegas-chapel", category: "desert-outdoors",
    area: "Henderson (Lake Las Vegas)", drive: "About 30 min from the Strip", setting: "Indoor & outdoor",
    vibe: ["Lakeside", "Over-water chapel", "Resort", "Garden"],
    priceFrom: null, priceLabel: null, guestMax: 220,
    facts: [
      "The resort says it has the only over-water wedding chapel in Las Vegas.",
      "The Wedding Chapel is 1,558 sq ft and seats up to 220 guests theater-style.",
      "Indoor spaces, outdoor spaces and landscaped gardens are available for weddings.",
      "For receptions, the Grand Ballroom seats up to 840 at a banquet. No wedding prices are published.",
    ],
    bestFor: "Couples who want water views and a resort weekend without the Strip.",
    description: `Lake Las Vegas feels like a different city: a man-made lake ringed by hills in Henderson, half an hour from the Strip. The Hilton there has a wedding chapel built over the water, which it bills as the only one in Las Vegas.

It's a full resort, so the ceremony, reception and guest rooms can all sit on one property, and nobody has to cross a casino floor in formalwear.`,
    tips: [
      "Pricing is by inquiry. Ask for chapel-only and ceremony-plus-reception quotes side by side.",
      "The chapel seats 220, so it handles a big guest list that a downtown chapel can't.",
      "Book a room block early if guests are flying in. Lake Las Vegas has fewer hotels than the Strip.",
    ],
    url: "https://www.hilton.com/en/hotels/laslkhf-hilton-lake-las-vegas-resort-and-spa/events/weddings/", checked: "2026-10-13", status: "listed", featured: false,
  },
  {
    name: "Spillway House at Hoover Dam", slug: "spillway-house-hoover-dam", category: "historic-iconic",
    area: "Hoover Dam (Nevada–Arizona line)", drive: "About 45 min from the Strip", setting: "Indoor",
    vibe: ["Landmark", "Lake Mead views", "Engineering marvel", "Permit required"],
    priceFrom: null, priceLabel: null, guestMax: 200,
    facts: [
      "The Bureau of Reclamation lists weddings among the activities that need a Commercial Use Authorization at Hoover Dam.",
      "The Spillway House holds up to 200 guests in nearly 6,000 sq ft, with views of Lake Mead and the dam.",
      "Every event needs an approved permit with a minimum 4-week lead time. Reclamation recommends booking the Spillway House at least 3 months ahead.",
      "The use application fee is $100 and non-refundable. Recovered labor costs are extra.",
      "Organizers need a certificate of insurance for at least $1,000,000 in general liability naming the government as additional insured.",
    ],
    bestFor: "Couples who want a national landmark in the background and don't mind paperwork.",
    description: `Hoover Dam is one of the most recognizable structures in the country, and the Bureau of Reclamation rents out the Spillway House right next to it for events, weddings included. The building looks out over Lake Mead and the dam itself.

This is a federal facility, so it runs on permits, insurance certificates and lead times. Plan it like a project: a few months ahead, with a coordinator who has done federal permits before.`,
    tips: [
      "Start at least 3 months out. The permit alone needs 4 weeks minimum.",
      "Line up event insurance early. You'll need a $1,000,000 general liability certificate naming the government.",
      "Ask for an estimate of recovered labor costs. They're on top of the $100 application fee.",
      "Most guests will also want to see the dam, so build in time for photos outside.",
    ],
    url: "https://www.usbr.gov/lc/hooverdam/spillwayhouse.html", checked: "2026-10-13", status: "listed", featured: false,
  },
  {
    name: "The Retreat on Charleston Peak", slug: "retreat-on-charleston-peak", category: "desert-outdoors",
    area: "Mount Charleston (Kyle Canyon)", drive: "About 45 min from the Strip", setting: "Indoor & outdoor",
    vibe: ["Mountain", "Pine forest", "Cool weather", "Lodge"],
    priceFrom: null, priceLabel: null, guestMax: null,
    facts: [
      "The lodge markets itself as a setting for weddings, retreats and celebrations.",
      "It sits at 6,700 feet in Kyle Canyon, in the Spring Mountains National Forest.",
      "It has three event spaces.",
      "Pricing and capacity are by quote through the lodge's request form.",
    ],
    bestFor: "Couples who want pine trees and cool air instead of neon and desert heat.",
    description: `Forty-five minutes from the Strip, the road climbs into the Spring Mountains and the desert turns into pine forest. The Retreat on Charleston Peak sits at 6,700 feet in Kyle Canyon, which makes it the easiest way to give a Las Vegas wedding a mountain-lodge feel.

The altitude also means cooler temperatures than the valley floor, which matters for a summer wedding. Everything is by quote, so start with your date and headcount.`,
    tips: [
      "It's noticeably cooler at 6,700 feet. Tell guests to bring a layer, even in summer.",
      "Ask how many guests each of the three event spaces holds. The site doesn't list capacity.",
      "Mountain roads can be affected by winter weather. Ask the lodge about access for a winter date.",
    ],
    url: "https://www.larkindependent.com/hotels/retreat-on-charleston-peak/groups-events", checked: "2026-10-13", status: "listed", featured: false,
  },
  {
    name: "Old Las Vegas Mormon Fort State Historic Park",
    slug: "old-las-vegas-mormon-fort",
    category: "historic-iconic",
    area: "Downtown Las Vegas (500 E. Washington Ave.)",
    setting: "Outdoor",
    vibe: [
      "Pioneer history",
      "Adobe",
      "Downtown",
      "Small & simple"
    ],
    priceFrom: 125,
    priceLabel: "Special use permit ($100 base fee + $25 processing fee; $5 user fee extra)",
    guestMax: null,
    facts: [
      "Mormon missionaries built an adobe fort here in 1855. It was the first permanent non-native settlement in the Las Vegas Valley.",
      "The spring-fed creek drew Paiute people and travelers on the Old Spanish Trail long before the city existed.",
      "Nevada State Parks policy lists weddings as a special use. You apply to the park with the Special Use Permit form and a non-refundable $25 processing fee.",
      "Apply at least 60 days before the event. All permits need liability insurance that names the State of Nevada as an additional insured.",
      "Published fort fees: special use base fee $100 plus a $5 user fee. Group use area: $100 for 6–100 people, $200 for 101 or more.",
      "State Parks policy counts a catered wedding as commercial use.",
      "Open Tuesday–Saturday, 8 a.m.–4:30 p.m. Museum admission is $3 (12 and under free).",
      "Park rules: no drones, no dogs except service animals, and no music unless park staff authorize it."
    ],
    bestFor: "History lovers who want to marry where Las Vegas started, not where it ended up.",
    description: "Long before the neon, there was a creek, a meadow and a small adobe fort. Mormon missionaries built it in 1855 beside the spring that fed the valley, and a remnant of the original fort still stands in what is now Downtown. Spanish travelers called the spot las vegas, \"the meadows,\" and today the site gives you a ceremony setting with more history than any chapel on the Strip.\n\nThis is a permit wedding, not a package. You apply to Nevada State Parks, carry insurance, and bring your own officiant, chairs and plan. In return the fees are low, and you get a quiet corner of Downtown with adobe walls in the background.",
    tips: [
      "Start 60 days out at the latest. The permit needs a park supervisor's and a regional manager's sign-off, plus proof of insurance.",
      "The park is open Tuesday–Saturday only. Sunday and Monday weddings aren't on the table.",
      "Want music? Ask in your application. Instruments and music need staff approval during park hours.",
      "Hiring a caterer changes the permit type to commercial, so say so up front."
    ],
    url: "https://parks.nv.gov/fees/group-use-special-commercial-use",
    checked: "2026-10-18",
    status: "listed",
    featured: false
  },
  {
    name: "Ice Age Fossils State Park",
    slug: "ice-age-fossils-state-park",
    category: "desert-outdoors",
    area: "North Las Vegas (8660 N. Decatur Blvd.)",
    setting: "Outdoor",
    vibe: [
      "Ice Age",
      "Desert wash",
      "Mammoths",
      "Offbeat"
    ],
    priceFrom: 50,
    priceLabel: "Special use permit ($25 base fee + $25 processing fee; $5 user fee extra)",
    guestMax: null,
    facts: [
      "A 315-acre state park along the upper Las Vegas Wash, where fossils of Columbian mammoths, camels, dire wolves and ground sloths have been found.",
      "There's a group area with a large shade structure and picnic tables near the visitor center.",
      "Nevada State Parks policy lists weddings as a special use. You apply to the park with the Special Use Permit form and a non-refundable $25 processing fee.",
      "Apply at least 60 days before the event. All permits need liability insurance that names the State of Nevada as an additional insured.",
      "Published special use fees for this park: $25 base fee plus a $5 user fee.",
      "Open Wednesday–Sunday, 8 a.m.–4:30 p.m. Day-use entry is $3 (12 and under free).",
      "Life-size megafauna sculptures line the 0.3-mile Megafauna Trail behind the visitor center.",
      "Rules: no drones, no camping or campfires. Leashed pets are welcome."
    ],
    bestFor: "Couples who'd like a life-size mammoth in their wedding photos.",
    description: "Mammoths, camels, dire wolves and ground sloths once lived in this corner of the valley, and the fossils they left behind are why it's protected. Now it's a quiet desert wash at the north edge of town with a modern visitor center and a trail of life-size Ice Age sculptures. It's one of the more unexpected places to say vows in Clark County.\n\nAs at other Nevada state parks, a wedding here runs through a special use permit. The published fees are among the lowest you'll find. Plan a small ceremony under the shade structure, take photos with the megafauna, and keep the reception somewhere with air conditioning.",
    tips: [
      "The park is closed Monday and Tuesday, so pick a Wednesday–Sunday date.",
      "There's not much shade beyond the group structure. Aim for morning or the cooler months.",
      "Budget for liability insurance. Every Nevada State Parks permit requires it.",
      "Bring your own officiant and setup. The park issues the permit, not a package."
    ],
    url: "https://parks.nv.gov/fees/group-use-special-commercial-use",
    checked: "2026-10-18",
    status: "listed",
    featured: false
  },
  {
    name: "Lake Mead National Recreation Area",
    slug: "lake-mead-national-recreation-area",
    category: "desert-outdoors",
    area: "Lake Mead / Boulder City area",
    setting: "Outdoor",
    vibe: [
      "Lake views",
      "Desert canyons",
      "National park",
      "Elopement"
    ],
    priceFrom: 150,
    priceLabel: "Special use permit ($150 application fee)",
    guestMax: null,
    facts: [
      "1.5 million acres of mountains, canyons, valleys and two reservoirs, managed by the National Park Service.",
      "The NPS lists weddings among the activities that need a Special Use Permit.",
      "The application fee is $150, non-refundable even if the permit is denied, and is paid by credit card only. Cost recovery charges may be added.",
      "Apply at least 45 business days ahead. Applications are accepted up to one year in advance.",
      "Permit holders still pay park entry: $25 per private vehicle, valid 1–7 days.",
      "The park may require proof of liability insurance.",
      "Photos with eight or fewer people and hand-carried gear usually need no film permit.",
      "The park's Commercial Use Authorization directory lists an authorized small-wedding event company."
    ],
    bestFor: "Couples who want blue water and desert mountains without leaving the county.",
    description: "Lake Mead is the surprise in the Las Vegas desert: blue water against bare brown mountains, with a long shoreline and enough room to find a quiet spot. It's a national recreation area, which means the scenery is protected and a wedding needs a federal permit.\n\nThe permit process is clear and published. Pay the $150 application fee, give the park office about nine weeks, and expect to pay entry for each car. Couples who would rather not handle the paperwork can look at the park's directory of authorized wedding operators.",
    tips: [
      "45 business days is closer to nine calendar weeks. Count weekends and holidays out when you plan.",
      "Every guest car pays entry. Carpools or a shuttle keep costs down.",
      "Not sure you need a permit? Email the Special Park Use Office (LAKE_SPU@nps.gov) before you book anything else.",
      "Summer shoreline heat is serious. Plan around sunrise or the cooler months."
    ],
    url: "https://www.nps.gov/lake/planyourvisit/special-use-permit.htm",
    checked: "2026-10-18",
    status: "listed",
    featured: false
  },
  {
    name: "Mount Charleston (Spring Mountains)",
    slug: "spring-mountains-national-recreation-area",
    category: "desert-outdoors",
    area: "Mount Charleston (Kyle & Lee Canyons)",
    setting: "Outdoor",
    vibe: [
      "Mountain",
      "Pine forest",
      "Cool weather",
      "Elopement"
    ],
    priceFrom: null,
    priceLabel: "Noncommercial group use permit (groups of 75+)",
    guestMax: null,
    facts: [
      "Managed by the Humboldt-Toiyabe National Forest (U.S. Forest Service). The SMNRA office is at 4701 N. Torrey Pines Dr., Las Vegas (702-872-5486).",
      "Forest Service rules name weddings as a noncommercial group use. A permit is required when the group, guests included, is 75 people or more.",
      "Apply at least 72 hours ahead. The Forest Service evaluates applications within 48 hours, and an application it doesn't evaluate in time is treated as granted.",
      "The noncommercial group use permit doesn't require insurance or a bond.",
      "Picnic sites in upper Kyle Canyon sit around 7,600 feet, among ponderosa pine and mountain mahogany.",
      "The Spring Mountains Visitor Gateway's Pinion and Ponderosa group picnic sites need reservations May 1–September 30."
    ],
    bestFor: "Couples who'd trade the desert heat for pine trees and mountain air.",
    description: "Drive northwest out of the valley and the road climbs into a different climate. The Spring Mountains rise to pine forest, limestone cliffs and air that runs far cooler than the Strip. For a summer wedding, that alone makes the drive worth it.\n\nThis is national forest, so the rules are federal and fairly light. Big groups (75 or more, guests included) file a noncommercial group use permit at least 72 hours ahead. A permit doesn't reserve a spot, though, so the real work is picking a location that fits your crowd and confirming it with the SMNRA office.",
    tips: [
      "Call the SMNRA office before you lock in a spot. The 75-person rule covers noncommercial groups, so ask what applies if you hire vendors.",
      "A group use permit doesn't give you exclusive use of a site. If you need a guaranteed space, ask the office whether a reservable group picnic site can host your ceremony.",
      "Check fire restrictions (702-872-5486). Stage 1 restrictions ban fires outside developed recreation sites, so ask before planning anything with a flame.",
      "Mountain weather changes fast, and the mountain roads can get winter weather. Bring layers and a backup plan."
    ],
    url: "https://www.fs.usda.gov/managing-land/lands-minerals-geology/special-uses/applying-for-permit/non-commercial",
    checked: "2026-10-18",
    status: "listed",
    featured: false
  },
  {
    name: "Lion Habitat Ranch",
    slug: "lion-habitat-ranch",
    category: "quirky-pop-culture",
    area: "Henderson (near the M Resort, off St. Rose Pkwy & Bermuda Rd)",
    setting: "Outdoor",
    vibe: [
      "Lions",
      "Sanctuary",
      "Outdoor courtyard",
      "Offbeat"
    ],
    priceFrom: 1200,
    priceLabel: "Courtyard rental, 2 hours",
    guestMax: 150,
    facts: [
      "The ranch's FAQ lists weddings and receptions among the events it hosts, and it also offers full property rentals.",
      "Courtyard rental: $1,200 for 2 hours, $600 per extra hour. Includes 30 adults and up to 30 children; extra guests $20 each; 150 people max.",
      "A 30×30 tent, tables and chairs for up to 100, and disposable tablecloths are included at no extra charge.",
      "Feast with the Beasts is a private, glass-enclosed dining area surrounded by the lions: up to 20 guests, $300 per hour.",
      "Bookings go through a request form only (not by phone). A 50% non-refundable deposit holds the date.",
      "Helium balloons and glassware are prohibited. There's one restroom, so the ranch recommends renting porta-potties; they're required for after-hours events.",
      "Address: 382 Bruner Ave, Henderson, NV 89044."
    ],
    bestFor: "Couples who'd like a pride of lions on the guest list.",
    description: "Lion Habitat Ranch is a nonprofit sanctuary in Henderson, and it rents its courtyard for weddings and receptions. Rent during regular hours and your guests get the animal viewing loop too, which beats a photo booth as a way to keep people busy between the ceremony and the cake.\n\nFor a smaller group, the Feast with the Beasts room puts up to 20 people at a table inside glass walls with lions on the other side. It's an outdoor, bring-your-own-everything kind of venue: the ranch supplies a tent, tables and chairs, and you supply the caterer, the DJ and the extra restrooms.",
    tips: [
      "Budget for porta-potties. There's one restroom on site, and they're required after hours.",
      "Hire your own caterer and bring plates, napkins and utensils. The ranch doesn't provide them or cold storage.",
      "Skip the champagne flutes and balloons. Glassware and helium balloons aren't allowed.",
      "Give the ranch 72 hours to answer your request form, and have a rain plan. It's fully outdoors."
    ],
    url: "https://lionhabitatranch.org/product/reserve-your-event/",
    checked: "2026-10-18",
    status: "listed",
    featured: false
  },
  {
    name: "Atomic Museum",
    slug: "atomic-museum",
    category: "historic-iconic",
    area: "East of the Strip (Flamingo Rd.)",
    setting: "Indoor",
    vibe: [
      "Atomic Age",
      "Museum",
      "Retro science",
      "Nerdy"
    ],
    priceFrom: null,
    priceLabel: "Custom quote",
    guestMax: null,
    facts: [
      "The museum's private events page lists weddings and receptions, covering ceremonies, receptions and rehearsal dinners.",
      "Events take place among the exhibits and artifacts. Options range from small gatherings to full museum buyouts.",
      "No prices or capacities are published. You submit a request form with your date, times and guest count, and the events team follows up.",
      "Address: 755 E. Flamingo Rd., Las Vegas, NV 89119."
    ],
    bestFor: "Science-minded couples who think a mushroom cloud is a reasonable wedding motif.",
    description: "The Atomic Museum tells the story of the atomic age in the Las Vegas area, one of the stranger chapters in the city's history. It hosts weddings among its exhibits, from the ceremony itself to the reception and the rehearsal dinner.\n\nIt's a good fit for couples who met in a lab, a classroom or a very long argument about physics. Everything is quoted per event, and a full buyout is on the table if you want the whole museum to yourselves.",
    tips: [
      "Ask which galleries can host a seated ceremony versus a standing reception.",
      "Ask about a full buyout if you want guests to wander the exhibits during cocktail hour.",
      "Pricing is by request. Send your date, start and end times, and guest count with your first inquiry to get a usable quote."
    ],
    url: "https://www.atomicmuseum.vegas/private-events/",
    checked: "2026-10-18",
    status: "listed",
    featured: false
  },
  {
    name: "Sandy Valley Ranch",
    slug: "sandy-valley-ranch",
    category: "desert-outdoors",
    area: "Sandy Valley, NV (about 22 miles past Jean via Hwy 161 and Sandy Valley Rd)",
    setting: "Indoor & outdoor",
    vibe: [
      "Western",
      "Horses",
      "Rustic ranch",
      "Fire pit"
    ],
    priceFrom: 3000,
    priceLabel: "Basic Wedding Package",
    guestMax: 125,
    facts: [
      "The $3,000 Basic Wedding Package includes exclusive use of the ceremony and reception spaces, tables and chairs for up to 125 guests, the kitchen and bar areas, a bride's room and the outdoor fire pit.",
      "Ceremonies are held on a grass area with a ceremony arch and hay bale seating. Receptions are in the Main Ranch House, which seats up to 125.",
      "Horse add-ons: horseback entrance to the ceremony $150; post-ceremony photo ride for two $275; private sunset ride for two $350.",
      "Bar service from $20 per person and meal service from $25 per person, plus gratuity.",
      "Each wedding gets a dedicated ranch wedding planner. Bring your own officiant or arrange a Justice of the Peace.",
      "The FAQ says larger setups can reach about 200 guests, depending on layout.",
      "Address: 1411 Kingston Rd, Sandy Valley, NV 89019."
    ],
    bestFor: "Couples who want to ride in on horseback and mean it.",
    description: "Sandy Valley Ranch sits over a mountain pass from Jean, far enough out that the Strip disappears and the mesquite takes over. The ceremony happens on a patch of grass with hay bale seating, and the reception moves into a ranch house with farm tables, a bar and a dance floor.\n\nThe add-ons are the reason to come: arrive at the aisle on horseback, slip away for a photo ride after the vows, or end the night riding into the sunset, literally. The base package is one of the clearer prices in the area, and a ranch planner comes with it.",
    tips: [
      "Confirm your headcount limit early. The package says 125, the FAQ says about 200, and the inquiry form caps at 100.",
      "The bar gratuity is listed as both 18% and 20% on the same page. Ask which applies.",
      "Send guests the ranch's directions. Its own advice: if you're on a dirt road, you've made a wrong turn.",
      "Book the sunset ride for after dinner, and tell guests to bring a layer for the fire pit."
    ],
    url: "https://sandyvalleyranch.com/horseback-riding/western-weddings/",
    checked: "2026-10-18",
    status: "listed",
    featured: false
  },
  {
    name: "Madame Tussauds Las Vegas (Wax Wedding)",
    slug: "madame-tussauds-wax-wedding",
    category: "quirky-pop-culture",
    area: "The Strip (3377 S. Las Vegas Blvd)",
    drive: "On the Strip",
    setting: "Indoor",
    vibe: [
      "Celebrity",
      "Wax figures",
      "Chapel",
      "Kitschy"
    ],
    priceFrom: 199.99,
    priceLabel: "Walk-Up Wax Wedding",
    guestMax: null,
    facts: [
      "The $199.99 Walk-Up Wax Wedding includes a ceremony in the museum's little white chapel with an ordained officiant, wedding music, \"Just Married\" sashes, a mini bottle of champagne and digital photos.",
      "The $224.99 VIP Wax Wedding adds a celebrity wax figure of your choice from a provided list, one framed print and a wax cast of the couple's hands.",
      "Add-ons on the ticketing page: an extra celebrity figure $25; an extra guest ticket $29.99.",
      "The package is valid for the couple. Champagne requires guests 21+ with ID, and the wax hand experience requires age 5+.",
      "The museum's pages don't say whether the ceremony is legally binding.",
      "Address: 3377 S. Las Vegas Blvd, Ste. 2001, Las Vegas, NV 89109."
    ],
    bestFor: "Couples who want a celebrity witness who won't upstage them.",
    description: "Madame Tussauds runs a little white chapel inside the museum, and for about the price of a nice dinner it will marry you in front of a wax celebrity. Pick a figure from the list, stand at the altar, and walk out with sashes, champagne and photos.\n\nIt's light, fast and very Las Vegas. Treat it as the fun ceremony rather than the paperwork unless the museum confirms otherwise, and ask about licensing before you book.",
    tips: [
      "Ask whether your ceremony can be legal. The pages don't say, so you may need a separate legal ceremony.",
      "Each guest needs a ticket ($29.99 add-on), so count heads before checkout.",
      "Book the VIP tier if you care about the celebrity. The base package doesn't include a chosen figure."
    ],
    url: "https://www.madametussauds.com/las-vegas/tickets/ways-to-visit/wax-weddings/",
    checked: "2026-10-18",
    status: "listed",
    featured: false
  },
  {
    name: "Bugsy & Meyer's Speakeasy Count Room at Flamingo",
    slug: "flamingo-count-room-speakeasy",
    category: "quirky-pop-culture",
    area: "The Strip (Flamingo Las Vegas)",
    drive: "On the Strip",
    setting: "Indoor",
    vibe: [
      "Speakeasy",
      "Mob history",
      "Hidden room",
      "Adults only"
    ],
    priceFrom: 7000,
    priceLabel: "Speakeasy Count Room Wedding (plus tax)",
    guestMax: 25,
    facts: [
      "The Count Room is a speakeasy behind Bugsy & Meyer's Steakhouse. Guests enter through a bakery front.",
      "The package is $7,000 plus 8.375% tax, with a $5,000 food and beverage minimum for the reception right after the ceremony. A 24% gratuity applies to food and beverage.",
      "Included: a wedding planner and day-of coordinator, a ceremony officiated by Meyer Lansky II, an 18-rose bouquet, a boutonniere, one hour with a photographer, an HD ceremony video, a five-day webcast and two hours of private use of the room.",
      "Maximum 25 guests, and every guest must be 21 or older.",
      "Address: 3555 Las Vegas Blvd South, Las Vegas, NV 89109."
    ],
    bestFor: "Small, grown-up crowds who like their vows with a side of mob history.",
    description: "Flamingo Las Vegas hides a speakeasy behind its Bugsy & Meyer's Steakhouse, and you can get married in it. Your guests walk through a fake bakery front into a private room that feels a long way from the casino floor.\n\nThe package covers the ceremony, a planner, photos and video, plus two hours in the room. Once you add the reception food and drink minimum, it lands as one of the pricier small weddings on the Strip, but it's also one of the better stories.",
    tips: [
      "Plan the real budget as package plus the $5,000 food and beverage minimum, tax and gratuity.",
      "Check your guest list. It's 21 and over only, with a hard cap of 25.",
      "Use the included webcast for relatives who can't make the trip.",
      "Ask Flamingo's wedding team to confirm the package is current. The flyer isn't dated."
    ],
    url: "https://www.caesars.com/flamingo-las-vegas/things-to-do/weddings",
    checked: "2026-10-18",
    status: "listed",
    featured: false
  },
  {
    name: "Sanders Family Winery",
    slug: "sanders-family-winery",
    category: "desert-outdoors",
    area: "Pahrump, NV (south side of town)",
    drive: "About 45 min from the Strip",
    setting: "Indoor & outdoor",
    vibe: [
      "Vineyard",
      "Tuscan-style",
      "Mountain views",
      "Small town"
    ],
    priceFrom: null,
    priceLabel: "Custom quote",
    guestMax: 100,
    facts: [
      "The winery hosts wedding ceremonies and receptions for up to 100 guests.",
      "Settings listed on its weddings page: a gazebo, a walk-in vineyard and a wedding in the vineyard.",
      "Two production vineyards flank the main entrance of a Tuscan-style villa, with Mount Charleston in the background.",
      "To book, call (775) 727-1776 and the winery emails a Wedding Event Application with a two-page planning checklist.",
      "No prices are published.",
      "Address: 3780 E Kellogg Road, Pahrump, NV 89061."
    ],
    bestFor: "Couples who want vineyard rows in the Mojave and a wine list to match.",
    description: "Vineyards aren't what most people picture an hour outside Las Vegas, which is part of the appeal. Sanders Family Winery grows grapes in Pahrump on the other side of the Spring Mountains, and it hosts ceremonies and receptions among the vines and at a gazebo, with Mount Charleston behind you.\n\nThere's no package menu online, so expect to plan by phone and paperwork. That suits couples who want a relaxed, wine-country day without flying to Napa.",
    tips: [
      "Call first. The winery starts every wedding with an emailed application and checklist.",
      "Ask about prices, deposits and vendor rules on that first call. None are published.",
      "Book guest rooms in Pahrump or arrange a shuttle, since the drive back to the Strip is around 45 minutes."
    ],
    url: "https://sanderswinery.com/weddings/",
    checked: "2026-10-18",
    status: "listed",
    featured: false
  },
  {
    name: "Spanish Trail Country Club",
    slug: "spanish-trail-country-club",
    category: "strip-luxury",
    area: "Southwest Las Vegas (5050 Spanish Trail Ln.)",
    setting: "Indoor & outdoor",
    vibe: [
      "Golf course",
      "Country club",
      "Gated community",
      "Classic"
    ],
    priceFrom: null,
    priceLabel: "Custom quote",
    guestMax: null,
    facts: [
      "The clubhouse hosts weddings and private events, with dining and meeting rooms that can be set up to suit the event.",
      "The clubhouse sits inside a gated community, surrounded by a 27-hole golf course.",
      "No prices, packages or capacities are published. Inquiries go through an online form or the Private Events/Weddings Office at 702.678.1001.",
      "Address: 5050 Spanish Trail Ln., Las Vegas, NV 89113."
    ],
    bestFor: "Couples who want fairway views and a country-club polish without a casino in sight.",
    description: "Spanish Trail is one of the older private golf communities in Las Vegas, named for the historic trade route that once ran through the valley. Its clubhouse hosts weddings, and the setting is green fairways and mountain views instead of slot machines.\n\nThe club doesn't publish packages or prices, so this is a call-and-ask venue. That suits couples who want a traditional reception with a planner on the other end of the phone, and who'd rather their guests park at a clubhouse than in a casino garage.",
    tips: [
      "Ask first whether you need a member sponsor. The club's page doesn't say whether non-members can book.",
      "It's a gated community, so get gate and parking instructions to send your guests.",
      "Ask whether the ceremony can be outdoors on the course or patio, and what the heat plan is for summer dates."
    ],
    url: "https://www.spanishtrailcc.com/Inquiries/Weddings",
    checked: "2026-10-18",
    status: "listed",
    featured: false
  },
];
