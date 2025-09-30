// Mock insights data with proper sentiment values
export const mockInsights = {
  "metric1": {
    "bundle_response": {
      "result": {
        "insight_groups": [
          {
            "type": "ban",
            "insights": [
              {
                "result": {
                  "facts": {
                    "target_period_value": { "formatted": "92" },
                    "difference": {
                      "absolute": { "formatted": "2.5" },
                      "relative": { "formatted": "2.8%" },
                      "direction": "up"
                    },
                    "sentiment": "positive" // Green
                  }
                }
              }
            ]
          }
        ]
      }
    }
  },
  "metric2": {
    "bundle_response": {
      "result": {
        "insight_groups": [
          {
            "type": "ban",
            "insights": [
              {
                "result": {
                  "facts": {
                    "target_period_value": { "formatted": "99.97" },
                    "difference": {
                      "absolute": { "formatted": "0.1" },
                      "relative": { "formatted": "0.1%" },
                      "direction": "up"
                    },
                    "sentiment": "neutral" // Magenta
                  }
                }
              }
            ]
          }
        ]
      }
    }
  },
  "metric3": {
    "bundle_response": {
      "result": {
        "insight_groups": [
          {
            "type": "ban",
            "insights": [
              {
                "result": {
                  "facts": {
                    "target_period_value": { "formatted": "1.8" },
                    "difference": {
                      "absolute": { "formatted": "-0.3" },
                      "relative": { "formatted": "-14.3%" },
                      "direction": "down"
                    },
                    "sentiment": "negative" // Red
                  }
                }
              }
            ]
          }
        ]
      }
    }
  }
};
