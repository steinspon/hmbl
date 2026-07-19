/*
 * Single source of truth for all Himmelblå content.
 *
 * Every content-driven page reads from window.SITE_DATA:
 *   - specs.html      -> SITE_DATA.specs
 *   - guides.html     -> SITE_DATA.guides (list view, listed === true)
 *   - guide.html      -> SITE_DATA.guides (detail view, by id)
 *   - rigdown.html    -> SITE_DATA.checklist
 *   - search.html     -> builds its index from ALL of the above + SITE_DATA.staticPages
 *
 * Keeping the data here means search can never drift out of sync with the
 * pages. To add or change content, edit this file only.
 */
window.SITE_DATA = {
  // ---- Technical Reference (specs.html) ----
  specs: [
    {
      title: "Sauna Oven",
      descriptionLines: [
        "Main sauna heater.",
        "Add model details: serial number, power rating, or operating notes."
      ],
      images: [
        "images/sauna_0.webp",
        "images/sauna_1.webp",
        "images/sauna_2.webp",
        "images/sauna_3.webp",
        "images/sauna_4.webp"
      ],
      manuals: [
        { href: "files/sauna.pdf", label: "User Manual" }
      ]
    },
    {
      title: "Electricity Cupboard",
      description: "230V / 40A",
      images: [
        "images/Sikring_0.webp",
        "images/Sikring_1.webp",
        "images/Sikring_2.webp",
        "images/Sikring_3.webp",
        "images/Sikring_4.webp"
      ],
      manuals: []
    },
    {
      title: "Paint, Kitchen",
      description: "Dark grey colour, kitchen and kitchen furniture.",
      images: [
        "images/paint_kitchen_1.webp",
        "images/paint_kitchen_2.webp"
      ],
      manuals: []
    },
    {
      title: "Beis (Cabin Wood Stain)",
      descriptionLines: [
        "Tyrilin Tjærebeis (tar-based wood stain).",
        "Colour: Sort (Black) — code 0018",
        "Base: C-base",
        "Product code: SZ424 3636645:2",
        "Colour origin: Scanox A/S",
        "Can size: 0.75 L",
        "Transparent wood protection.",
        "Tinted with Jotun Colour Manager at Bygger'n Os (art. no. 97054026)."
      ],
      images: [
        "images/beis_1.webp",
        "images/beis_2.webp"
      ],
      manuals: []
    },
    {
      title: "Hoover",
      descriptionLines: ["Bosch BSGL5S3055"],
      descriptionLinks: [
        { href: "https://www.bosch-home.no/no/product/BSGL5S3055", label: "Bosch Website" }
      ],
      images: [
        "images/hoover_1.webp",
        "images/hoover_2.webp"
      ],
      manuals: [
        { href: "files/hoover.pdf", label: "User Manual" }
      ]
    },
    {
      title: "Dishwasher",
      descriptionLines: [
        "Bosch SMS4EMC06E",
        "Serie 4 — freestanding, 60 cm"
      ],
      descriptionLinks: [
        { href: "https://www.bosch-home.no/no/product/oppvaskmaskiner/frittstaaende-oppvaskmaskiner/oppvaskmaskiner-60-cm/SMS4EMC06E", label: "Bosch Website" }
      ],
      images: [
        "images/dishwasher_1.webp"
      ],
      manuals: [
        { href: "files/dishwasher.pdf", label: "User Manual" }
      ]
    },
    {
      title: "Heat Pump",
      descriptionLines: [
        "Wilfa Nordkapp 40W.",
        "7 year warranty",
        "Installed May 2025"
      ],
      images: [
        "images/heat_pump_1.webp"
      ],
      manuals: [
        { href: "files/heatpump.pdf", label: "User Manual" },
        { href: "files/heatpump_2.pdf", label: "Spec Sheet" }
      ]
    },
    {
      title: "Wifi",
      descriptionLines: [
        "SSID: Himmelblå",
        "Password: RubixCube2338"
      ],
      images: null,
      manuals: null
    },
    {
      title: "Electricity",
      descriptionLines: [
        "Nettleie: Klive",
        "Strømavtale: cheapenergy.no"
      ],
      images: null,
      manuals: null
    },
    {
      title: "Roof",
      description: "Ca. 150 kvm",
      images: null,
      manuals: null
    },
    {
      title: "Internet",
      descriptionLines: [
        "Supplier: Starlink",
        "Residential – 100 Mbps"
      ],
      images: null,
      manuals: null
    },
    {
      title: "Floor Plans",
      description: "Floor plans created with Onshape",
      images: null,
      manuals: [
        { href: "files/floorplan_1.pdf", label: "Floorplan 1" }
      ]
    }
  ],

  // ---- Guides (guides.html list + guide.html detail) ----
  // listed: shown in the Guides index. All guides are searchable regardless.
  // summary: shown in the Guides list. description: shown on the guide page.
  guides: [
    {
      id: "sauna-shutoff",
      listed: true,
      title: "Sauna Shutoff Guide",
      summary: "How to confirm that the sauna is fully shut down before leaving the cabin.",
      description: "Use this guide to confirm that the sauna is fully shut down before leaving the cabin.",
      steps: [
        {
          title: "Step 1",
          text: "Locate the sauna control dials and confirm you are looking at the correct heater controls.",
          imageTop: "images/sauna_2.webp",
          imageTopAlt: "Sauna control dials"
        },
        {
          title: "Step 2",
          text: "Turn the left dial fully back to zero. Confirm that the setting is not left on a timer or delayed start position.",
          imageBottom: "images/sauna_2.webp",
          imageBottomAlt: "Left sauna dial at zero"
        },
        {
          title: "Step 3",
          text: "Check that the sauna is no longer heating and that the heater is cooling down safely before you leave."
        }
      ]
    },
    {
      id: "bath-water-shutoff",
      listed: true,
      title: "Bathroom Water Shutoff Guide",
      summary: "How to locate and close the bathroom water shutoff valve safely.",
      description: "How to locate and close the bathroom water shutoff valve safely.",
      steps: [
        { title: "Step 1", text: "Open the service access area in the bathroom.", imageTop: "images/water_10.webp", imageTopAlt: "Bathroom service access area" },
        { title: "Step 2", text: "Locate the main shut off valve.", imageTop: "images/water_20.webp", imageTopAlt: "Main shut off valve" },
        { title: "Step 3", text: "Turn the handle down to the 3 o'clock position (OFF)." }
      ]
    },
    {
      id: "dishwasher-open",
      listed: false,
      title: "Dishwasher Leave-Open Guide",
      summary: "How to leave the dishwasher correctly after use to reduce moisture and odour.",
      description: "How to leave the dishwasher correctly after use to reduce moisture and odour.",
      steps: [
        { title: "Step 1", text: "Check that the dishwasher is switched off." },
        { title: "Step 2", text: "Leave the door slightly ajar to reduce moisture and odour build-up.", imageBottom: "images/example.webp", imageBottomAlt: "Dishwasher left slightly open" }
      ]
    },
    {
      id: "fireplace",
      listed: false,
      title: "Fireplace Ready Guide",
      summary: "How to leave the fireplace safe, tidy, and ready for the next arrival.",
      description: "How to leave the fireplace safe, tidy, and ready for the next arrival.",
      steps: [
        { title: "Step 1", text: "Check that all embers are fully out and the fireplace is safe." },
        { title: "Step 2", text: "Remove excess ash if needed.", imageBottom: "images/example.webp", imageBottomAlt: "Prepared fireplace" },
        { title: "Step 3", text: "Leave the area tidy and ready for the next arrival." }
      ]
    }
  ],

  // ---- Rig-down checklist (rigdown.html) ----
  checklist: [
    {
      section: "Bathroom",
      items: [
        {
          id: "bath-water-shutoff",
          label: "Water shut off valve OFF",
          guide: {
            blocks: [
              { type: "text", title: "Step 1", text: "Open the service access area in the bathroom." },
              { type: "image", src: "images/water_10.webp", alt: "Bathroom service access area" },
              { type: "text", title: "Step 2", text: "Locate the main shut off valve." },
              { type: "image", src: "images/water_20.webp", alt: "Main shut off valve" },
              { type: "text", title: "Step 3", text: "Turn the handle down to the 3 o'clock position (OFF)." }
            ]
          }
        },
        {
          id: "sauna-shutoff",
          label: "Sauna OFF",
          guide: {
            blocks: [
              { type: "text", title: "Step 1", text: "Left Dial (see image) is pointing to zero and sauna is not hot." },
              { type: "image", src: "images/sauna_2.webp", alt: "Sauna Power Dials" }
            ]
          }
        },
        {
          id: "bath-floor-heating",
          label: "Bathroom floor heating 20°C",
          guide: {
            blocks: [
              { type: "text", title: "Step 1", text: "Find the bathroom thermostat." },
              { type: "image", src: "images/example.webp", alt: "Bathroom thermostat" },
              { type: "text", title: "Step 2", text: "Wake the display if necessary and set the target temperature to 20°C." },
              { type: "text", title: "Step 3", text: "Confirm the setpoint is saved." }
            ]
          }
        },
        {
          id: "bath-windows",
          label: "Windows CLOSED",
          guide: null
        },
        {
          id: "bath-tap",
          label: "Tap OPEN",
          guide: {
            blocks: [
              { type: "text", title: "Step 1", text: "After shutting off the water supply, open the bathroom tap." },
              { type: "text", title: "Step 2", text: "Leave it open so the line is not left pressurised." },
              { type: "image", src: "images/example.webp", alt: "Bathroom tap left open" }
            ]
          }
        }
      ]
    },
    {
      section: "Kitchen and Living Room",
      items: [
        { id: "living-floor-heating", label: "Living room floor heating OFF", guide: null },
        {
          id: "sink-valve",
          label: "Sink valve OFF",
          guide: {
            blocks: [
              { type: "text", title: "Step 1", text: "Locate the valve just below the tap." },
              { type: "image", src: "images/tap_20.webp", alt: "Kitchen sink valve location" },
              { type: "text", title: "Step 2", text: "Turn the valve to the upwards / 12 o'clock position (OFF)." },
              { type: "image", src: "images/tap_10.webp", alt: "tap off" }
            ]
          }
        },
        { id: "kitchen-tap", label: "Tap OPEN", guide: null },
        { id: "dishwasher-off", label: "Dishwasher OFF", guide: null },
        {
          id: "dishwasher-open",
          label: "Dishwasher OPEN",
          guide: {
            blocks: [
              { type: "text", title: "Step 1", text: "Check that the dishwasher is switched off." },
              { type: "text", title: "Step 2", text: "Leave the door slightly ajar to reduce moisture and odour build-up." },
              { type: "image", src: "images/example.webp", alt: "Dishwasher left slightly open" }
            ]
          }
        },
        { id: "heat-pump-mode", label: "Heat pump mode: HEATING 17°C", guide: null },
        { id: "mill-heat", label: "Panel Ovens ON 15°C", guide: null },
        { id: "kids-heater", label: "Kids bedroom heater PLUGGED IN & ON", guide: null },
        { id: "lights-stue", label: "All lights stue OFF", guide: null },
        { id: "kitchen-bin", label: "Kitchen bin EMPTIED", guide: null },
        { id: "balcony", label: "Balcony door LOCKED", guide: null },
        { id: "chargers", label: "Charging station DISCONNECTED", guide: null },
        {
          id: "fireplace",
          label: "Fireplace CLEARED",
          guide: {
            blocks: [
              { type: "text", title: "Step 1", text: "Check that all embers are fully out and the fireplace is safe." },
              { type: "text", title: "Step 2", text: "Remove excess ash if needed." },
              { type: "image", src: "images/example.webp", alt: "Prepared fireplace" },
              { type: "text", title: "Step 3", text: "Leave the area tidy and ready for the next arrival." }
            ]
          }
        }
      ]
    },
    {
      section: "Bod",
      items: [
        { id: "bod-battery-charger", label: "Bod battery charger OFF", guide: null },
        { id: "back-door", label: "Back door LOCKED", guide: null },
        { id: "wifi-repeater", label: "WiFi repeater ON", guide: null }
      ]
    },
    {
      section: "Hallway",
      items: [
        { id: "front-light", label: "Front door light ON", guide: null },
        { id: "wall-lights", label: "Wall lights OFF", guide: null },
        { id: "underfloor", label: "Under floor heating 20°C", guide: null },
        { id: "front-door", label: "Front door LOCKED", guide: null },
        { id: "cameras", label: "Cameras set AWAY MODE", guide: null }
      ]
    }
  ],

  // ---- Static pages (content lives in HTML, summarised here for search) ----
  staticPages: [
    {
      page: "contacts.html",
      pageLabel: "Contacts",
      title: "Contacts",
      content: "Useful contacts for Himmelblå and Hummelfjell. " +
        "Strøing og Brøyting (Vakt). Langøien Grus og Transport AS. " +
        "Bestilling av faste tjenester gjøres i epost til maren.bakos@langoiengrus.no. " +
        "Ved bestilling oppgi navn, telefonnummer, hytteadresse, fakturaadresse og ønsket avtaleform. " +
        "Brøyting responstid 6 timer kr. 600. Brøyting responstid 48 timer kr. 250. " +
        "Strøing responstid 3 timer kr. 550. Graving, transport, singel, grus - ta kontakt. " +
        "Levering av ved kan bestilles på tlf. 91516929. 60 liters sekk furu kr. 120. " +
        "60 liters sekk bjørk kr. 150. 1000 liters sekk furu kr. 1200. 1200 liters sekk bjørk kr. 2000. " +
        "Fastpris per levering kr. 200. Vakt Telefon +47 906 15 090. " +
        "Gjenvinningsstasjon FIAS, fias.no/åpningstider. Telefon +47 62 49 48 00."
    },
    {
      page: "navigate.html",
      pageLabel: "Navigate To",
      title: "Navigate To",
      content: "Open destinations directly in Google Maps. Himmelblå. Bytteplassen Singsås. Støren."
    },
    {
      page: "settings.html",
      pageLabel: "Settings",
      title: "Settings",
      content: "Theme mode: Auto, Light, Dark. Daytime style: Auto, Classic, Mono."
    }
  ],

  // ---- Things to Do ----------------------------------------------------
  // Each activity is defined ONCE in `activities` and tagged with the
  // categories it belongs to. Category pages (bicycle-trips.html, walks.html)
  // list every activity whose `categories` include their id — so an activity
  // that is both a walk and a cycle trip is edited in a single place.

  // Category pages, shown as the Things to Do menu. `id` matches the values
  // used in each activity's `categories`.
  activityCategories: [
    {
      id: "bicycle-trips",
      title: "Bicycle Trips",
      href: "bicycle-trips.html",
      description: "Cycling routes around the cabin."
    },
    {
      id: "walks",
      title: "Walks",
      href: "walks.html",
      description: "Walking and hiking routes around the cabin."
    }
  ],

  // The unique activity entries. To show an entry on another category's page,
  // just add that category id to its `categories` array. Each entry gets its
  // own detail page at activity.html?id=<id>; `summary` is the short line
  // shown on the category list card, `descriptionLines` the full text shown
  // on the detail page (blank "" strings separate paragraphs).
  activities: [
    {
      id: "halvmilenget",
      title: "Halvmilenget",
      categories: ["bicycle-trips"],
      summary: "Forest and gravel trails to Halvmilenget.",
      descriptionLines: [
        "Bike trip to Halvmilenget on forest and gravel trails."
      ],
      links: [
        { href: "https://ut.no/delte-turer/1112252414", label: "View route (UT.no)" }
      ],
      images: [
        "images/halvmilenget_1.webp",
        "images/halvmilenget_2.webp",
        "images/halvmilenget_3.webp",
        "images/halvmilenget_4.webp"
      ]
    },
    {
      id: "molmannsdalsgarden",
      title: "Mølmannsdalsgården",
      categories: ["bicycle-trips", "walks"],
      summary: "Child-friendly forest trail to a historic farm — about 3.6 km each way (~1 hour on foot), good on foot or by bike.",
      descriptionLines: [
        "The trail to Mølmannsdalen farm starts at the end of Dalsveien, 3 km from Røros, where there is a car park. It is well suited to cycling and very child-friendly, running through beautiful pine forest in sheltered terrain past several small tarns. Mølmannsdalen is a rare natural gem — the valley means as much to many Røros locals as Nordmarka does to the people of Oslo. About 3.5 km from the car park you reach Mølmannsdalsgården, used mainly as a country residence for the copper works' successive directors, but also as a breeding farm and summer pasture (seter) for the shareholders of the Røros Copper Works. Today the farm is owned by Sør-Trøndelag county.",
        "",
        "For small children on bikes, stick to the main path. Walkers can take the southerly track closest to the water. It takes about an hour to walk each way — 3.6 km there and 3.6 km back.",
        "",
        "Many visitors, especially families on a Sunday outing into the valley, have long been captivated by a story tied to the farm. Catharina Borchgrevink, daughter of the copper works' director, was to marry Theodorus Mølmann, then owner of the estate. Riding out to fetch her, he fell from his horse and lost his life. It is said that Catharina still waits for her bridegroom at Mølmannsdalsgården. Several people claim to have seen her, dressed in white or black, in the great room or on the gallery of the storehouse (stabbur), carrying something. A moonlit walk, in winter or summer, can be a memorable experience: the timber of the old buildings shifts colour, the tarn lies mirror-still, and the moon sails between dark night clouds. In such a romantic atmosphere Catharina may appear on the storehouse gallery and then move slowly across the yard to the main building. (Source: Mølmannsdalen, by Thorsen and Evenås.)",
        "",
        "Mølmannsdalen nature reserve was established in 2017, and the walk passes through protected nature. The farm itself sits like an island within the protected area and is not part of the reserve; its buildings are part of the World Heritage Site.",
        "",
        "There are two outhouses and one accessible (wheelchair-friendly) outhouse — the latter by the bathing spot at Nordre Dalstjønna (the northern tarn).",
        "",
        "You can happily return along the same trail the way you came."
      ],
      images: [
        "images/molmannsdalsgarden_1.webp",
        "images/molmannsdalsgarden_2.webp",
        "images/molmannsdalsgarden_3.webp",
        "images/molmannsdalsgarden_4.webp",
        "images/molmannsdalsgarden_5.webp"
      ],
      links: [
        { href: "https://ut.no/kart/tur/1110059", label: "View route (UT.no)" },
        { href: "https://maps.app.goo.gl/74nApyqDTkEjJFd88", label: "Navigate to car park" }
      ]
    }
  ]
};
