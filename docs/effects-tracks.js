'use strict';
/* Recorded CC0 scene effects; see assets/effects/credits.json. */
window.CrisisEffects = {
  "clips": {
    "crack": {
      "src": "assets/effects/crack.mp3?v=634ecd30325f",
      "duration": 0.90147
    },
    "alarm": {
      "src": "assets/effects/alarm.mp3?v=e0d114fd868c",
      "duration": 3.13347
    },
    "steps": {
      "src": "assets/effects/steps.mp3?v=3a35bfa06595",
      "duration": 4.60947
    },
    "rain": {
      "src": "assets/effects/rain.mp3?v=8af3eb4886b0",
      "duration": 11.48547
    },
    "phone": {
      "src": "assets/effects/phone.mp3?v=cc4895e6337e",
      "duration": 1.90947
    },
    "vibrate": {
      "src": "assets/effects/vibrate.mp3?v=57b02c23c774",
      "duration": 1.04547
    },
    "click": {
      "src": "assets/effects/click.mp3?v=8c0afb0f91fd",
      "duration": 0.28947
    },
    "page": {
      "src": "assets/effects/page.mp3?v=25459953077b",
      "duration": 0.97347
    },
    "pen": {
      "src": "assets/effects/pen.mp3?v=b1e6ab086fee",
      "duration": 2.70147
    },
    "pickup": {
      "src": "assets/effects/pickup.mp3?v=ef16f02f440a",
      "duration": 0.72147
    },
    "ringback": {
      "src": "assets/effects/ringback.mp3?v=567eebaa1792",
      "duration": 1.40547
    },
    "notify": {
      "src": "assets/effects/notify.mp3?v=45910d3d23e6",
      "duration": 0.39747
    }
  },
  "tracks": {
    "update1": [
      {
        "scene": 0,
        "at": 0.28,
        "clip": "crack",
        "gain": 0.9,
        "fadeIn": 0.004,
        "fadeOut": 0.16
      },
      {
        "scene": 1,
        "at": -0.35,
        "clip": "alarm",
        "gain": 0.7,
        "duration": 3,
        "fadeIn": 0.18,
        "fadeOut": 0.7
      },
      {
        "scene": 1,
        "at": 0.3,
        "clip": "steps",
        "gain": 0.68,
        "duration": 4.2,
        "fadeIn": 0.08,
        "fadeOut": 1.2
      },
      {
        "scene": 2,
        "at": 0.1,
        "clip": "click",
        "gain": 0.48,
        "duration": 0.28,
        "fadeOut": 0.02
      },
      {
        "scene": 2,
        "at": 0.5,
        "clip": "page",
        "gain": 0.52,
        "rate": 1.05
      },
      {
        "scene": 3,
        "at": -0.4,
        "clip": "rain",
        "gain": 0.65,
        "duration": 10.5,
        "fadeIn": 0.7,
        "fadeOut": 2.7
      },
      {
        "scene": 4,
        "at": 0.15,
        "clip": "ringback",
        "gain": 0.63,
        "duration": 1.3,
        "fadeIn": 0.04,
        "fadeOut": 0.15
      },
      {
        "scene": 5,
        "at": -0.35,
        "clip": "vibrate",
        "gain": 0.63,
        "duration": 1,
        "fadeOut": 0.15
      },
      {
        "scene": 5,
        "at": 0.5,
        "clip": "notify",
        "gain": 0.55
      },
      {
        "scene": 5,
        "at": 1.16,
        "clip": "notify",
        "gain": 0.4,
        "rate": 1.07
      },
      {
        "scene": 6,
        "at": -0.26,
        "clip": "notify",
        "gain": 0.58,
        "rate": 0.92
      },
      {
        "scene": 6,
        "at": 0.08000000000000002,
        "clip": "notify",
        "gain": 0.38,
        "rate": 1.1
      },
      {
        "scene": 6,
        "at": 0.59,
        "clip": "click",
        "gain": 0.4,
        "duration": 0.28,
        "fadeOut": 0.03
      },
      {
        "scene": 7,
        "at": -0.24,
        "clip": "page",
        "gain": 0.55,
        "rate": 0.9
      },
      {
        "scene": 7,
        "at": 0.65,
        "clip": "pen",
        "gain": 0.58,
        "duration": 1.8,
        "fadeIn": 0.04,
        "fadeOut": 0.22
      },
      {
        "scene": 7,
        "at": 22.465,
        "clip": "pen",
        "gain": 0.48,
        "duration": 0.3750000000000007,
        "fadeIn": 0.03,
        "fadeOut": 0.14
      }
    ],
    "update2": [
      {
        "scene": 0,
        "at": 0.12,
        "clip": "page",
        "gain": 0.58,
        "rate": 0.88
      },
      {
        "scene": 0,
        "at": 0.95,
        "clip": "click",
        "gain": 0.42,
        "duration": 0.28,
        "fadeOut": 0.03
      },
      {
        "scene": 1,
        "at": -0.35,
        "clip": "vibrate",
        "gain": 0.68,
        "duration": 1,
        "fadeOut": 0.15
      },
      {
        "scene": 1,
        "at": 0.25,
        "clip": "notify",
        "gain": 0.58
      },
      {
        "scene": 1,
        "at": 0.78,
        "clip": "notify",
        "gain": 0.47,
        "rate": 1.08
      },
      {
        "scene": 1,
        "at": 1.3,
        "clip": "notify",
        "gain": 0.38,
        "rate": 0.94
      },
      {
        "scene": 2,
        "at": -0.2,
        "clip": "click",
        "gain": 0.55,
        "duration": 0.28,
        "fadeOut": 0.025
      },
      {
        "scene": 2,
        "at": 0.1,
        "clip": "page",
        "gain": 0.58,
        "rate": 1.08
      },
      {
        "scene": 2,
        "at": 0.98,
        "clip": "page",
        "gain": 0.48,
        "rate": 0.96
      },
      {
        "scene": 3,
        "at": -0.48,
        "clip": "page",
        "gain": 0.65,
        "rate": 0.88
      },
      {
        "scene": 3,
        "at": 0.68,
        "clip": "click",
        "gain": 0.43,
        "duration": 0.28,
        "fadeOut": 0.025
      },
      {
        "scene": 4,
        "at": -0.5,
        "clip": "phone",
        "gain": 0.72,
        "duration": 1.8,
        "fadeIn": 0.08,
        "fadeOut": 0.24
      },
      {
        "scene": 4,
        "at": 2.8,
        "clip": "phone",
        "gain": 0.43,
        "duration": 1.6,
        "fadeIn": 0.08,
        "fadeOut": 0.55
      },
      {
        "scene": 5,
        "at": -0.35,
        "clip": "notify",
        "gain": 0.58,
        "rate": 0.92
      },
      {
        "scene": 5,
        "at": -0.009999999999999953,
        "clip": "notify",
        "gain": 0.38,
        "rate": 1.1
      },
      {
        "scene": 5,
        "at": 0.5,
        "clip": "click",
        "gain": 0.4,
        "duration": 0.28,
        "fadeOut": 0.03
      },
      {
        "scene": 6,
        "at": -0.26,
        "clip": "phone",
        "gain": 0.63,
        "duration": 0.95,
        "fadeIn": 0.05,
        "fadeOut": 0.16
      },
      {
        "scene": 6,
        "at": 0.73,
        "clip": "pickup",
        "gain": 0.7,
        "fadeOut": 0.08
      },
      {
        "scene": 6,
        "at": 15.37,
        "clip": "click",
        "gain": 0.42,
        "duration": 0.28,
        "fadeOut": 0.03
      },
      {
        "scene": 7,
        "at": -0.24,
        "clip": "page",
        "gain": 0.55,
        "rate": 0.9
      },
      {
        "scene": 7,
        "at": 0.65,
        "clip": "pen",
        "gain": 0.58,
        "duration": 1.8,
        "fadeIn": 0.04,
        "fadeOut": 0.22
      },
      {
        "scene": 7,
        "at": 22.815,
        "clip": "pen",
        "gain": 0.48,
        "duration": 0.8,
        "fadeIn": 0.03,
        "fadeOut": 0.14
      }
    ],
    "update3": [
      {
        "scene": 0,
        "at": 0.1,
        "clip": "page",
        "gain": 0.68,
        "rate": 0.83
      },
      {
        "scene": 0,
        "at": 1.07,
        "clip": "click",
        "gain": 0.46,
        "duration": 0.28,
        "fadeOut": 0.02
      },
      {
        "scene": 1,
        "at": -0.3,
        "clip": "page",
        "gain": 0.58,
        "rate": 0.91
      },
      {
        "scene": 1,
        "at": 0.8,
        "clip": "page",
        "gain": 0.58,
        "rate": 1.07
      },
      {
        "scene": 2,
        "at": -0.2,
        "clip": "notify",
        "gain": 0.58,
        "rate": 0.92
      },
      {
        "scene": 2,
        "at": 0.14,
        "clip": "notify",
        "gain": 0.38,
        "rate": 1.1
      },
      {
        "scene": 2,
        "at": 0.6499999999999999,
        "clip": "click",
        "gain": 0.4,
        "duration": 0.28,
        "fadeOut": 0.03
      },
      {
        "scene": 3,
        "at": -0.12,
        "clip": "click",
        "gain": 0.62,
        "duration": 0.28,
        "fadeOut": 0.02
      },
      {
        "scene": 3,
        "at": 0.48,
        "clip": "click",
        "gain": 0.35,
        "duration": 0.28,
        "rate": 0.85,
        "fadeOut": 0.03
      },
      {
        "scene": 3,
        "at": 21.37,
        "clip": "click",
        "gain": 0.42,
        "duration": 0.28,
        "fadeOut": 0.02
      },
      {
        "scene": 4,
        "at": 0.12,
        "clip": "page",
        "gain": 0.68,
        "rate": 0.86
      },
      {
        "scene": 5,
        "at": -0.22,
        "clip": "click",
        "gain": 0.44,
        "duration": 0.28,
        "fadeOut": 0.02
      },
      {
        "scene": 5,
        "at": 0.2,
        "clip": "page",
        "gain": 0.53,
        "rate": 1.11
      },
      {
        "scene": 6,
        "at": -0.32,
        "clip": "vibrate",
        "gain": 0.63,
        "duration": 1,
        "fadeOut": 0.15
      },
      {
        "scene": 6,
        "at": 0.6,
        "clip": "notify",
        "gain": 0.56
      },
      {
        "scene": 6,
        "at": 1.1,
        "clip": "click",
        "gain": 0.36,
        "duration": 0.28,
        "fadeOut": 0.02
      },
      {
        "scene": 7,
        "at": -0.24,
        "clip": "page",
        "gain": 0.55,
        "rate": 0.9
      },
      {
        "scene": 7,
        "at": 0.65,
        "clip": "pen",
        "gain": 0.58,
        "duration": 1.8,
        "fadeIn": 0.04,
        "fadeOut": 0.22
      },
      {
        "scene": 7,
        "at": 27.09,
        "clip": "pen",
        "gain": 0.48,
        "duration": 0.7500000000000007,
        "fadeIn": 0.03,
        "fadeOut": 0.14
      }
    ]
  }
};
